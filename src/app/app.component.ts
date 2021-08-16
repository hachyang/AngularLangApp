import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
//import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
//import defaultLanguage from "./../assets/i18n/en-US.json";
import uibuilder from 'node-red-contrib-uibuilder/front-end/src/uibuilderfe';

export function STI(str: string) {
  return str;
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    //styleUrls: ['./app.component.scss']
    styles: ['body {margin: 1rem;padding: 1rem;}','.d1 {margin: 0.5rem;padding: 0.5rem;}']
})
export class AppComponent {
    messageBoxContent = STI('demo.title');
    state = {
                // Example of retrieving data from uibuilder
                feVersion: uibuilder.get('version'),
    
                socketConnectedState: false,
                serverTimeOffset: '[unknown]',
    
                msgRecvd: '[Nothing]',
                msgsReceived: 0,
                msgCtrl: '[Nothing]',
                msgsControl: 0,
    
                msgSent: '[Nothing]',
                msgsSent: 0,
                msgCtrlSent: '[Nothing]',
                msgsCtrlSent: 0,
            };

    constructor(public translate: TranslateService) {
        //translate.setDefaultLang('en');
    	//translate.setTranslation('en-US', defaultLanguage);
    	translate.addLangs(['en-US', 'de-DE', 'zh-CN']);
    	translate.setDefaultLang('en-US');

   	const browserLang = translate.getBrowserLang();
    	translate.use(browserLang.match(/de|de-DE/) ? 'de-DE' : 'en-US');
    	
          /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
         * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
         * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
         * e.g. uibuilder.start('/nr/uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
         */
        uibuilder.start();


        /** You can use the following to help trace how messages flow back and forth.
         * You can then amend this processing to suite your requirements.
         */

        //#region ---- Trace Received Messages ---- //
        // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
        // newVal relates to the attribute being listened to.
        uibuilder.onChange('msg', (newVal) => {

            this.state.msgRecvd = newVal;

            console.info('[uibuilder.onChange] msg received from Node-RED server:', newVal);
        });

        // As we receive new messages, we get an updated count as well
        uibuilder.onChange('msgsReceived', (newVal) => {
            console.info('[uibuilder.onChange] Updated count of received msgs:', newVal);

            this.state.msgsReceived = newVal;
        });

        // If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
        uibuilder.onChange('ctrlMsg', (newVal) => {
            console.info('[uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal);

            this.state.msgCtrl = newVal;
        });
        // Updated count of control messages received
        uibuilder.onChange('msgsCtrl', (newVal) => {
            console.info('[uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal);

            this.state.msgsControl = newVal;
        });
        //#endregion ---- End of Trace Received Messages ---- //

        //#region ---- Trace Sent Messages ---- //
        // You probably only need these to help you understand the order of processing //
        // If a message is sent back to Node-RED, we can grab a copy here if we want to
        uibuilder.onChange('sentMsg', (newVal) => {
            console.info('[uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal);

            this.state.msgSent = newVal;
        });
        // Updated count of sent messages
        uibuilder.onChange('msgsSent', (newVal) => {
            console.info('[uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal);

            this.state.msgsSent= newVal;
        });

        // If we send a control message to Node-RED, we can get a copy of it here
        uibuilder.onChange('sentCtrlMsg', (newVal) => {
            console.info('[uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal);

            this.state.msgCtrlSent = newVal;
        });
        // And we can get an updated count
        uibuilder.onChange('msgsSentCtrl', (newVal) => {
            console.info('[uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal);

            this.state.msgsCtrlSent = newVal;
        });
        //#endregion ---- End of Trace Sent Messages ---- //

        // If Socket.IO connects/disconnects, we get true/false here
        uibuilder.onChange('ioConnected', (newVal) => {
            console.info('[uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)

            this.state.socketConnectedState = newVal;
        });
        // If Server Time Offset changes
        uibuilder.onChange('serverTimeOffset', (newVal) => {
            console.info('[uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)

            this.state.serverTimeOffset =newVal;
        });

        //Manually send a message back to Node-RED after 2 seconds
        window.setTimeout(function () {
            console.info('Sending a message back to Node-RED-after2sdelay')
            uibuilder.send({'topic': 'uibuilderfe', 'payload': 'I am a message sent from the uibuilder front end'})
        }, 2000);  
    
    }
    useLanguage(language: string) {
      this.translate.use(language);
  }
}
