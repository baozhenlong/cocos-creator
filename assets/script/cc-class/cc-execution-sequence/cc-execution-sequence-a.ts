const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCExecutionSequenceA extends cc.Component {

    init(): void {
        cc.log('a init');
    }

    onLoad() {
        cc.log('a onLoad');
    }
}