import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { CIRAChannel } from './CIRAChannel'
import { connectionParams, HttpHandler } from './HttpHandler'

describe('CIRA Channel', () => {
  let ciraChannel: CIRAChannel
  let socket: CIRASocket
  const httpHeader200 = 'HTTP/1.1 200 OK\r\nDate: Mon, 10 Jan 2022 20:37:48 GMT\r\nServer: Intel(R) Active Management Technology 15.0.23.1706\r\nX-Frame-Options: DENY\r\nContent-Type: application/soap+xml; charset=UTF-8\r\nTransfer-Encoding: chunked\r\n'
  const enumCimSoftwareIdentityResponse = '\r\n0220\r\n<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.xmlsoap.org/ws/2004/09/enumeration" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Hea\r\n022A\r\nder><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:RelatesTo>0</b:RelatesTo><b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000000030</b:MessageID><c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity</c:ResourceURI></a:Header><a:Body><g:EnumerateResponse><g:EnumerationContext>17000000-0000-0000-0000-000000000000</g:EnumerationContext></g:EnumerateResponse></a:Body></a:Envelope>\r\n0\r\n\r\n'
  beforeEach(() => {
    socket = { tag: { nextChannelId: 0 } } as any
    ciraChannel = new CIRAChannel(new HttpHandler(), 4000, socket)
  })
  it('should initialize', () => {
    expect(ciraChannel).toBeDefined()
    expect(ciraChannel.state).toBe(1)
    expect(ciraChannel.amtpendingcredits).toBe(0)
    expect(ciraChannel.amtCiraWindow).toBe(0)
    expect(ciraChannel.ciraWindow).toBe(32768)
    expect(ciraChannel.onStateChange).toBeDefined()
    expect(ciraChannel.onData).toBeDefined()
  })
  it('should handle onData', () => {
    ciraChannel.onData('test')
  })
  it('should reject when channel closed on write data', async () => {
    ciraChannel.state = 0
    let error
    try {
      await ciraChannel.writeData(null, null, '1')
    } catch (err) {
      error = err?.message
    } finally {
      expect(error).toBe('Closed')
    }
  })
  it('should close channel when closed', () => {
    ciraChannel.state = 0
    const state = ciraChannel.CloseChannel()
    expect(state).toBe(0)
  })
  it('should close channel when closing', () => {
    ciraChannel.state = 1
    const state = ciraChannel.CloseChannel()
    expect(state).toBe(0)
  })
  it('should close channel when open', () => {
    ciraChannel.state = 2
    ciraChannel.amtchannelid = 44
    const sendChannelSpy = jest.spyOn(APFProcessor, 'SendChannelClose').mockImplementation(() => {})
    const state = ciraChannel.CloseChannel()
    expect(sendChannelSpy).toHaveBeenCalledWith(socket, 44)
    expect(state).toBe(0)
  })
  it('should write data to channel', async () => {
    ciraChannel.state = 2
    ciraChannel.sendcredits = 499
    const data = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body></Body></Envelope>'
    const params: connectionParams = {
      guid: '4c4c4544-004b-4210-8033-b6c04f504633',
      port: 16992,
      digestChallenge: null,
      username: 'admin',
      password: 'P@ssw0rd'
    }
    const sendChannelSpy = jest.spyOn(APFProcessor, 'SendChannelData').mockImplementation(() => {})

    const writePromise = ciraChannel.writeData(data, params, '1')
    ciraChannel.onData(httpHeader200 + enumCimSoftwareIdentityResponse)
    const responseData = await writePromise

    expect(responseData).toEqual(httpHeader200 + enumCimSoftwareIdentityResponse)
    // await expect(ciraChannel.writeData(data, params, '1')).rejects.toEqual(1)
    expect(sendChannelSpy).toHaveBeenCalledTimes(1)
    expect(ciraChannel.sendcredits).toBe(0)
  })
})
