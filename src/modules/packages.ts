import { DeviceConnection } from "../connection.js";
import { NL_RX } from "../regex.js";

interface Package {
    id: string,
    apkPath: string
}

export class PackageManager extends DeviceConnection {
    async getPackages(): Promise<Package[]> {
        let packageStrs = (await this.adb(`shell pm list packages -3 -f`)).split(NL_RX).slice(0,-1);

        return packageStrs.map(v=>{
            let rawStr = v.slice(8);
            return {
                id: rawStr.slice(rawStr.lastIndexOf("=")+1),
                apkPath: rawStr.slice(0,rawStr.lastIndexOf("="))
            }
        })
    }

    async installApp(apkPath: string) {
        await this.adb(`install "${apkPath}"`)
    }
    
    async updateApp(apkPath: string) {
        await this.adb(`install -r "${apkPath}"`)
    }

    async uninstallApp(apkPath:string,keepData?: boolean): Promise<void>
    async uninstallApp(packageID:string,keepData?:boolean): Promise<void>
    async uninstallApp(pkg:Package,keepData?:boolean): Promise<void>
    async uninstallApp(pkg:string|Package,keepData?:boolean): Promise<void> {
        await this.adb(`uninstall ${keepData?"-k":""} "${(typeof pkg == "string")?pkg:pkg.id}"`)
    }

    async clearAppData(packageID:string): Promise<void>
    async clearAppData(pkg:Package): Promise<void>
    async clearAppData(pkg:string|Package) {
        await this.adb(`shell pm clear ${(typeof pkg == "string")?pkg:pkg.id}`)
    }
}