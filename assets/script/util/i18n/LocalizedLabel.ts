import LanguageMgr, { LanguageEnum } from "./LanguageMgr";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu('多语言/文本')
@executeInEditMode
export default class LocalizedLabel extends cc.Label {

    @property
    private _category: string = 'common';

    @property({
        displayName: '种类'
    })
    protected set category(value: string) {
        this._category = value;
        this._updateLb();
    }
    protected get category(): string {
        return this._category;
    }

    @property
    private _textKey: string = '';

    @property({
        displayName: '文本键'
    })
    protected set textKey(value: string) {
        if (this._textKey !== value) {
            this._textKey = value;
            this._updateLb();
        }
    }
    protected get textKey(): string {
        return this._textKey;
    }

    @property
    private _language: LanguageEnum = LanguageEnum.简体中文;

    @property({
        displayName: '当前语言',
        type: cc.Enum(LanguageEnum),
    })
    protected set language(value: LanguageEnum) {
        this._language = value;
        this._updateLb();
    }
    protected get language(): LanguageEnum {
        return this._language;
    }

    private _updateLb(): void {
        if (CC_EDITOR) {
            LanguageMgr.currentLanguage = this.language;
        }
        let text: string = LanguageMgr.getText(this._textKey, this._category);
        if (text) {
            this.string = text;
        }
    }

    onLoad() {
        if (CC_EDITOR) {
            this.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            this.verticalAlign = cc.Label.VerticalAlign.CENTER;
            this.enableWrapText = false;
        }
    }

    start() {
        this._updateLb();
    }
}