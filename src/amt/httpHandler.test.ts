import { CIM } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { DigestChallenge } from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'
import { connectionParams, HttpHandler } from './HttpHandler'

const httpHandler = new HttpHandler()

it('should return null when it parse empty string', async () => {
  const xml: string = ''
  const result = httpHandler.parseXML(xml)
  expect(result).toBe(null)
})
it('should throw an error and return null when it parse invalid xml', async () => {
  const xml: string = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.xmlsoap.org/ws/2004/09/enumeration" xmlns:h="http:/…xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address><b:ReferenceParameters><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</c:ResourceURI><c:SelectorSet><c:Selector Name="CreationClassName">CIM_ComputerSystem</c:Selector><c:Selector Name="Name">ManagedSystem</c:Selector></c:SelectorSet></b:ReferenceParameters></h:UserOfService></h:CIM_AssociatedPowerManagementService></g:Items><g:EndOfSequence></g:EndOfSequence></g:PullResponse></a:Body></a:Envelope>'
  const result = httpHandler.parseXML(xml)
  expect(result).toBe(null)
})
it('should parse authentication response header', async () => {
  const digestChallenge = {
    realm: 'Digest:56ABC7BE224EF620C69EB88F01071DC8',
    nonce: 'fVNueyEAAAAAAAAAcO8WqJ8s+WdyFUIY',
    stale: 'false',
    qop: 'auth'
  }
  const value: string = 'Digest realm="Digest:56ABC7BE224EF620C69EB88F01071DC8", nonce="fVNueyEAAAAAAAAAcO8WqJ8s+WdyFUIY",stale="false",qop="auth"'
  const result: DigestChallenge = httpHandler.parseAuthenticateResponseHeader(value)
  expect(JSON.stringify(result)).toBe(JSON.stringify(digestChallenge))
})
it('should return a WSMan request', async () => {
  const cim = new CIM.CIM()
  const xmlRequestBody = cim.ServiceAvailableToElement(CIM.Methods.ENUMERATE, '1')
  const digestChallenge = {
    realm: 'Digest:56ABC7BE224EF620C69EB88F01071DC8',
    nonce: 'fVNueyEAAAAAAAAAcO8WqJ8s+WdyFUIY',
    stale: 'false',
    qop: 'auth'
  }
  const params: connectionParams = {
    guid: '4c4c4544-004b-4210-8033-b6c04f504633',
    port: 16992,
    digestChallenge: digestChallenge,
    username: 'admin',
    password: 'P@ssw0rd'
  }
  const result = httpHandler.wrapIt(params, xmlRequestBody)
  expect(result).toContain('Authorization')
})
it('should return a null when no xml is passed to wrap a WSMan request', async () => {
  const digestChallenge = {
    realm: 'Digest:56ABC7BE224EF620C69EB88F01071DC8',
    nonce: 'fVNueyEAAAAAAAAAcO8WqJ8s+WdyFUIY',
    stale: 'false',
    qop: 'auth'
  }
  const params: connectionParams = {
    guid: '4c4c4544-004b-4210-8033-b6c04f504633',
    port: 16992,
    digestChallenge: digestChallenge,
    username: 'admin',
    password: 'P@ssw0rd'
  }
  const result = httpHandler.wrapIt(params, null)
  expect(result).toBe(null)
})
it('should throw and expection and return a null when connection params are not passed to wrap a WSMan request', async () => {
  const cim = new CIM.CIM()
  const xmlRequestBody = cim.ServiceAvailableToElement(CIM.Methods.ENUMERATE, '1')
  const result = httpHandler.wrapIt(null, xmlRequestBody)
  expect(result).toBe(null)
})
/*  it('should return a WSMan request without Authorization when digest Challenge is null', async () => {
    const xmlRequestBody = `POST /wsman HTTP/1.1
Host: 4c4c4544-004b-4210-8033-b6c04f504633:16992
Transfer-Encoding: chunked

32F
<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>
0

`
    const cim = new CIM()
    const rawXML = cim.ServiceAvailableToElement(CIM.Methods.ENUMERATE, '1')
    const params: connectionParams = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      port: 16992,
      digestChallenge: undefined,
      username: 'admin',
      password: 'P@ssw0rd'
    }
    const result = httpHandler.wrapIt(params, rawXML)
    console.log(result)
    expect(result).toBe(xmlRequestBody)
  }) */
