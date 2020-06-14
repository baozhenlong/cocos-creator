/**
 * 在d.ts加了require 不需要在每个文件里定义了
 */
declare const require: any;
/**
 * Editor编辑器 只在编辑器环境中运行
 */
declare namespace Editor {


    /**
     *  Log the error message and show on the console, it also shows the call stack start from the function call it. The method will sends ipc message editor:console-error to all windows.
     *
     * @export
     * @static
     * @param {...any} args Whatever arguments the message needs
     */
    export static function error(...args: any): void;

    /**
   *  Log the normal message and show on the console. The method will send ipc message editor:console-log to all windows.
   *
   * @export
   * @static
   * @param {...any} args Whatever arguments the message needs
   */
    export static function log(...args: any): void;

    /**
   *  Log the warnning message and show on the console, it also shows the call stack start from the function call it. The method will send ipc message editor:console-warn to all windows.
   *
   * @export
   * @static
   * @param {...any} args Whatever arguments the message needs
   */
    export static function warn(...args: any): void;

    export var assetdb: Editor.AssetDB;

    /**
     * assets目录下的数据
     *
     * @export
     * @class AssetDB
     */
    export class AssetDB {

        /**
         * 通过UUID查询URL
         *
         * @static
         * @param {string} uuid
         * @param {(error: any, path: string) => void} cb
         * @memberof AssetDB
         */
        queryUrlByUuid(uuid: string, cb: (error: any, path: string) => void): void;


        /**
         * 通过url 查询资源的UUID
         *
         * @param {string} url
         * @param {(error:any, uuid:string)=>void} cb
         * @memberof AssetDB
         */
        queryUuidByUrl(url: string, cb: (error: any, uuid: string) => void): void;

        queryInfoByUuid(uuid: string, cb: (error: any, info: any) => void): void;
    }
}
declare namespace sp.spine {
    interface Animation {
        duration: number;
        name: string;
    }
}
declare namespace cc {
    interface SceneAsset {

        /**
         * 隐藏属性 _uuid
         * 
         * @type {string}
         * @memberof SceneAsset
         */
        _uuid: string;
    }
    interface Asset {
        /**
     * 隐藏属性 _uuid
     * 
     * @type {string}
     * @memberof SceneAsset
     */
        _uuid: string;
    }
    interface Texture2D {
        /**
        * 隐藏属性 _uuid
        * 
        * @type {string}
        * @memberof SceneAsset
        */
        _uuid: string;
    }
}


