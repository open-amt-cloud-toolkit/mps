import { MPSMicroservice } from './mpsMicroservice'

declare module 'express' {
  export interface Request {
    mpsService: MPSMicroservice
    amtFactory: any
    amtStack: any
  }
}
