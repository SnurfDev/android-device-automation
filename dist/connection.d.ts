import { Device } from "./index.js";
export declare class DeviceConnection {
    serialNumber: string;
    device: Device | undefined;
    constructor(serialNumber: string, device?: Device);
    adb(command: string, timeout?: number): Promise<string>;
}
