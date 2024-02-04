import Zosc from '../Zosc';
const Rosstalk = require("../Rosstalk");
const Dashboard = require("../Dashboard");
import { SpeakerManager } from '../SpeakerManager';
import ZoscHttp from '../ZoscHttp';

const switcher = new Rosstalk({
    host: '10.10.80.51' // switcher ip
});

switcher.connect();

const dashboard = new Dashboard({
    host: '127.0.0.1' // dashboard ip
});

dashboard.connect();

var zosc = new Zosc('10.10.80.21', 9090, 1234);

const speakerManager = new SpeakerManager(zosc, 1000);

var zoscHttp = new ZoscHttp(zosc, 3000);

var switcherOn = true;

zoscHttp.on('switcherOn', () => {
    switcherOn = true;
    console.log('Active Speaker Switcher is on');
});

zoscHttp.on('switcherOff', () => {
    switcherOn = false;
    console.log('Active Speaker Switcher is off');
});

zosc.list();

zosc.on("newUser",(user)=>{
    user.on("activeSpeaker",()=>{
        console.log("Active Speaker received. Requesting switch for id: " + user.zoomID);
        // Log user in readable format
        // let userCopy = { ...user };
        // delete userCopy.zosc;
        // console.log("User: " + JSON.stringify(userCopy, null, 2));
        if (switcherOn) {
            speakerManager.requestSwitch(user.zoomID);
        }
    });
    user.on("userUpdated",(user)=>{
        console.log("User Updated received for " + user.userName);
        zosc.printAllUsers();
        zosc.printAllUsersToFile();
        dashboard.send(zosc.JSONAllUsers());
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

zosc.on("usersUpdated",()=>{
    zosc.list();
    dashboard.send(zosc.JSONAllUsers());
});

speakerManager.on('triggerSwitch', (user) => {
    if (user.videoInput !== null) {
        console.log("It's real. Switching to user: " + user.zoomID + " " + user.userName + " " + user.videoInput);
        let switcherInput = user.videoInput + 17;
        switcher.xpt('2', 'PGM', 'IN:' + switcherInput);
    }
});

setTimeout(() => {console.log('Printing: '); speakerManager.printInfo();}, 15000);