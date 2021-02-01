
import { MpsProxy } from "./MpsProxy"
import { mpsMicroservice } from "../../mpsMicroservice"

export interface IMpsProxy {
    SetupCiraChannel(targetport, uuid);
}