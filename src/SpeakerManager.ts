import { EventEmitter } from 'events';
import { RossUser } from './RossUser';
const { Zosc } = require('./Zosc');

class SpeakerManager extends EventEmitter {
    private zosc: typeof Zosc;
    private speakers: { [key: number]: RossUser } = {};
    private speaker: RossUser | null = null;
    private recentSpeakers: { [key: number]: string } = {};
    private recentSpeakersMaxSize: number = 10;
    private currentSpeaker: RossUser | null = null;
    private isSwitchWaiting: boolean = false;
    private nextSpeaker: RossUser | null = null;
    private lastSwitch: number = 0;
    private switchTimeout: number = 1000;

    constructor(zosc: typeof Zosc, switchTimeout: number) {
      super();
      this.zosc = zosc;
      this.speakers = zosc.users;
      this.switchTimeout = switchTimeout;
      console.log('SpeakerManager initialized with switchTimeout: ' + this.switchTimeout);
    }

  // Keep track of the last 10 speakers
  private addToRecentSpeakers(speaker: RossUser): void {
    if (Object.keys(this.recentSpeakers).length >= this.recentSpeakersMaxSize) {
      const oldestKey = Object.keys(this.recentSpeakers)[0];
      delete this.recentSpeakers[oldestKey];
    }
    this.recentSpeakers[speaker.zoomID] = speaker.userName;
  }
  

  public triggerSwitch(speaker:RossUser | null): void {
    if (speaker === undefined || speaker === null) {
        console.log('No speaker provided to triggerSwitch(). Bailing.');
        return;
    }

    this.speaker = speaker; // Set the speaker to the new speaker
    
    // Enter code here to trigger the actual switch.
    try {
        this.emit('triggerSwitch', this.speaker);
        console.log("Switch triggered for speaker: " + speaker.zoomID)
    } 
    catch (error) {        
        console.log("Error triggering switch. " + error)
    }

    this.addToRecentSpeakers(speaker); // Add the speaker to the recentSpeakers array
    this.lastSwitch = Date.now(); // Set the lastSwitch property to the current time
    console.log('This.lastSwitch time: ' + this.lastSwitch);
    this.speaker.lastSpoke = Date.now(); // Set the lastSpoke property of the speaker to the current time
    this.speaker.lastSwitch = Date.now(); // Set the lastSwitch property of the speaker to the current time
    this.currentSpeaker = speaker; // Set the currentSpeaker to the new speaker
    this.isSwitchWaiting = false; // Reset the switch waiting flag
    this.nextSpeaker = null; // Reset the next speaker
    this.emit('switch', this.currentSpeaker);
    // console.log('Switch triggered for SpeakerID: ' + this.currentSpeaker.zoomID);

    // Schedule a timeout to check for a pending switch after the switchTimeout duration
    setTimeout(() => {
      if (this.isSwitchWaiting || this.nextSpeaker !== null) {
        this.triggerSwitch(this.nextSpeaker);
      }
    }, this.switchTimeout);
  }

  public requestSwitch(activeSpeakerID: number): void {
    let currentTime = Date.now();
    let timeSinceLastSwitch = currentTime - this.lastSwitch;
    console.log('Time since last switch: ' + timeSinceLastSwitch);
    // Check to see if speaker is already in the speakers array
    if (!this.speakers[activeSpeakerID]) {
        console.log('Speaker not found. Adding SpeakerID: ' + activeSpeakerID);
        this.speaker = this.speakers[activeSpeakerID];
    // console.log('Speaker added: ' + activeSpeakerID);
    }
    else {
        console.log('Speaker found: ' + activeSpeakerID);
        this.speaker = this.speakers[activeSpeakerID];
    }
    // Check if a switch is not pending, the switch timeout has passed, and the speaker is different from the current speaker
    if (this.speaker !== this.currentSpeaker){
      if (!this.isSwitchWaiting && timeSinceLastSwitch >= this.switchTimeout) {
          console.log("this.isSwitchWaiting: " + this.isSwitchWaiting);
          console.log("timeSinceLastSwitch: " + timeSinceLastSwitch);
          console.log("this.switchTimeout: " + this.switchTimeout);
          console.log("Triggering switch for SpeakerID: " + this.speaker.zoomID);
          this.triggerSwitch(this.speaker); // Trigger the switch
      } 
      else { 
        console.log("this.isSwitchWaiting: " + this.isSwitchWaiting);
        console.log("timeSinceLastSwitch: " + timeSinceLastSwitch);
        console.log("this.switchTimeout: " + this.switchTimeout);
        this.nextSpeaker = this.speaker; // Update the next speaker
        this.isSwitchWaiting = true; // Set the switch waiting flag
        console.log('Switch pending for SpeakerID: ' + this.speaker.zoomID);
      }
    }
    else {
      console.log('No switch needed. SpeakerID: ' + this.speaker.zoomID + ' is already the current speaker.')
    }
  }

  public getCurrentSpeaker(): any {
    return this.currentSpeaker; // Get the currently active speaker
  }

  public getNextSpeaker(): any {
    return this.nextSpeaker; // Get the next speaker if a switch is pending
  }

  public getRecentSpeakers(): any {
    return this.recentSpeakers; // Get the recent speakers array
  }

  public printInfo(): void {// Log user in readable format
    let currentSpeakerCopy = { ...this.currentSpeaker };
    delete currentSpeakerCopy.zosc;
    console.log('Current Speaker: ' + JSON.stringify(currentSpeakerCopy, null, 2));
    console.log('Recent Speakers:', JSON.stringify(this.recentSpeakers, null, 2));    
  }
}

export { SpeakerManager };