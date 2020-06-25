const { ccclass, property, executeInEditMode, executionOrder } = cc._decorator;

@ccclass
@executeInEditMode
@executionOrder(-1)
export default class CCExecutionSequenceC extends cc.Component {

    onLoad() {
        cc.log('c onLoad');
    }

}