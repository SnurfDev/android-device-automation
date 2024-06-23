import {exec} from "child_process"
import { DeviceConnection } from "./connection.js";
import { NL_RX, NWS_RX } from "./regex.js";

// Modules
import { FileSystem } from "./modules/filesystem.js";
import { PackageManager } from "./modules/packages.js";
import { Input } from "./modules/input.js";
import { Utils } from "./modules/utils.js";
import { Info } from "./modules/info.js";

export { KeyCode } from "./common/keycodes.js";
export const adbPath = process.env.ADB_EXEC??`adb`

export type DeviceDescriptor = {
    serialNumber: string,
    model: string | undefined,
    authorized: boolean
}


export async function getDevices(): Promise<DeviceDescriptor[]> {
    let cmdOutput = await new Promise<string>((res,rej)=>{
        exec(`${adbPath} devices -l`,(err,stdout,stderr)=>{
            if(err) return rej(stderr);
            res(stdout);
        });
    });
    let outLines = cmdOutput.split(NL_RX);
    
    return outLines
        .slice(outLines.indexOf("List of devices attached")+1,-1)
        .map(ln=>{
            let [serialNumber,statusStr,...props] = ln.match(NWS_RX)||[""]
            return {
                serialNumber,
                authorized: statusStr=="device",
                model: props.find(p=>p.startsWith("model"))?.slice(6)?.replace(/_/g," ")
            }
        });
}

export class Device extends DeviceConnection {
    authorized: boolean
    model: string | undefined

    constructor(serialNumber:string);
    constructor(deviceDescriptor:DeviceDescriptor);
    constructor(snOrDD:string|DeviceDescriptor) {
        if(typeof snOrDD == "string") {
            super(snOrDD);
            this.device = this
            this.authorized = false;
        }else{
            super(snOrDD.serialNumber)
            this.device = this
            this.authorized = snOrDD.authorized;
            this.model = snOrDD.model;
        }
    }
    

    async authorize() {
        await this.adb("wait-for-device",10000);
    }

    loadedModules: DeviceConnection[] = []

    getModule<M extends DeviceConnection>(cls: new (sn: string,dev: Device)=>M): M {return new cls(this.serialNumber,this);}

    // Available Modules

    // File System
    getFS() {return this.getModule(FileSystem)}
    // Package Manager
    getPM() {return this.getModule(PackageManager)}
    // Input
    getInput() {return this.getModule(Input)}
    // Utils
    getUtils() {return this.getModule(Utils)}
    // Info
    getInfo() {return this.getModule(Info)}
}