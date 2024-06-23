import type { KeyCode } from "../common/keycodes.js";
import { DeviceConnection } from "../connection.js";
export declare class Input extends DeviceConnection {
    sleep(ms: number): Promise<unknown>;
    text(str: string): Promise<void>;
    key(key: KeyCode): Promise<void>;
    tap(x: number, y: number): Promise<void>;
    swipe(x1: number, y1: number, x2: number, y2: number, duration?: number): Promise<void>;
    hold(x: number, y: number, duration: number): Promise<void>;
}
