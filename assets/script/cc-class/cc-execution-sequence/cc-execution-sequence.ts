import CCExecutionSequenceA from "./cc-execution-sequence-a";
import CCExecutionSequenceB from "./cc-execution-sequence-b";

const { ccclass, property, executeInEditMode, executionOrder } = cc._decorator;

@ccclass
@executeInEditMode
@executionOrder(-2)
export default class CCExecutionSequence extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '概要',
        readonly: true
    })
    summaryDescArr: string[] = [
        '使用统一的脚本来管理其他脚本',
        '同一个节点上的组件脚本执行顺序, 可以通过组件在属性检查器里的排列顺序来控制, 排列在上的组件会先于排列在下的组件执行',
        '设置组执行优先级 executionOrder, executionOrder 越小, 该组件相对于其它组件就会越先执行, executionOrder 默认为 0',
        'executionOrder 只对 onLoad onEnable start update lateUpdate 有效, 对 onDisable onDestroy 无效'
    ];

    @property({
        displayName: '脚本 a',
        type: CCExecutionSequenceA
    })
    a: CCExecutionSequenceA = null;

    @property({
        displayName: '脚本 a',
        type: CCExecutionSequenceB
    })
    b: CCExecutionSequenceB = null;

    onLoad() {
        this.a.init();
        this.b.init();
    }
}