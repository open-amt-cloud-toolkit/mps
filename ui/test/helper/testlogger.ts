import { ILogger } from "../../core/ILogger"

class TestLogger implements ILogger
{
    debug(log: string): void {
    }
    info(log: string): void {
    }
    error(log: string): void {
    }
    warn(log: string): void {
    }
    verbose(log: string): void {
    }   
}

export { TestLogger }