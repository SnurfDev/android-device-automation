import { DeviceConnection } from "../connection.js";
import { NL_RX, NWS_RX } from "../regex.js";
import path from "path";
import fs from "fs";
import { tmpdir } from "os";
import { randomBytes } from "crypto";
function parsePerms(pstr) {
    let [, ftype, perms] = pstr.match(/([\-dl])([\-rwxs]{9})/) ?? [];
    let [owner, group, everyone] = perms.match(/[\-rwxs]{3}/g) || ["---", "---", "---"];
    let op = {
        read: owner[0] == "r",
        write: owner[1] == "w",
        execute: owner[2] == "x" || owner[2] == "s",
    };
    let gp = {
        read: group[0] == "r",
        write: group[1] == "w",
        execute: group[2] == "x" || group[2] == "s",
    };
    let ep = {
        read: everyone[0] == "r",
        write: everyone[1] == "w",
        execute: everyone[2] == "x" || everyone[2] == "s",
    };
    return {
        isDirectory: ftype == "d",
        isLink: ftype == "l",
        isFile: ftype == "-",
        permissions: {
            owner: op,
            group: gp,
            everyone: ep
        },
        perms: (op.read ? 0o400 : 0) + (op.write ? 0o200 : 0) + (op.execute ? 0o100 : 0) +
            (gp.read ? 0o040 : 0) + (gp.write ? 0o020 : 0) + (gp.execute ? 0o010 : 0) +
            (ep.read ? 0o004 : 0) + (ep.write ? 0o002 : 0) + (ep.execute ? 0o001 : 0)
    };
}
function parseStats(sstr) {
    let [pstr, hardlinksStr, owner, group, sizeStr, dateStr, timeStr, name] = sstr.match(NWS_RX) || ["-----------"];
    return {
        ...parsePerms(pstr),
        hardlinks: parseInt(hardlinksStr),
        owner,
        group,
        size: parseInt(sizeStr),
        mtime: new Date(`${dateStr}T${timeStr}:00Z`),
        name
    };
}
function genTmpFile() {
    return path.join(tmpdir(), `ada_${randomBytes(8).toString("hex")}.bin`);
}
export class FileSystem extends DeviceConnection {
    async readDir(dir, stat) {
        if (stat) {
            return (await this.adb(`shell ls -al "${dir}"`)).split(NL_RX).slice(1, -1).map(v => parseStats(v));
        }
        else {
            return (await this.adb(`shell ls "${dir}"`)).split(NL_RX).slice(0, -1);
        }
    }
    async stat(file) {
        return parseStats((await this.adb(`shell ls -al "${file}"`)).split(NL_RX)[0]);
    }
    async readFile(file) {
        let tmpFile = genTmpFile();
        await this.adb(`pull "${file}" "${tmpFile}"`);
        let buf = fs.readFileSync(tmpFile);
        fs.rmSync(tmpFile);
        return buf;
    }
    async writeFile(file, data) {
        let tmpFile = genTmpFile();
        fs.writeFileSync(tmpFile, data);
        await this.adb(`push "${tmpFile}" "${file}"`);
        fs.rmSync(tmpFile);
    }
}
