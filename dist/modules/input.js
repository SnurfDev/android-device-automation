import { DeviceConnection } from '../connection.js';
export class Input extends DeviceConnection {
    async sleep(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }
    async text(str) {
        await this.adb(`shell input text "${str.replace(/\ /g, '%s')}"`);
    }
    async key(key) {
        await this.adb(`shell input keyevent ${key}`);
    }
    async tap(x, y) {
        await this.adb(`shell input tap ${x} ${y}`);
    }
    async swipe(x1, y1, x2, y2, duration) {
        await this.adb(`shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration ?? ''}`);
    }
    async hold(x, y, duration) {
        await this.swipe(x, y, x, y, duration);
    }
}
