export interface Header {
  Header: {
    To: string
    RelatesTo: string
    Action: string
    MessageID: string
    ResourceURI: string
  }
}

export interface DigestChallenge {
  realm?: string
  nonce?: string // Uniquely generated everytime a 401 response made
  state?: boolean
  qop?: string // quality of protection
}
