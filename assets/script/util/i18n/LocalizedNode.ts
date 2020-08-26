import LanguageMgr, { LanguageEnum } from "./LanguageMgr";

const { ccclass, property, executeInEditMode, menu } = cc._decorator;

const Node = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    opacity: 255
};

interface NodeProps {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    angle: number;
    anchorX: number;
    anchorY: number;
    opacity: number;
};

@ccclass
@menu('多语言/节点数据')
@executeInEditMode
export default class LocalizedNode extends cc.Component {

    @property({
        visible: false
    })
    private _customData: NodeProps = {} as NodeProps;

    @property
    private _language: LanguageEnum = LanguageEnum.简体中文;
    @property({
        displayName: '当前语言',
        type: cc.Enum(LanguageEnum)
    })
    protected set language(value: LanguageEnum) {
        this._language = value;
        this._updateNode(value);
    }
    protected get language(): LanguageEnum {
        return this._language;
    }

    @property({
        displayName: '存储节点数据'
    })
    set save(value: boolean) {
        this._saveNodeProps(this.language);
    }
    get save(): boolean {
        return false;
    }

    private _saveNodeProps(language: LanguageEnum): void {
        let nodeProps: NodeProps = {} as NodeProps;
        Object.keys(Node).forEach((prop) => {
            nodeProps[prop] = this.node[prop];
        });
        this._customData[language] = nodeProps;
    }

    onLoad() {
        if (CC_EDITOR) {
            LanguageMgr.languageKeyArr.forEach((key, index) => {
                if (!this._customData[index]) {
                    this._saveNodeProps(index);
                }
            });
        } else {
            this._updateNode(LanguageMgr.currentLanguage);
        }
    }

    private _updateNode(language: LanguageEnum): void {
        let nodeProps: NodeProps = this._customData[language];
        if (nodeProps) {
            for (let key in nodeProps) {
                this.node[key] = nodeProps[key];
            }
        } else {
            cc.warn('未设置属性', language);
        }
    }
}