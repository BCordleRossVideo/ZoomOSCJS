import Zosc from '../Zosc';
const Rosstalk = require("../Rosstalk");
import { SpeakerManager } from '../SpeakerManager';

const switcher = new Rosstalk({
    host: '10.10.80.51' // switcher ip
});

switcher.connect();

var zosc = new Zosc('10.10.80.21', 9090, 1234);

const speakerManager = new SpeakerManager(zosc, 1000);

zosc.on("newUser",(user)=>{
    user.on("activeSpeaker",()=>{
        console.log("Active Speaker received. Requesting switch for id: " + user.zoomID);
        // Log user in readable format
        // let userCopy = { ...user };
        // delete userCopy.zosc;
        // console.log("User: " + JSON.stringify(userCopy, null, 2));
        speakerManager.requestSwitch(user.zoomID);
    });
    if (user.zoomID == 16778240) {
        user.videoInput = 1;
        console.log("User is Bo! " + user.zoomID + " " + user.userName + " " + user.videoInput);
    } 
    else if (user.zoomID == 16779264) {
        user.videoInput = 2;
        console.log("User is Bo Phone! " + user.zoomID + " " + user.userName + " " + user.videoInput);
    } 
   });

speakerManager.on('triggerSwitch', (user) => {
    if (user.videoInput !== null) {
        console.log("It's real. Switching to user: " + user.zoomID + " " + user.userName + " " + user.videoInput);
        let switcherInput = user.videoInput + 17;
        switcher.xpt('2', 'PGM', 'IN:' + switcherInput);
    }
});

setTimeout(() => {console.log('Printing: '); speakerManager.printInfo();}, 15000);