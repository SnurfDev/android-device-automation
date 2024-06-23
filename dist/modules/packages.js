import { DeviceConnection } from "../connection.js";
import { NL_RX } from "../regex.js";
export class PackageManager extends DeviceConnection {
    async getPackages() {
        let packageStrs = (await this.adb(`shell pm list packages -3 -f`)).split(NL_RX).slice(0, -1);
        return packageStrs.map(v => {
            let rawStr = v.slice(8);
            return {
                id: rawStr.slice(rawStr.lastIndexOf("=") + 1),
                apkPath: rawStr.slice(0, rawStr.lastIndexOf("="))
            };
        });
    }
    async installApp(apkPath) {
        await this.adb(`install "${apkPath}"`);
    }
    async updateApp(apkPath) {
        await this.adb(`install -r "${apkPath}"`);
    }
    async uninstallApp(pkg, keepData) {
        await this.adb(`uninstall ${keepData ? "-k" : ""} "${(typeof pkg == "string") ? pkg : pkg.id}"`);
    }
    async clearAppData(pkg) {
        await this.adb(`shell pm clear ${(typeof pkg == "string") ? pkg : pkg.id}`);
    }
}
