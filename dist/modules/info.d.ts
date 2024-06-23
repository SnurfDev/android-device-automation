import { DeviceConnection } from '../connection.js';
type ScreenState = 'OFF' | 'OFF_LOCKED' | 'ON_LOCKED' | 'ON_UNLOCKED';
export declare class Info extends DeviceConnection {
    getScreenSize(): Promise<{
        x: number;
        y: number;
    }>;
    getScreenState(): Promise<ScreenState>;
}
export {};
