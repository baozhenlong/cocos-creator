const { ccclass, property } = cc._decorator;

@ccclass
export default class CCSchedule extends cc.Component {

    onLoad() {
        this.once();
        this.five();
    }

    once(): void {
        this.scheduleOnce(() => {
            cc.log('过去 1 s了');
        }, 1);
    }

    five(): void {
        // 以秒为单位的时间间隔
        let interval: number = 2;
        // 重复次数
        let repeat: number = 4;
        // 开始延迟
        let delay: number = 1;
        let count: number = 0;
        this.schedule(() => {
            count++;
            cc.log('次数', count);
        }, interval, repeat, delay);
        // delay 秒后开始执行第一次, 然后每 interval 秒执行一次回调, 一共 4 + 1 次
    }

    scheduleCallback(): void {

    }

    startSchedule(): void {
        // 开始一个计时器
        this.schedule(this.scheduleCallback, 1);
    }

    stopSchedule(): void {
        // 取消一个计时器
        this.unschedule(this.scheduleCallback);
    }

    stopAll(): void {
        // 取消这个组件的所有计时器
        this.unscheduleAllCallbacks();
    }

}