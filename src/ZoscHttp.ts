import { EventEmitter } from "events";
import Ziso from "./Ziso";
import Zosc from "./Zosc";
const express = require('express');

export default class ZoscHttp extends EventEmitter{
  private ziso: Ziso | Zosc;
  private httpPort: number;
  private app = express();

  constructor(ziso: Ziso | Ziso, httpPort: number = 3000) {
    super();
    this.ziso = ziso;
    this.httpPort = httpPort;

    this.app.post('/mute/:zoomID', (req, res) => {
        console.log("Muting user: " + req.params.zoomID);
        this.ziso.users[req.params.zoomID].mute();
        res.send('User Muted Successfully.');
      });
  
    this.app.post('/list', (req, res) => {
        console.log("Sending List Command");
        this.ziso.sendZoomCommand('list');
        res.send('List command sent.');
      });
  
    this.app.post('/ping', (req, res) => {
        console.log("Sending ping Command");
        this.ziso.sendZoomCommand('ping');
        res.send('Ping command sent.');
      });
  
    this.app.post('/getOutputRouting', (req, res) => {
        console.log("Getting Output Routing");
        this.ziso.sendZoomCommand('getOutputRouting');
        res.send('getOutputRouting Sent.');
    });

    this.app.post('/setOutputFramerate/:framerate', (req, res) => {
        console.log("Setting Output Framerate to " + req.params.framerate);
        this.ziso.sendZoomCommand('setOutputFramerate',req.params.framerate);
        res.send('setOutputFramerate Sent.');
    });

    this.app.listen(httpPort, () => {
        console.log(`Http server is listening on port ${httpPort}`);
      });
    }
}