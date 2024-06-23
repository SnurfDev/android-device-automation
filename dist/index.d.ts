import { DeviceConnection } from "./connection.js";
import { FileSystem } from "./modules/filesystem.js";
import { PackageManager } from "./modules/packages.js";
import { Input } from "./modules/input.js";
import { Utils } from "./modules/utils.js";
import { Info } from "./modules/info.js";
export { KeyCode } from "./common/keycodes.js";
export declare const adbPath: string;
export type DeviceDescriptor = {
    serialNumber: string;
    model: string | undefined;
    authorized: boolean;
};
export declare function getDevices(): Promise<DeviceDescriptor[]>;
export declare class Device extends DeviceConnection {
    authorized: boolean;
    model: string | undefined;
    constructor(serialNumber: string);
    constructor(deviceDescriptor: DeviceDescriptor);
    authorize(): Promise<void>;
    loadedModules: DeviceConnection[];
    getModule<M extends DeviceConnection>(cls: new (sn: string, dev: Device) => M): M;
    getFS(): FileSystem;
    getPM(): PackageManager;
    getInput(): Input;
    getUtils(): Utils;
    getInfo(): Info;
}
