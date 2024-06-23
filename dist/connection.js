import { exec } from "child_process";
import { Device, adbPath } from "./index.js";
export class DeviceConnection {
    serialNumber;
    device;
    constructor(serialNumber, device) {
        this.serialNumber = serialNumber;
        this.device = device;
    }
    adb(command, timeout = -1) {
        return new Promise((res, rej) => {
            let tmTimeout = null;
            let cproc = exec(`${adbPath} -s ${this.serialNumber} ${command}`, (err, stdout) => {
                if (tmTimeout)
                    clearTimeout(tmTimeout);
                if (err)
                    return rej(`Command "adb ${command}" failed with code ${err.code}`);
                res(stdout);
            });
            if (timeout != -1) {
                tmTimeout = setTimeout(() => {
                    cproc.kill();
                    rej(`Command "adb ${command}" timed out`);
                }, timeout);
            }
        });
    }
}
