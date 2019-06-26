# Types

## Request body 

``` yaml

	requestBody {
        apiKey: string;
        method: string;
        payload: any;
    }
	
```

## Response error body 

```
	responseErrorBody {
        status: number;
        error: string;
    }
	
```
## All Devices

``` yaml

	interface devices {
        name: string;
        mpsuser: string;
        mpspass: string;
        amtuser: string;
        amtpass: string;
        host: string;
        icon: number;
        conn: number;
    }

```

## Audit log

``` yaml

    auditLog {
        auditAppID: number;
        eventID: number;
        initiatorType: number;
        auditApp: string;
        event: string;
        initiator: string;
        time: Date;
        mcLocationType: number;
        netAddress: string;
        ex: {
			type: string;
			data: number[];
		};
        exStr: string;
    }
```

## Event log

``` yaml

    eventLog {
        deviceAddress: number;
        eventSensorType: number;
        eventType: number;
        eventOffset: number;
        eventSourceType: number;
        eventSeverity: number;
        sensorNumber: number;
        entity: number;
        entityInstance: number;
        eventData: number[];
        time: Date;
        entityStr: string;
        desc: string;
    }

```

## General settings

``` yaml

    generalSettings {
        amtNetworkEnabled: number;
        ddnsPeriodicUpdateInterval: number;
        ddnsTTL: number;
        ddnsUpdateByDHCPServerEnabled: boolean;
        ddnsUpdateEnabled: boolean;
        dhcpv6ConfigurationTimeout: number;
        digestRealm: string;
        elementName: string;
        hostName: string;
        hostOSFQDN: string;
        idleWakeTimeout: number;
        instanceID: string;
        networkInterfaceEnabled: boolean;
        pingResponseEnabled: boolean;
        powerSource: number;
        preferredAddressFamily: number;
        presenceNotificationInterval: number;
        privacyLevel: number;
        rmcpPingResponseEnabled: boolean;
        sharedFQDN: boolean;
        wsmanOnlyMode: boolean;
    }

```
## Hardware information 

