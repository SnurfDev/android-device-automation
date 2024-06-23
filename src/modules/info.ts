import { DeviceConnection } from '../connection.js'
import { NL_RX } from '../regex.js'

type ScreenState = 'OFF' | 'OFF_LOCKED' | 'ON_LOCKED' | 'ON_UNLOCKED'

export class Info extends DeviceConnection {
    async getScreenSize(): Promise<{ x: number; y: number }> {
        let out = await this.adb(`adb shell wm size`)
        let [, sx, sy] = out.match(/(\d+)x(\d+)/) ?? []
        return {
            x: parseInt(sx ?? '0'),
            y: parseInt(sy ?? '0'),
        }
    }
    async getScreenState(): Promise<ScreenState> {
        return (await this.adb(`shell dumpsys nfc | grep 'mScreenState='`))
            .split(NL_RX)[0]
            .split('=')[1] as ScreenState
    }
}
