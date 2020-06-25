const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCExecutionSequenceB extends cc.Component {

    init(): void {
        cc.log('b init');
    }

    onLoad() {
        cc.log('b onLoad');
    }
}