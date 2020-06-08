import { ParseWsman } from '../src/amt_libraries/amt-xml';


describe("CIM related XML parser testing ", () => {
  
    //CIM_BIOSElement
    it('should convert CIM_BIOS Element Output XML To JSON', async () => {
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
    xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BIOSElement"
    xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <a:Header>
        <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
        <b:RelatesTo>2</b:RelatesTo>
        <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
        <b:MessageID>uuid:00000000-8086-8086-8086-00000001348B</b:MessageID>
        <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BIOSElement</c:ResourceURI>
    </a:Header>
    <a:Body>
        <g:PullResponse>
            <g:Items>
                <h:CIM_BIOSElement>
                    <h:ElementName>Primary BIOS</h:ElementName>
                    <h:Manufacturer>Intel Corp.</h:Manufacturer>
                    <h:Name>Primary BIOS</h:Name>
                    <h:OperationalStatus>0</h:OperationalStatus>
                    <h:PrimaryBIOS>true</h:PrimaryBIOS>
                    <h:ReleaseDate>
                        <i:Datetime>2012-04-25T00:00:00Z</i:Datetime>
                    </h:ReleaseDate>
                    <h:SoftwareElementID>KBQ7710H.86A.0038.2012.0425.1537</h:SoftwareElementID>
                    <h:SoftwareElementState>2</h:SoftwareElementState>
                    <h:TargetOperatingSystem>66</h:TargetOperatingSystem>
                    <h:Version>KBQ7710H.86A.0038.2012.0425.1537</h:Version>
                </h:CIM_BIOSElement>
            </g:Items>
            <g:EndOfSequence></g:EndOfSequence>
        </g:PullResponse>
    </a:Body>
</a:Envelope>`;
  
      var wsresponse= ParseWsman(xmlOutput);
      const outputJson =
      {
        "Header": {
            "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
            "RelatesTo": "2",
            "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
            "MessageID": "uuid:00000000-8086-8086-8086-00000001348B",
            "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BIOSElement",
            "Method": "PullResponse"
        },
        "Body": {
            "Items": {
                "CIM_BIOSElement": {
                    "ElementName": "Primary BIOS",
                    "Manufacturer": "Intel Corp.",
                    "Name": "Primary BIOS",
                    "OperationalStatus": 0,
                    "PrimaryBIOS": true,
                    "ReleaseDate": {
                        "Datetime": "2012-04-25T00:00:00Z"
                    },
                    "SoftwareElementID": "KBQ7710H.86A.0038.2012.0425.1537",
                    "SoftwareElementState": 2,
                    "TargetOperatingSystem": 66,
                    "Version": "KBQ7710H.86A.0038.2012.0425.1537"
                }
            }
         }
    
      };

      expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
      
      });


      //CIM_Card
    it('should convert CIM_Card Element Output XML To JSON', async () => {
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
                xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Card"
                xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <a:Header>
                <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                <b:RelatesTo>2</b:RelatesTo>
                <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
                <b:MessageID>uuid:00000000-8086-8086-8086-000000013489</b:MessageID>
                <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Card</c:ResourceURI>
            </a:Header>
         <a:Body>
                <g:PullResponse>
                <g:Items>
                <h:CIM_Card>
                    <h:CanBeFRUed>true</h:CanBeFRUed>
                    <h:CreationClassName>CIM_Card</h:CreationClassName>
                    <h:ElementName>Managed System Base Board</h:ElementName>
                    <h:Manufacturer>Intel Corporation</h:Manufacturer>
                    <h:Model>DQ77KB</h:Model>
                    <h:OperationalStatus>0</h:OperationalStatus>
                    <h:PackageType>9</h:PackageType>
                    <h:SerialNumber>BTKB2440008L</h:SerialNumber>
                    <h:Tag>To be filled by O.E.M.</h:Tag>
                    <h:Version>AAG40294-402</h:Version>
                </h:CIM_Card>
                </g:Items>
                <g:EndOfSequence></g:EndOfSequence>
                </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse = ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-000000013489",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Card",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_Card": {
                        "CanBeFRUed": true,
                        "CreationClassName": "CIM_Card",
                        "ElementName": "Managed System Base Board",
                        "Manufacturer": "Intel Corporation",
                        "Model": "DQ77KB",
                        "OperationalStatus": 0,
                        "PackageType": 9,
                        "SerialNumber": "BTKB2440008L",
                        "Tag": "To be filled by O.E.M.",
                        "Version": "AAG40294-402"
                    }
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

        //CIM_Chip
    it('should convert CIM_Chip Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PhysicalMemory"
            xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <a:Header>
                <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                <b:RelatesTo>3</b:RelatesTo>
                <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
                <b:MessageID>uuid:00000000-8086-8086-8086-000000013485</b:MessageID>
                <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chip</c:ResourceURI>
            </a:Header>
            <a:Body>
                <g:PullResponse>
                    <g:Items>
                        <h:CIM_PhysicalMemory>
                            <h:BankLabel>CHANNEL A SLOT 0</h:BankLabel>
                            <h:Capacity>4294967296</h:Capacity>
                            <h:CreationClassName>CIM_PhysicalMemory</h:CreationClassName>
                            <h:ElementName>Managed System Memory Chip</h:ElementName>
                            <h:FormFactor>13</h:FormFactor>
                            <h:Manufacturer>830B</h:Manufacturer>
                            <h:MemoryType>24</h:MemoryType>
                            <h:PartNumber>NT4GC64C88C0NS-DI </h:PartNumber>
                            <h:SerialNumber>8A6A2E6B</h:SerialNumber>
                            <h:Speed>0</h:Speed>
                            <h:Tag>9876543210</h:Tag>
                        </h:CIM_PhysicalMemory>
                        <h:CIM_PhysicalMemory>
                            <h:BankLabel>CHANNEL B SLOT 0</h:BankLabel>
                            <h:Capacity>4294967296</h:Capacity>
                            <h:CreationClassName>CIM_PhysicalMemory</h:CreationClassName>
                            <h:ElementName>Managed System Memory Chip</h:ElementName>
                            <h:FormFactor>13</h:FormFactor>
                            <h:Manufacturer>830B</h:Manufacturer>
                            <h:MemoryType>24</h:MemoryType>
                            <h:PartNumber>NT4GC64C88C0NS-DI </h:PartNumber>
                            <h:SerialNumber>8F582E6E</h:SerialNumber>
                            <h:Speed>0</h:Speed>
                            <h:Tag>9876543210 (#1)</h:Tag>
                        </h:CIM_PhysicalMemory>
                    </g:Items>
                    <g:EndOfSequence></g:EndOfSequence>
                </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse = ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "3",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-000000013485",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chip",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_PhysicalMemory": [
                        {
                            "BankLabel": "CHANNEL A SLOT 0",
                            "Capacity": 4294967296,
                            "CreationClassName": "CIM_PhysicalMemory",
                            "ElementName": "Managed System Memory Chip",
                            "FormFactor": 13,
                            "Manufacturer": "830B",
                            "MemoryType": 24,
                            "PartNumber": "NT4GC64C88C0NS-DI ",
                            "SerialNumber": "8A6A2E6B",
                            "Speed": 0,
                            "Tag": 9876543210
                        },
                        {
                            "BankLabel": "CHANNEL B SLOT 0",
                            "Capacity": 4294967296,
                            "CreationClassName": "CIM_PhysicalMemory",
                            "ElementName": "Managed System Memory Chip",
                            "FormFactor": 13,
                            "Manufacturer": "830B",
                            "MemoryType": 24,
                            "PartNumber": "NT4GC64C88C0NS-DI ",
                            "SerialNumber": "8F582E6E",
                            "Speed": 0,
                            "Tag": "9876543210 (#1)"
                        }
                    ]
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

        //CIM_ComputerSystemPackage
    it('should convert CIM_ComputerSystemPackage Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystemPackage"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-000000013480</b:MessageID>
            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystemPackage</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:PullResponse>
             <g:Items>
                <h:CIM_ComputerSystemPackage>
                    <h:Antecedent>
                        <b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address>
                        <b:ReferenceParameters>
                            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis</c:ResourceURI>
                            <c:SelectorSet>
                                <c:Selector Name="CreationClassName">CIM_Chassis</c:Selector>
                                <c:Selector Name="Tag">CIM_Chassis</c:Selector>
                            </c:SelectorSet>
                        </b:ReferenceParameters>
                    </h:Antecedent>
                    <h:Dependent>
                        <b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address>
                        <b:ReferenceParameters>
                            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</c:ResourceURI>
                            <c:SelectorSet>
                                <c:Selector Name="CreationClassName">CIM_ComputerSystem</c:Selector>
                                <c:Selector Name="Name">ManagedSystem</c:Selector>
                            </c:SelectorSet>
                        </b:ReferenceParameters>
                    </h:Dependent>
                    <h:PlatformGUID>8205E255227711E2897A505054503030</h:PlatformGUID>
                    </h:CIM_ComputerSystemPackage>
                </g:Items>
                <g:EndOfSequence></g:EndOfSequence>
                </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse = ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-000000013480",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystemPackage",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_ComputerSystemPackage": {
                        "Antecedent": {
                            "Address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                            "ReferenceParameters": {
                                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis",
                                "SelectorSet": {
                                    "Selector": [
                                        {
                                            "Value": "CIM_Chassis",
                                            "@Name": "CreationClassName"
                                        },
                                        {
                                            "Value": "CIM_Chassis",
                                            "@Name": "Tag"
                                        }
                                    ]
                                }
                            }
                        },
                        "Dependent": {
                            "Address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                            "ReferenceParameters": {
                                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem",
                                "SelectorSet": {
                                    "Selector": [
                                        {
                                            "Value": "CIM_ComputerSystem",
                                            "@Name": "CreationClassName"
                                        },
                                        {
                                            "Value": "ManagedSystem",
                                            "@Name": "Name"
                                        }
                                    ]
                                }
                            }
                        },
                        "PlatformGUID": "8205E255227711E2897A505054503030"
                    }
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

          //CIM_MediaAccessDevice
    it('should convert CIM_MediaAccessDevice Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_MediaAccessDevice"
            xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-000000013491</b:MessageID>
            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_MediaAccessDevice</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:PullResponse>
                <g:Items>
                    <h:CIM_MediaAccessDevice>
                    <h:Capabilities>4</h:Capabilities>
                    <h:Capabilities>10</h:Capabilities>
                    <h:CreationClassName>CIM_MediaAccessDevice</h:CreationClassName>
                    <h:DeviceID>MEDIA DEV 0</h:DeviceID>
                    <h:ElementName>Managed System Media Access Device</h:ElementName>
                    <h:EnabledDefault>2</h:EnabledDefault>
                    <h:EnabledState>0</h:EnabledState>
                    <h:MaxMediaSize>80026361</h:MaxMediaSize>
                    <h:OperationalStatus>0</h:OperationalStatus>
                    <h:RequestedState>12</h:RequestedState>
                    <h:Security>2</h:Security>
                    <h:SystemCreationClassName>CIM_ComputerSystem</h:SystemCreationClassName>
                    <h:SystemName>ManagedSystem</h:SystemName>
                </h:CIM_MediaAccessDevice>
                </g:Items>
                <g:EndOfSequence></g:EndOfSequence>
                </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse = ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-000000013491",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_MediaAccessDevice",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_MediaAccessDevice": {
                        "Capabilities": [
                            4,
                            10
                        ],
                        "CreationClassName": "CIM_MediaAccessDevice",
                        "DeviceID": "MEDIA DEV 0",
                        "ElementName": "Managed System Media Access Device",
                        "EnabledDefault": 2,
                        "EnabledState": 0,
                        "MaxMediaSize": 80026361,
                        "OperationalStatus": 0,
                        "RequestedState": 12,
                        "Security": 2,
                        "SystemCreationClassName": "CIM_ComputerSystem",
                        "SystemName": "ManagedSystem"
                    }
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

        //CIM_PhysicalMemory
    it('should convert CIM_PhysicalMemory Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PhysicalMemory"
            xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-00000001348F</b:MessageID>
            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PhysicalMemory</c:ResourceURI>
        </a:Header>
        <a:Body>
         <g:PullResponse>
            <g:Items>
                <h:CIM_PhysicalMemory>
                    <h:BankLabel>CHANNEL A SLOT 0</h:BankLabel>
                    <h:Capacity>4294967296</h:Capacity>
                    <h:CreationClassName>CIM_PhysicalMemory</h:CreationClassName>
                    <h:ElementName>Managed System Memory Chip</h:ElementName>
                    <h:FormFactor>13</h:FormFactor>
                    <h:Manufacturer>830B</h:Manufacturer>
                    <h:MemoryType>24</h:MemoryType>
                    <h:PartNumber>NT4GC64C88C0NS-DI </h:PartNumber>
                    <h:SerialNumber>8A6A2E6B</h:SerialNumber>
                    <h:Speed>0</h:Speed>
                    <h:Tag>9876543210</h:Tag>
                </h:CIM_PhysicalMemory>
                <h:CIM_PhysicalMemory>
                    <h:BankLabel>CHANNEL B SLOT 0</h:BankLabel>
                    <h:Capacity>4294967296</h:Capacity>
                    <h:CreationClassName>CIM_PhysicalMemory</h:CreationClassName>
                    <h:ElementName>Managed System Memory Chip</h:ElementName>
                    <h:FormFactor>13</h:FormFactor>
                    <h:Manufacturer>830B</h:Manufacturer>
                    <h:MemoryType>24</h:MemoryType>
                    <h:PartNumber>NT4GC64C88C0NS-DI </h:PartNumber>
                    <h:SerialNumber>8F582E6E</h:SerialNumber>
                    <h:Speed>0</h:Speed>
                    <h:Tag>9876543210 (#1)</h:Tag>
                </h:CIM_PhysicalMemory>
                </g:Items>
            <g:EndOfSequence></g:EndOfSequence>
            </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse= ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-00000001348F",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PhysicalMemory",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_PhysicalMemory": [
                        {
                            "BankLabel": "CHANNEL A SLOT 0",
                            "Capacity": 4294967296,
                            "CreationClassName": "CIM_PhysicalMemory",
                            "ElementName": "Managed System Memory Chip",
                            "FormFactor": 13,
                            "Manufacturer": "830B",
                            "MemoryType": 24,
                            "PartNumber": "NT4GC64C88C0NS-DI ",
                            "SerialNumber": "8A6A2E6B",
                            "Speed": 0,
                            "Tag": 9876543210
                        },
                        {
                            "BankLabel": "CHANNEL B SLOT 0",
                            "Capacity": 4294967296,
                            "CreationClassName": "CIM_PhysicalMemory",
                            "ElementName": "Managed System Memory Chip",
                            "FormFactor": 13,
                            "Manufacturer": "830B",
                            "MemoryType": 24,
                            "PartNumber": "NT4GC64C88C0NS-DI ",
                            "SerialNumber": "8F582E6E",
                            "Speed": 0,
                            "Tag": "9876543210 (#1)"
                        }
                    ]
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

        //CIM_Processor
    it('should convert CIM_Processor Element Output XML To JSON', async () => {
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
                xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Processor"
                xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
                <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
                <b:RelatesTo>2</b:RelatesTo>
                <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
                <b:MessageID>uuid:00000000-8086-8086-8086-00000001348D</b:MessageID>
                <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Processor</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:PullResponse>
            <g:Items>
                <h:CIM_Processor>
                    <h:CPUStatus>1</h:CPUStatus>
                    <h:CreationClassName>CIM_Processor</h:CreationClassName>
                    <h:CurrentClockSpeed>3000</h:CurrentClockSpeed>
                    <h:DeviceID>CPU 0</h:DeviceID>
                    <h:ElementName>Managed System CPU</h:ElementName>
                    <h:EnabledState>2</h:EnabledState>
                    <h:ExternalBusClockSpeed>100</h:ExternalBusClockSpeed>
                    <h:Family>205</h:Family>
                    <h:HealthState>0</h:HealthState>
                    <h:MaxClockSpeed>3800</h:MaxClockSpeed>
                    <h:OperationalStatus>0</h:OperationalStatus>
                    <h:RequestedState>12</h:RequestedState>
                    <h:Role>Central</h:Role>
                    <h:Stepping>9</h:Stepping>
                    <h:SystemCreationClassName>CIM_ComputerSystem</h:SystemCreationClassName>
                    <h:SystemName>ManagedSystem</h:SystemName>
                    <h:UpgradeMethod>2</h:UpgradeMethod>
                </h:CIM_Processor>
            </g:Items>
            <g:EndOfSequence></g:EndOfSequence>
            </g:PullResponse>
        </a:Body>
        </a:Envelope>`;
    
        var wsresponse= ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-00000001348D",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Processor",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_Processor": {
                        "CPUStatus": 1,
                        "CreationClassName": "CIM_Processor",
                        "CurrentClockSpeed": 3000,
                        "DeviceID": "CPU 0",
                        "ElementName": "Managed System CPU",
                        "EnabledState": 2,
                        "ExternalBusClockSpeed": 100,
                        "Family": 205,
                        "HealthState": 0,
                        "MaxClockSpeed": 3800,
                        "OperationalStatus": 0,
                        "RequestedState": 12,
                        "Role": "Central",
                        "Stepping": 9,
                        "SystemCreationClassName": "CIM_ComputerSystem",
                        "SystemName": "ManagedSystem",
                        "UpgradeMethod": 2
                    }
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

        //CIM_ServiceAvailabletToElement
    it('should convert CIM_ServiceAvailableToElement Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_AssociatedPowerManagementService"
            xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-0000000134A1</b:MessageID>
            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</c:ResourceURI>
        </a:Header>
        <a:Body>
        <g:PullResponse>
            <g:Items>
                <h:CIM_AssociatedPowerManagementService>
                    <h:PowerState>2</h:PowerState>
                    <h:RequestedPowerState>2</h:RequestedPowerState>
                    <h:ServiceProvided>
                        <b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address>
                        <b:ReferenceParameters>
                            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService</c:ResourceURI>
                            <c:SelectorSet>
                                <c:Selector Name="CreationClassName">CIM_PowerManagementService</c:Selector>
                                <c:Selector Name="Name">Intel(r) AMT Power Management Service</c:Selector>
                                <c:Selector Name="SystemCreationClassName">CIM_ComputerSystem</c:Selector>
                                <c:Selector Name="SystemName">Intel(r) AMT</c:Selector>
                            </c:SelectorSet>
                        </b:ReferenceParameters>
                    </h:ServiceProvided>
                    <h:UserOfService>
                        <b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address>
                        <b:ReferenceParameters>
                            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</c:ResourceURI>
                            <c:SelectorSet>
                                <c:Selector Name="CreationClassName">CIM_ComputerSystem</c:Selector>
                                <c:Selector Name="Name">ManagedSystem</c:Selector>
                            </c:SelectorSet>
                        </b:ReferenceParameters>
                    </h:UserOfService>
                </h:CIM_AssociatedPowerManagementService>
                </g:Items>
             <g:EndOfSequence></g:EndOfSequence>
            </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse= ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-0000000134A1",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_AssociatedPowerManagementService": {
                        "PowerState": 2,
                        "RequestedPowerState": 2,
                        "ServiceProvided": {
                            "Address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                            "ReferenceParameters": {
                                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService",
                                "SelectorSet": {
                                    "Selector": [
                                        {
                                            "Value": "CIM_PowerManagementService",
                                            "@Name": "CreationClassName"
                                        },
                                        {
                                            "Value": "Intel(r) AMT Power Management Service",
                                            "@Name": "Name"
                                        },
                                        {
                                            "Value": "CIM_ComputerSystem",
                                            "@Name": "SystemCreationClassName"
                                        },
                                        {
                                            "Value": "Intel(r) AMT",
                                            "@Name": "SystemName"
                                        }
                                    ]
                                }
                            }
                        },
                        "UserOfService": {
                            "Address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                            "ReferenceParameters": {
                                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem",
                                "SelectorSet": {
                                    "Selector": [
                                        {
                                            "Value": "CIM_ComputerSystem",
                                            "@Name": "CreationClassName"
                                        },
                                        {
                                            "Value": "ManagedSystem",
                                            "@Name": "Name"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

        //CIM_SoftwareIdentity
    it('should convert CIM_SoftwareIdentity Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity"
            xmlns:i="http://schemas.dmtf.org/wbem/wscim/1/common"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-000000013497</b:MessageID>
            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:PullResponse>
                <g:Items>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Flash</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8.1.71</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Netstack</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8.1.71</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>AMTApps</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8.1.71</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>AMT</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8.1.71</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Sku</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>24584</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>VendorID</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8086</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Build Number</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>3608</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Recovery Version</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8.1.71</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Recovery Build Num</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>3608</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>Legacy Mode</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>False</h:VersionString>
                </h:CIM_SoftwareIdentity>
                <h:CIM_SoftwareIdentity>
                    <h:InstanceID>AMT FW Core Version</h:InstanceID>
                    <h:IsEntity>true</h:IsEntity>
                    <h:VersionString>8.1.71</h:VersionString>
                </h:CIM_SoftwareIdentity>
                </g:Items>
                <g:EndOfSequence></g:EndOfSequence>
            </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse= ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-000000013497",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SoftwareIdentity",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_SoftwareIdentity": [
                        {
                            "InstanceID": "Flash",
                            "IsEntity": true,
                            "VersionString": "8.1.71"
                        },
                        {
                            "InstanceID": "Netstack",
                            "IsEntity": true,
                            "VersionString": "8.1.71"
                        },
                        {
                            "InstanceID": "AMTApps",
                            "IsEntity": true,
                            "VersionString": "8.1.71"
                        },
                        {
                            "InstanceID": "AMT",
                            "IsEntity": true,
                            "VersionString": "8.1.71"
                        },
                        {
                            "InstanceID": "Sku",
                            "IsEntity": true,
                            "VersionString": 24584
                        },
                        {
                            "InstanceID": "VendorID",
                            "IsEntity": true,
                            "VersionString": 8086
                        },
                        {
                            "InstanceID": "Build Number",
                            "IsEntity": true,
                            "VersionString": 3608
                        },
                        {
                            "InstanceID": "Recovery Version",
                            "IsEntity": true,
                            "VersionString": "8.1.71"
                        },
                        {
                            "InstanceID": "Recovery Build Num",
                            "IsEntity": true,
                            "VersionString": 3608
                        },
                        {
                            "InstanceID": "Legacy Mode",
                            "IsEntity": true,
                            "VersionString": "False"
                        },
                        {
                            "InstanceID": "AMT FW Core Version",
                            "IsEntity": true,
                            "VersionString": "8.1.71"
                        }
                    ]
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });

         //CIM_SystemPackaging
    it('should convert CIM_SystemPackaging Element Output XML To JSON', async () => {
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
            xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystemPackage"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <a:Header>
            <b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To>
            <b:RelatesTo>2</b:RelatesTo>
            <b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action>
            <b:MessageID>uuid:00000000-8086-8086-8086-000000013487</b:MessageID>
            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SystemPackaging</c:ResourceURI>
        </a:Header>
        <a:Body>
            <g:PullResponse>
                <g:Items>
                <h:CIM_ComputerSystemPackage>
                    <h:Antecedent>
                        <b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address>
                        <b:ReferenceParameters>
                            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis</c:ResourceURI>
                            <c:SelectorSet>
                                <c:Selector Name="CreationClassName">CIM_Chassis</c:Selector>
                                <c:Selector Name="Tag">CIM_Chassis</c:Selector>
                            </c:SelectorSet>
                        </b:ReferenceParameters>
                    </h:Antecedent>
                    <h:Dependent>
                        <b:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:Address>
                        <b:ReferenceParameters>
                            <c:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</c:ResourceURI>
                            <c:SelectorSet>
                                <c:Selector Name="CreationClassName">CIM_ComputerSystem</c:Selector>
                                <c:Selector Name="Name">ManagedSystem</c:Selector>
                            </c:SelectorSet>
                        </b:ReferenceParameters>
                    </h:Dependent>
                    <h:PlatformGUID>8205E255227711E2897A505054503030</h:PlatformGUID>
                    </h:CIM_ComputerSystemPackage>
                </g:Items>
                <g:EndOfSequence></g:EndOfSequence>
                </g:PullResponse>
            </a:Body>
        </a:Envelope>`;
    
        var wsresponse= ParseWsman(xmlOutput);
        const outputJson =
        {
            "Header": {
                "To": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                "RelatesTo": "2",
                "Action": "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
                "MessageID": "uuid:00000000-8086-8086-8086-000000013487",
                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_SystemPackaging",
                "Method": "PullResponse"
            },
            "Body": {
                "Items": {
                    "CIM_ComputerSystemPackage": {
                        "Antecedent": {
                            "Address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                            "ReferenceParameters": {
                                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis",
                                "SelectorSet": {
                                    "Selector": [
                                        {
                                            "Value": "CIM_Chassis",
                                            "@Name": "CreationClassName"
                                        },
                                        {
                                            "Value": "CIM_Chassis",
                                            "@Name": "Tag"
                                        }
                                    ]
                                }
                            }
                        },
                        "Dependent": {
                            "Address": "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
                            "ReferenceParameters": {
                                "ResourceURI": "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem",
                                "SelectorSet": {
                                    "Selector": [
                                        {
                                            "Value": "CIM_ComputerSystem",
                                            "@Name": "CreationClassName"
                                        },
                                        {
                                            "Value": "ManagedSystem",
                                            "@Name": "Name"
                                        }
                                    ]
                                }
                            }
                        },
                        "PlatformGUID": "8205E255227711E2897A505054503030"
                    }
                }
            }
        };
  
        expect(JSON.stringify(wsresponse)).toBe(JSON.stringify(outputJson));
        
        });
    });