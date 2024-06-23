import { DeviceConnection } from '../connection.js';
interface Perm {
    read: boolean;
    write: boolean;
    execute: boolean;
}
interface Perms {
    isDirectory: boolean;
    isFile: boolean;
    isLink: boolean;
    permissions: {
        owner: Perm;
        group: Perm;
        everyone: Perm;
    };
    perms: number;
}
type Stats = Perms & {
    hardlinks: number;
    owner: string;
    group: string;
    size: number;
    mtime: Date;
    name: string;
};
export declare class FileSystem extends DeviceConnection {
    readDir(dir: string): Promise<string[]>;
    readDir(dir: string, stat: true): Promise<Stats[]>;
    stat(file: string): Promise<Stats>;
    readFile(file: string): Promise<Buffer>;
    writeFile(file: string, data: Buffer | string): Promise<void>;
}
export {};
