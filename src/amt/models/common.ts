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
