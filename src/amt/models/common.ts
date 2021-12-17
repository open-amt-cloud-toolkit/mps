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

export interface Response<T> {
  Envelope: {
    Header: Header
    Body: T
  }
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
export interface ReturnValue{
  ReturnValue: number
  ReturnValueStr?: string
}
