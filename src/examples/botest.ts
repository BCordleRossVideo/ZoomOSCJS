import Zosc from "../Zosc";	// import the class
import {Server,Client, ArgumentType, Message} from 'node-osc';
import {EventEmitter }from "events";
import { User } from "../User";
import { UserCommands } from "../consts";
import * as fs from 'fs';

let zosc = new Zosc("10.10.80.21",9090,1234);	// create a new instance of the ZOSC class

console.log("App Started.");

zosc.oscServer.on('message', function (msg, rinfo){
   console.log('Data:', msg);
   //console.log('From:', rinfo);
   zosc.handleUpdate(msg);  
});

zosc.on("newUser",(user)=>{
   //Log the new user
   console.log("New user: " + zosc.printAllUsers());
});

zosc.oscServer.on('message', function(){
   zosc.printAllUsers();
});

zosc.on("activeSpeaker", function() {
   // Add what you want to do when the activeSpeaker event is emitted here.
   console.log("Active speaker event has been emitted!");
});

zosc.on("mute", function() {
   // Add what you want to do when the activeSpeaker event is emitted here.
   console.log("Mute event has been emitted!");
});

zosc.on("emojiChanged", function() {
   console.log("Emoji is: ");
});
// zosc.sendMeCommand("videoOn");