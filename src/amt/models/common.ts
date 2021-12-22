export interface Header {
  To: string
  RelatesTo: string
  Action: string
  MessageID: string
  ResourceURI: string
}

export interface DigestChallenge {
  realm?: string
  nonce?: string // Uniquely generated everytime a 401 response made
  stale?: string
  qop?: string // quality of protection
}

export interface Envelope<T> {
  Header: Header
  Body: T
}

export interface Response<T> {
  Envelope: Envelope<T>
}

export interface Enumerate {
  EnumerateResponse: {
    EnumerationContext: string
  }
}

export interface Pull<T> {
  PullResponse: {
    Items: T
    EndOfSequence: string
  }
}

export interface AuditLogResult {
  totalCnt: number
  records: AuditLogRecord[]
}

export interface AuditLogRecord {
  AuditAppID: number
  EventID: number
  InitiatorType: number
  AuditApp: string
  Event: string
  Initiator: string
  Time: Date
  MCLocationType: number
  NetAddress: string
  Ex: string
  ExStr?: string
}

export interface AuditLogReadRecordsOutput {
  TotalRecordCount: string
  RecordsReturned: string
  EventRecords: string[]
  ReturnValue: string
}

export const enum CIM_KVM_REDIRECTION_SAP_REQUESTED_STATE {
  Unknown = 0,
  Enabled = 2,
  Disabled = 3,
  Shutdown = 4,
  NoChange = 5,
  Offline = 6,
  Test = 7,
  Deferred = 8,
  Quiesce = 9,
  Reboot = 10,
  Reset = 11,
  NotApplicable = 12
}

export const enum CIM_KVM_REDIRECTION_SAP_ENABLED_STATE {
  Unknown = 0,
  Other = 1,
  Enabled = 2,
  Disabled = 3,
  ShuttingDown = 4,
  NotApplicable = 5,
  EnabledButOffline = 6,
  InTest = 7,
  Deferred = 8,
  Quiesce = 9,
  Starting = 10,
  DmftReserved = 11
}

export const enum AMT_REDIRECTION_SERVICE_ENABLE_STATE {
  Unknown = 0,
  Other = 1,
  Enabled = 2,
  Disabled = 3,
  ShuttingDown = 4,
  NotApplicable = 5,
  EnabledButOffline = 6,
  InTest = 7,
  Deferred = 8,
  Quiesce = 9,
  Starting = 10,
  DmftReserved = 11
}

export interface ReturnValue{
  ReturnValue: number
  ReturnValueStr?: string
}
