const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
export default class CCNodePoolTemplate extends cc.Component {

    @property
    _params: any[] = [];

    /**
     * put 时调用
     *
     * @memberof CCNodePoolTemplate
     */
    unuse(): void {
        cc.log('unsue _params', this._params);
    }

    /**
     * get 时调用, 可以传入任意数量的参数
     *
     * @memberof CCNodePoolTemplate
     */
    reuse(): void {
        this._params = [...arguments];
        cc.log('reuse arguments', ...arguments);
    }

}