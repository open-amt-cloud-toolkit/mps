import { IRLEDecoder } from '../../core/IRLEDecoder';

class Decoder implements IRLEDecoder {
    Decode(acc:string, ptr: number,
           x: number,
           y: number,
           width: number,
           height: number,
           s: number,
           datalen: number): void {
    }
}

export { Decoder }