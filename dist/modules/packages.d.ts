import { DeviceConnection } from "../connection.js";
interface Package {
    id: string;
    apkPath: string;
}
export declare class PackageManager extends DeviceConnection {
    getPackages(): Promise<Package[]>;
    installApp(apkPath: string): Promise<void>;
    updateApp(apkPath: string): Promise<void>;
    uninstallApp(apkPath: string, keepData?: boolean): Promise<void>;
    uninstallApp(packageID: string, keepData?: boolean): Promise<void>;
    uninstallApp(pkg: Package, keepData?: boolean): Promise<void>;
    clearAppData(packageID: string): Promise<void>;
    clearAppData(pkg: Package): Promise<void>;
}
export {};
