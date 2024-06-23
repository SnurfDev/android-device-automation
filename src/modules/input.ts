import type { KeyCode } from '../common/keycodes.js'
import { DeviceConnection } from '../connection.js'

export class Input extends DeviceConnection {
    async sleep(ms: number) {
        return new Promise((res) => setTimeout(res, ms))
    }
    async text(str: string) {
        await this.adb(`shell input text "${str.replace(/\ /g, '%s')}"`)
    }
    async key(key: KeyCode) {
        await this.adb(`shell input keyevent ${key}`)
    }
    async tap(x: number, y: number) {
        await this.adb(`shell input tap ${x} ${y}`)
    }
    async swipe(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        duration?: number
    ) {
        await this.adb(
            `shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration ?? ''}`
        )
    }
    async hold(x: number, y: number, duration: number) {
        await this.swipe(x, y, x, y, duration)
    }
}
