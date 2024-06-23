import { KeyCode } from '../common/keycodes.js';
import { DeviceConnection } from '../connection.js';
export class Utils extends DeviceConnection {
    async unlock(pin) {
        let input = this.device?.getInput();
        let info = this.device?.getInfo();
        if (!input || !info)
            return;
        if ((await info.getScreenState()) == 'OFF_LOCKED') {
            await input.key(KeyCode.POWER);
            await input.sleep(250);
        }
        if ((await info.getScreenState()) == 'ON_LOCKED') {
            await input.swipe(0, 1000, 0, 200);
            await input.sleep(250);
            await input.text(pin);
            await input.key(KeyCode.ENTER);
        }
        while ((await info.getScreenState()) != 'ON_UNLOCKED')
            await input.sleep(250);
    }
    async launchApp(appID) {
        await this.adb(`shell monkey -p ${appID} 1`);
    }
    async killApp(appID) {
        await this.adb(`shell am force-stop ${appID}`);
    }
    async getScreen(asPng) {
        return Buffer.from(await this.adb(`exec-out screencap ${asPng ? '-p' : ''} | base64 -w0`), 'base64');
    }
}