``` yaml

module hardwareDetails {

    selector {
        value: string;
        @name: string;
    }

    selectorSet {
        selector: selector[];
    }

    referenceParameters {
        resourceURI: string;
        selectorSet: selectorSet;
    }

    antecedent {
        address: string;
        referenceParameters: referenceParameters;
    }

    dependent {
        address: string;
        referenceParameters: referenceParameters;
    }

    response {
        antecedent: antecedent;
        dependent: dependent;
        platformGUID: string;
    }

    cimComputerSystemPackage {
        response: response;
        status: number;
    }

    cimSystemPackagingResponses {
        antecedent: antecedent;
        dependent: dependent;
        platformGUID: string;
    }

    cimSystemPackaging {
        responses: cimSystemPackagingResponses[];
        status: number;
    }

    cimChassisResponse {
        chassisPackageType: number;
        creationClassName: string;
        elementName: string;
        manufacturer: string;
        model: string;
        operationalStatus: number;
        packageType: number;
        serialNumber: string;
        tag: string;
        version: string;
    }

    cimChassis {
        response: cimChassisResponse;
        status: number;
    }

    cimChipRespons {
        canBeFRUed: boolean;
        creationClassName: string;
        elementName: string;
        manufacturer: string;
        operationalStatus: number;
        tag: any;
        version: string;
        bankLabel: string;
        capacity?: number;
        formFactor?: number;
        memoryType?: number;
        partNumber: string;
        serialNumber: string;
        speed?: number;
    }

    cimChip {
        responses: cimChipRespons[];
        status: number;
    }

    cimCardResponse {
        canBeFRUed: boolean;
        creationClassName: string;
        elementName: string;
        manufacturer: string;
        model: string;
        operationalStatus: number;
        packageType: number;
        serialNumber: string;
        tag: string;
        version: string;
    }

    cimCard {
        response: cimCardResponse;
        status: number;
    }

    cimBIOSElementResponse {
        elementName: string;
        manufacturer: string;
        name: string;
        operationalStatus: number;
        primaryBIOS: boolean;
        releaseDate: {
        datetime: Date;
		};
        softwareElementID: string;
        softwareElementState: number;
        targetOperatingSystem: number;
        version: string;
    }

    cimBIOSElement {
        response: cimBIOSElementResponse;
        status: number;
    }

    cimProcessorResponses {
        cpuStatus: number;
        creationClassName: string;
        currentClockSpeed: number;
        deviceID: string;
        elementName: string;
        enabledState: number;
        externalBusClockSpeed: number;
        family: number;
        healthState: number;
        maxClockSpeed: number;
        operationalStatus: number;
        requestedState: number;
        role: string;
        stepping: number;
        systemCreationClassName: string;
        systemName: string;
        upgradeMethod: number;
    }

    cimProcessor {
        responses: cimProcessorResponses[];
        status: number;
    }

    cimPhysicalMemoryResponses {
        bankLabel: string;
        capacity: any;
        creationClassName: string;
        elementName: string;
        formFactor: number;
        manufacturer: string;
        memoryType: number;
        partNumber: string;
        serialNumber: string;
        speed: number;
        tag: any;
    }

    cimPhysicalMemory {
        responses: cimPhysicalMemoryResponses[];
        status: number;
    }

    cimMediaAccessDeviceResponses {
        capabilities: number[];
        creationClassName: string;
        deviceID: string;
        elementName: string;
        enabledDefault: number;
        enabledState: number;
        maxMediaSize: number;
        operationalStatus: number;
        requestedState: number;
        security: number;
        systemCreationClassName: string;
        systemName: string;
    }

    cimMediaAccessDevice {
        responses: cimMediaAccessDeviceResponses[];
        status: number;
    }

    cimPhysicalPackageResponses {
        canBeFRUed: boolean;
        creationClassName: string;
        elementName: string;
        manufacturer: string;
        model: string;
        operationalStatus: number;
        packageType: number;
        serialNumber: string;
        tag: string;
        version: string;
        chassisPackageType?: number;
    }

    cimPhysicalPackage {
        responses: cimPhysicalPackageResponses[];
        status: number;
    }

    hardwareinfo {
        CIM_ComputerSystemPackage: cimComputerSystemPackage;
        CIM_SystemPackaging: cimSystemPackaging;
        CIM_Chassis: cimChassis;
        CIM_Chip: cimChip;
        CIM_Card: cimCard;
        CIM_BIOSElement: cimBIOSElement;
        CIM_Processor: cimProcessor;
        CIM_PhysicalMemory: cimPhysicalMemory;
        CIM_MediaAccessDevice: cimMediaAccessDevice;
        CIM_PhysicalPackage: cimPhysicalPackage;
    }

}

```

## Power action 

``` yaml

    powerAction {
        returnValue: number;
        returnValueStr: string;
    }

```

## Power capabilities


``` yaml

    powerCapabilities {
        powerUp: number;
        powerCycle: number;
        powerDown: number;
        reset: number;
        softOff: number;
        softReset: number;
        sleep: number;
        hibernate: number;
        powerUpToBIOS: number;
        resetToBIOS: number;
        resetToSecureErase: number;
        resetToIDE-RFloppy: number;
        powerOnToIDE-RFloppy: number;
        resetToIDE-RCDROM: number;
        powerOnToIDE-RCDROM: number;
        resetToPXE: number;
        powerOnToPXE: number;
    }


```

## Power state 

``` yaml

    powerState {
        powerState: number;
    }

```

## Version 

``` yaml

module versionInfo {

    cimSoftwareIdentityResponses {
        instanceID: string;
        isEntity: boolean;
        versionString: any;
    }

    cimSoftwareIdentity {
        responses: cimSoftwareIdentityResponses[];
        status: number;
    }

    amtSetupAndConfigurationServiceResponse {
        creationClassName: string;
        elementName: string;
        enabledState: number;
        name: string;
        passwordModel: number;
        provisioningMode: number;
        provisioningServerOTP: string;
        provisioningState: number;
        requestedState: number;
        systemCreationClassName: string;
        systemName: string;
        zeroTouchConfigurationEnabled: boolean;
    }

    amtSetupAndConfigurationService {
        response: amtSetupAndConfigurationServiceResponse;
        status: number;
    }

    version {
        CIM_SoftwareIdentity: cimSoftwareIdentity;
        AMT_SetupAndConfigurationService: amtSetupAndConfigurationServiceResponse;
    }

}


```