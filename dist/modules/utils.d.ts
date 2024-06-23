import { DeviceConnection } from "../connection.js";
export declare class Utils extends DeviceConnection {
    unlock(pin: string): Promise<void>;
    launchApp(appID: string): Promise<void>;
    killApp(appID: string): Promise<void>;
    getScreen(asPng: boolean): Promise<Buffer>;
}
