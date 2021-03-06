declare const Polyglot: any;

export enum LanguageEnum {
    简体中文,
    英文
}

const REPLACE_MODE: string = '##XDGKZY##';

class LanguageMgr {

    private _polyglot = null;
    private _lastLanguageKey = '';

    private _initPolyglot(data: string): void {
        if (data) {
            if (this._polyglot) {
                this._polyglot.replace(data);
            } else {
                this._polyglot = new Polyglot({ phrases: data, allowMissing: true });
            }
        }
    }

    private _t(key: string): string {
        let str: string = '';
        if (this._polyglot) {
            str = this._polyglot.t(key);
        }
        return str;
    }

    currentLanguage: LanguageEnum = LanguageEnum.简体中文;

    languageKeyArr: string[] = ['zh', 'en'];

    getLanguageKey(language: LanguageEnum): string {
        let key: string;
        switch (language) {
            case LanguageEnum.简体中文:
                key = 'zh';
                break;
            case LanguageEnum.英文:
                key = 'en';
                break;
            default:
                cc.warn('没有指定语言', language);
                break;
        }
        return key;
    }

    getText(textKey: string, category: string, language: number = this.currentLanguage): string {
        if (!textKey) {
            return '';
        }
        let languageKey = `i18n-${this.getLanguageKey(language)}-${category}`;
        let data = window[languageKey];
        if (!data) {
            return textKey;
        }
        if (this._lastLanguageKey !== languageKey) {
            this._lastLanguageKey = languageKey;
            this._initPolyglot(data);
        }
        let text: string = this._t(textKey);
        if (!text) {
            cc.warn('can not find localize text key', languageKey, ', category', category);
        }
        return text;
    }

    getLanguageDataByURL(url: string): {
        languageIndex: number,
        resURL: string
    } {
        let languageKey: string;
        let languageIndex: number;
        for (let i = 0; i < this.languageKeyArr.length; i++) {
            let key: string = this.languageKeyArr[i];
            if (url.includes(`${key}`)) {
                languageKey = key;
                languageIndex = i;
                break;
            }
        }
        let resURL: string = url.replace(`/${languageKey}/`, REPLACE_MODE);
        return {
            languageIndex,
            resURL
        };
    }

    checkResURL(resURL: string): string {
        let url: string = resURL.replace(REPLACE_MODE, `/${this.getLanguageKey(this.currentLanguage)}/`);
        return url;
    }

}
export default new LanguageMgr;