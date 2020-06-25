const { ccclass, property } = cc._decorator;

@ccclass
export default class CCNetworkInterface extends cc.Component {

    onLoad() {
        this.xhr();
        this.ws();
    }

    xhr(): void {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let response = xhr.responseText;
                cc.log('xhr response', response);
            }
        }
        xhr.open('GET', '', true);
        xhr.send();
    }

    ws(): void {
        let ws = new WebSocket('ws://echo.websocket.org');
        ws.onopen = (event) => {
            cc.log('onopen event', event);
        };
        ws.onmessage = (event) => {
            cc.log('onmessage event', event);
        };
        ws.onclose = (event) => {
            cc.log('onclose event', event);
        };
        setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('hello');
            } else {
                cc.log('WebSocket instance was not ready...');
            }
        }, 1000 * 3);
    }

}