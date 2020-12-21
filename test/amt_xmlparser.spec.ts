
import { ParseWsman } from '../src/amt_libraries/amt-xml'

describe('AMT related XML parser testing ', () => {
  // AMT_audilog
  it('should convert AMT_auditlog Output XML To JSON', async () => {
    const xmlOutput = `
      <?xml version="1.0" encoding="UTF-8"?>
      <a:Envelope
          xmlns:a="http://www.w3.org/2003/05/soap-envelope"
          xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
          xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
          xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
          xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
          xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
          xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"
          xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <a:Header>
              <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
              <b:RelatesTo>1</b:RelatesTo>
              <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
              <b:MessageID>uuid:00000000-8086-8086-8086-000000013472</b:MessageID>
              <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</c:ResourceURI>
          </a:Header>
          <a:Body>
              <g:AMT_AuditLog>
                  <g:AuditState>16</g:AuditState>
                  <g:CurrentNumberOfRecords>864</g:CurrentNumberOfRecords>
                  <g:ElementName>Intel(r) AMT Audit Log</g:ElementName>
                  <g:EnabledState>2</g:EnabledState>
                  <g:MaxAllowedAuditors>1</g:MaxAllowedAuditors>
                  <g:MaxNumberOfRecords>0</g:MaxNumberOfRecords>
                  <g:Name>Intel(r) AMT:Audit Log</g:Name>
                  <g:OverwritePolicy>2</g:OverwritePolicy>
                  <g:PercentageFree>57</g:PercentageFree>
                  <g:RequestedState>2</g:RequestedState>
                  <g:StoragePolicy>1</g:StoragePolicy>
                  <g:TimeOfLastRecord>
                      <h:Datetime>2019-05-16T18:22:26Z</h:Datetime>
                  </g:TimeOfLastRecord>
              </g:AMT_AuditLog>
          </a:Body>
      </a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
      {
        Header: {
          To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          RelatesTo: '1',
          Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
          MessageID: 'uuid:00000000-8086-8086-8086-000000013472',
          ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog',
          Method: 'AMT_AuditLog'
        },
        Body: {
          AuditState: 16,
          CurrentNumberOfRecords: 864,
          ElementName: 'Intel(r) AMT Audit Log',
          EnabledState: 2,
          MaxAllowedAuditors: 1,
          MaxNumberOfRecords: 0,
          Name: 'Intel(r) AMT:Audit Log',
          OverwritePolicy: 2,
          PercentageFree: 57,
          RequestedState: 2,
          StoragePolicy: 1,
          TimeOfLastRecord: {
            Datetime: '2019-05-16T18:22:26Z'
          }
        }
      }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_messagelog
  it('should convert AMT_MeesageLog Output XML To JSON', async () => {
    const xmlOutput = `
        <?xml version="1.0" encoding="UTF-8"?>
           <a:Envelope
            xmlns:a="http://www.w3.org/2003/05/soap-envelope"
            xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
            xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
            xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
            xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
            xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
       <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>1</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-00000001346F</b:MessageID>
            <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:AMT_MessageLog>
            <g:Capabilities>5</g:Capabilities>
            <g:Capabilities>6</g:Capabilities>
            <g:Capabilities>8</g:Capabilities>
            <g:Capabilities>7</g:Capabilities>
            <g:CharacterSet>10</g:CharacterSet>
            <g:CreationClassName>AMT_MessageLog</g:CreationClassName>
            <g:CurrentNumberOfRecords>96</g:CurrentNumberOfRecords>
            <g:ElementName>Intel(r) AMT:MessageLog 1</g:ElementName>
            <g:EnabledDefault>2</g:EnabledDefault>
            <g:EnabledState>2</g:EnabledState>
            <g:HealthState>5</g:HealthState>
            <g:IsFrozen>false</g:IsFrozen>
            <g:LastChange>0</g:LastChange>
            <g:LogState>4</g:LogState>
            <g:MaxLogSize>0</g:MaxLogSize>
            <g:MaxNumberOfRecords>390</g:MaxNumberOfRecords>
            <g:MaxRecordSize>21</g:MaxRecordSize>
            <g:Name>Intel(r) AMT:MessageLog 1</g:Name>
            <g:OperationalStatus>2</g:OperationalStatus>
            <g:OverwritePolicy>2</g:OverwritePolicy>
            <g:PercentageNearFull>24</g:PercentageNearFull>
            <g:RequestedState>12</g:RequestedState>
            <g:SizeOfHeader>0</g:SizeOfHeader>
            <g:SizeOfRecordHeader>0</g:SizeOfRecordHeader>
            <g:Status>OK</g:Status>
        </g:AMT_MessageLog>
    </a:Body>
</a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '1',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-00000001346F',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog',
            Method: 'AMT_MessageLog'
          },
          Body: {
            Capabilities: [
              5,
              6,
              8,
              7
            ],
            CharacterSet: 10,
            CreationClassName: 'AMT_MessageLog',
            CurrentNumberOfRecords: 96,
            ElementName: 'Intel(r) AMT:MessageLog 1',
            EnabledDefault: 2,
            EnabledState: 2,
            HealthState: 5,
            IsFrozen: false,
            LastChange: 0,
            LogState: 4,
            MaxLogSize: 0,
            MaxNumberOfRecords: 390,
            MaxRecordSize: 21,
            Name: 'Intel(r) AMT:MessageLog 1',
            OperationalStatus: 2,
            OverwritePolicy: 2,
            PercentageNearFull: 24,
            RequestedState: 12,
            SizeOfHeader: 0,
            SizeOfRecordHeader: 0,
            Status: 'OK'
          }
        }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_AuditPolicyRule
  it('should convert AMT_AuditPolicyRule Output XML To JSON', async () => {
    const xmlOutput = `
        <?xml version="1.0" encoding="UTF-8"?>
           <a:Envelope
            xmlns:a="http://www.w3.org/2003/05/soap-envelope"
            xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
            xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
            xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
            xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
            xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/common"
            <?xml version="1.0" encoding="UTF-8"?>
            <a:Envelope
                xmlns:a="http://www.w3.org/2003/05/soap-envelope"
                xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
                xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
                xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
                xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
                xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditPolicyRule"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <a:Header>
                    <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                    <b:RelatesTo>1</b:RelatesTo>
                    <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
                    <b:MessageID>uuid:00000000-8086-8086-8086-000000013471</b:MessageID>
                    <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditPolicyRule</c:ResourceURI>
                </a:Header>
                <a:Body>
                    <g:AMT_AuditPolicyRule>
                        <g:AuditApplicationEventID>1048576</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048577</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048578</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048579</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048580</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048581</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048582</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048583</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048584</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048585</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048586</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048587</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048588</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048589</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048590</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048593</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048594</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1048595</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1114112</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1114113</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1114114</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1114115</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1114116</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179648</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179649</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179650</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179651</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179652</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179653</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179654</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179655</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179656</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179657</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179658</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179659</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1179660</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1245184</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1245185</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1310720</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1310721</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1310722</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1310723</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1310724</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1310725</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1376256</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1769475</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1769476</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1900544</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1900545</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1900546</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1900547</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1900548</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1966080</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1966081</g:AuditApplicationEventID>
                        <g:AuditApplicationEventID>1966082</g:AuditApplicationEventID>
                        <g:CreationClassName>AMT_AuditPolicyRule</g:CreationClassName>
                        <g:ElementName>Intel(r) AMT Audit Policy Rule</g:ElementName>
                        <g:PolicyRuleName>Audit Policy Rule</g:PolicyRuleName>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:PolicyType>0</g:PolicyType>
                        <g:SystemCreationClassName>CIM_ComputerSystem</g:SystemCreationClassName>
                        <g:SystemName>Intel(r) AMT</g:SystemName>
                    </g:AMT_AuditPolicyRule>
                </a:Body>
            </a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '1',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-000000013471',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditPolicyRule',
            Method: 'AMT_AuditPolicyRule'
          },
          Body: {
            AuditApplicationEventID: [
              1048576,
              1048577,
              1048578,
              1048579,
              1048580,
              1048581,
              1048582,
              1048583,
              1048584,
              1048585,
              1048586,
              1048587,
              1048588,
              1048589,
              1048590,
              1048593,
              1048594,
              1048595,
              1114112,
              1114113,
              1114114,
              1114115,
              1114116,
              1179648,
              1179649,
              1179650,
              1179651,
              1179652,
              1179653,
              1179654,
              1179655,
              1179656,
              1179657,
              1179658,
              1179659,
              1179660,
              1245184,
              1245185,
              1310720,
              1310721,
              1310722,
              1310723,
              1310724,
              1310725,
              1376256,
              1769475,
              1769476,
              1900544,
              1900545,
              1900546,
              1900547,
              1900548,
              1966080,
              1966081,
              1966082
            ],
            CreationClassName: 'AMT_AuditPolicyRule',
            ElementName: 'Intel(r) AMT Audit Policy Rule',
            PolicyRuleName: 'Audit Policy Rule',
            PolicyType: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            SystemCreationClassName: 'CIM_ComputerSystem',
            SystemName: 'Intel(r) AMT'
          }
        }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_BootCapabilities
  it('should convert AMT_BootCapabilities Output XML To JSON', async () => {
    const xmlOutput = `
        <?xml version="1.0" encoding="UTF-8"?>
        <a:Envelope
            xmlns:a="http://www.w3.org/2003/05/soap-envelope"
            xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
            xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
            xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
            xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
            xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <a:Header>
                <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                <b:RelatesTo>1</b:RelatesTo>
                <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
                <b:MessageID>uuid:00000000-8086-8086-8086-00000001347D</b:MessageID>
                <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</c:ResourceURI>
            </a:Header>
            <a:Body>
                <g:AMT_BootCapabilities>
                    <g:BIOSPause>true</g:BIOSPause>
                    <g:BIOSReflash>true</g:BIOSReflash>
                    <g:BIOSSecureBoot>false</g:BIOSSecureBoot>
                    <g:BIOSSetup>true</g:BIOSSetup>
                    <g:ConfigurationDataReset>false</g:ConfigurationDataReset>
                    <g:ElementName>Intel(r) AMT: Boot Capabilities</g:ElementName>
                    <g:ForceCDorDVDBoot>true</g:ForceCDorDVDBoot>
                    <g:ForceDiagnosticBoot>false</g:ForceDiagnosticBoot>
                    <g:ForceHardDriveBoot>true</g:ForceHardDriveBoot>
                    <g:ForceHardDriveSafeModeBoot>false</g:ForceHardDriveSafeModeBoot>
                    <g:ForcePXEBoot>true</g:ForcePXEBoot>
                    <g:ForcedProgressEvents>true</g:ForcedProgressEvents>
                    <g:IDER>true</g:IDER>
                    <g:InstanceID>Intel(r) AMT:BootCapabilities 0</g:InstanceID>
                    <g:KeyboardLock>true</g:KeyboardLock>
                    <g:PowerButtonLock>false</g:PowerButtonLock>
                    <g:ResetButtonLock>false</g:ResetButtonLock>
                    <g:SOL>true</g:SOL>
                    <g:SleepButtonLock>false</g:SleepButtonLock>
                    <g:UserPasswordBypass>true</g:UserPasswordBypass>
                    <g:VerbosityQuiet>true</g:VerbosityQuiet>
                    <g:VerbosityScreenBlank>true</g:VerbosityScreenBlank>
                    <g:VerbosityVerbose>true</g:VerbosityVerbose>
                </g:AMT_BootCapabilities>
            </a:Body>
        </a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '1',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-00000001347D',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities',
            Method: 'AMT_BootCapabilities'
          },
          Body: {
            BIOSPause: true,
            BIOSReflash: true,
            BIOSSecureBoot: false,
            BIOSSetup: true,
            ConfigurationDataReset: false,
            ElementName: 'Intel(r) AMT: Boot Capabilities',
            ForceCDorDVDBoot: true,
            ForceDiagnosticBoot: false,
            ForceHardDriveBoot: true,
            ForceHardDriveSafeModeBoot: false,
            ForcePXEBoot: true,
            ForcedProgressEvents: true,
            IDER: true,
            InstanceID: 'Intel(r) AMT:BootCapabilities 0',
            KeyboardLock: true,
            PowerButtonLock: false,
            ResetButtonLock: false,
            SOL: true,
            SleepButtonLock: false,
            UserPasswordBypass: true,
            VerbosityQuiet: true,
            VerbosityScreenBlank: true,
            VerbosityVerbose: true
          }
        }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_BootSettingData
  it('should convert AMT_BootSettingData Output XML To JSON', async () => {
    const xmlOutput = `
        <?xml version="1.0" encoding="UTF-8"?>
           <a:Envelope
                xmlns:a="http://www.w3.org/2003/05/soap-envelope"
                xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
                xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
                xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
                xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
                xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <a:Header>
                <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                <b:RelatesTo>1</b:RelatesTo>
                <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
                <b:MessageID>uuid:00000000-8086-8086-8086-00000001347C</b:MessageID>
                <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</c:ResourceURI>
            </a:Header>
            <a:Body>
                <g:AMT_BootSettingData>
                <g:BIOSPause>false</g:BIOSPause>
                <g:BIOSSetup>false</g:BIOSSetup>
                <g:BootMediaIndex>0</g:BootMediaIndex>
                <g:ConfigurationDataReset>false</g:ConfigurationDataReset>
                <g:ElementName>Intel(r) AMT Boot Configuration Settings</g:ElementName>
                <g:EnforceSecureBoot>false</g:EnforceSecureBoot>
                <g:FirmwareVerbosity>0</g:FirmwareVerbosity>
                <g:ForcedProgressEvents>false</g:ForcedProgressEvents>
                <g:IDERBootDevice>0</g:IDERBootDevice>
                <g:InstanceID>Intel(r) AMT:BootSettingData 0</g:InstanceID>
                <g:LockKeyboard>false</g:LockKeyboard>
                <g:LockPowerButton>false</g:LockPowerButton>
                <g:LockResetButton>false</g:LockResetButton>
                <g:LockSleepButton>false</g:LockSleepButton>
                <g:OwningEntity>Intel(r) AMT</g:OwningEntity>
                <g:ReflashBIOS>false</g:ReflashBIOS>
                <g:UseIDER>false</g:UseIDER>
                <g:UseSOL>false</g:UseSOL>
                <g:UseSafeMode>false</g:UseSafeMode>
                <g:UserPasswordBypass>false</g:UserPasswordBypass>
                </g:AMT_BootSettingData>
            </a:Body>
        </a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '1',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-00000001347C',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData',
            Method: 'AMT_BootSettingData'
          },
          Body: {
            BIOSPause: false,
            BIOSSetup: false,
            BootMediaIndex: 0,
            ConfigurationDataReset: false,
            ElementName: 'Intel(r) AMT Boot Configuration Settings',
            EnforceSecureBoot: false,
            FirmwareVerbosity: 0,
            ForcedProgressEvents: false,
            IDERBootDevice: 0,
            InstanceID: 'Intel(r) AMT:BootSettingData 0',
            LockKeyboard: false,
            LockPowerButton: false,
            LockResetButton: false,
            LockSleepButton: false,
            OwningEntity: 'Intel(r) AMT',
            ReflashBIOS: false,
            UseIDER: false,
            UseSOL: false,
            UseSafeMode: false,
            UserPasswordBypass: false
          }
        }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_EnvironmentDetectionSettingData
  it('should convert AMT_EnvironmentDetectionSettingData Output XML To JSON', async () => {
    const xmlOutput = `
     <?xml version="1.0" encoding="UTF-8"?>
        <a:Envelope
            xmlns:a="http://www.w3.org/2003/05/soap-envelope"
            xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
            xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
            xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
            xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
            xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>1</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-00000001346E</b:MessageID>
            <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:AMT_EnvironmentDetectionSettingData>
            <g:DetectionAlgorithm>0</g:DetectionAlgorithm>
            <g:DetectionStrings>dummy.com</g:DetectionStrings>
            <g:ElementName>Intel(r) AMT Environment Detection Settings</g:ElementName>
            <g:InstanceID>Intel(r) AMT Environment Detection Settings</g:InstanceID>
            </g:AMT_EnvironmentDetectionSettingData>
        </a:Body>
</a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '1',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-00000001346E',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData',
            Method: 'AMT_EnvironmentDetectionSettingData'
          },
          Body: {
            DetectionAlgorithm: 0,
            DetectionStrings: 'dummy.com',
            ElementName: 'Intel(r) AMT Environment Detection Settings',
            InstanceID: 'Intel(r) AMT Environment Detection Settings'
          }
        }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_GeneralSettings
  it('should convert AMT_GeneralSettings Output XML To JSON', async () => {
    const xmlOutput = `
        <?xml version="1.0" encoding="UTF-8"?>
        <a:Envelope
            xmlns:a="http://www.w3.org/2003/05/soap-envelope"
            xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
            xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
            xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
            xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
            xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <a:Header>
                <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                <b:RelatesTo>1</b:RelatesTo>
                <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</b:Action>
                <b:MessageID>uuid:00000000-8086-8086-8086-00000001347E</b:MessageID>
                <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</c:ResourceURI>
            </a:Header>
            <a:Body>
                <g:AMT_GeneralSettings>
                    <g:DDNSPeriodicUpdateInterval>1440</g:DDNSPeriodicUpdateInterval>
                    <g:DDNSTTL>900</g:DDNSTTL>
                    <g:DDNSUpdateByDHCPServerEnabled>true</g:DDNSUpdateByDHCPServerEnabled>
                    <g:DDNSUpdateEnabled>false</g:DDNSUpdateEnabled>
                    <g:DHCPv6ConfigurationTimeout>0</g:DHCPv6ConfigurationTimeout>
                    <g:DigestRealm>Digest:D29C0000000000000000000000000000</g:DigestRealm>
                    <g:DomainName></g:DomainName>
                    <g:ElementName>Intel(r) AMT: General Settings</g:ElementName>
                    <g:HostName>Vyshali_sign</g:HostName>
                    <g:HostOSFQDN>Vyshali_Sign</g:HostOSFQDN>
                    <g:IdleWakeTimeout>1</g:IdleWakeTimeout>
                    <g:InstanceID>Intel(r) AMT: General Settings</g:InstanceID>
                    <g:NetworkInterfaceEnabled>true</g:NetworkInterfaceEnabled>
                    <g:PingResponseEnabled>true</g:PingResponseEnabled>
                    <g:PowerSource>0</g:PowerSource>
                    <g:PreferredAddressFamily>0</g:PreferredAddressFamily>
                    <g:PresenceNotificationInterval>0</g:PresenceNotificationInterval>
                    <g:PrivacyLevel>0</g:PrivacyLevel>
                    <g:RmcpPingResponseEnabled>true</g:RmcpPingResponseEnabled>
                    <g:SharedFQDN>true</g:SharedFQDN>
                    <g:WsmanOnlyMode>false</g:WsmanOnlyMode>
                </g:AMT_GeneralSettings>
            </a:Body>
        </a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '1',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-00000001347E',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings',
            Method: 'AMT_GeneralSettings'
          },
          Body: {
            DDNSPeriodicUpdateInterval: 1440,
            DDNSTTL: 900,
            DDNSUpdateByDHCPServerEnabled: true,
            DDNSUpdateEnabled: false,
            DHCPv6ConfigurationTimeout: 0,
            DigestRealm: 'Digest:D29C0000000000000000000000000000',
            ElementName: 'Intel(r) AMT: General Settings',
            HostName: 'Vyshali_sign',
            HostOSFQDN: 'Vyshali_Sign',
            IdleWakeTimeout: 1,
            InstanceID: 'Intel(r) AMT: General Settings',
            NetworkInterfaceEnabled: true,
            PingResponseEnabled: true,
            PowerSource: 0,
            PreferredAddressFamily: 0,
            PresenceNotificationInterval: 0,
            PrivacyLevel: 0,
            RmcpPingResponseEnabled: true,
            SharedFQDN: true,
            WsmanOnlyMode: false
          }
        }

    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })

  // AMT_SetupAndConfigurationService
  it('should convert AMT_SetupAndConfigurationService Output XML To JSON', async () => {
    const xmlOutput = `
    <?xml version="1.0" encoding="UTF-8"?>
        <a:Envelope
            xmlns:a="http://www.w3.org/2003/05/soap-envelope"
            xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing"
            xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"
            xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust"
            xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
            xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd"
            xmlns:g="http://schemas.xmlsoap.org/ws/2004/09/enumeration"
            xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"
            xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-000000013499</b:MessageID>
            <c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:PullResponse>
            <g:Items>
                <h:AMT_SetupAndConfigurationService>
                    <h:CreationClassName>AMT_SetupAndConfigurationService</h:CreationClassName>
                    <h:ElementName>Intel(r) AMT Setup and Configuration Service</h:ElementName>
                    <h:EnabledState>5</h:EnabledState>
                    <h:Name>Intel(r) AMT Setup and Configuration Service</h:Name>
                    <h:PasswordModel>1</h:PasswordModel>
                    <h:ProvisioningMode>1</h:ProvisioningMode>
                    <h:ProvisioningPID>AAAAAAAAAAA=</h:ProvisioningPID>
                    <h:ProvisioningServerOTP>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</h:ProvisioningServerOTP>
                    <h:ProvisioningState>2</h:ProvisioningState>
                    <h:RequestedState>12</h:RequestedState>
                    <h:SystemCreationClassName>CIM_ComputerSystem</h:SystemCreationClassName>
                    <h:SystemName>Intel(r) AMT</h:SystemName>
                    <h:ZeroTouchConfigurationEnabled>true</h:ZeroTouchConfigurationEnabled>
                </h:AMT_SetupAndConfigurationService>
            </g:Items>
            <g:EndOfSequence></g:EndOfSequence>
            </g:PullResponse>
         </a:Body>
    </a:Envelope>`

    const wsresponse = ParseWsman(xmlOutput)
    const outputJson =
        {
          Header: {
            To: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
            RelatesTo: '2',
            Action: 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse',
            MessageID: 'uuid:00000000-8086-8086-8086-000000013499',
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService',
            Method: 'PullResponse'
          },
          Body: {
            Items: {
              AMT_SetupAndConfigurationService: {
                CreationClassName: 'AMT_SetupAndConfigurationService',
                ElementName: 'Intel(r) AMT Setup and Configuration Service',
                EnabledState: 5,
                Name: 'Intel(r) AMT Setup and Configuration Service',
                PasswordModel: 1,
                ProvisioningMode: 1,
                ProvisioningPID: 'AAAAAAAAAAA=',
                ProvisioningServerOTP: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
                ProvisioningState: 2,
                RequestedState: 12,
                SystemCreationClassName: 'CIM_ComputerSystem',
                SystemName: 'Intel(r) AMT',
                ZeroTouchConfigurationEnabled: true
              }
            }
          }
        }
    expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson))
  })
})
