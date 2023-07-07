'use strict';

var net = require('net');
var util = require('util');
var events = require('events');

const end = '\r\n';

/**
 *  Expose `Rosstalk`
 */

module.exports = Dashboard;

/**
 *  A talkable ross
 *
 *  @params {Object} opts
 */

function Dashboard(opts) {
  opts = opts || {};

  if (!opts.host) throw new Error('Must provide switcher host address');

  this.host = opts.host;
  this.port = opts.port || 7799;

  this.connection = null;
};

/**
 *  Inherit the EE
 */

util.inherits(Dashboard, events.EventEmitter);

/**
 *  Connect to the switcher
 */

Dashboard.prototype.connect = function connect() {
    this.connection = net.connect(this.port, this.host);
    
    this.connection.on('connect', () => {
      console.log('Dashboard Connected.');
      // You can safely call _send or other methods that use connection.write here
    });
  
    this.connection.on('error', (error) => {
      console.error('Failed to connect', error);
      // Handle connection errors
    });

    this.connection.on('end', () => {
      console.log('Dashboard Disconnected.');
      setTimeout(() => {
        console.log('Attempting to reconnect to Dashboard');
        this.connect(); // replace this with your function that attempts to connect
      }, 2000); // 2000 milliseconds = 2 seconds
    });
    
  
    return this;
  };

/**
 *  Send a command to the switcher
 */

Dashboard.prototype.send = function send(data) {

  var buf = Buffer.from(data + end);

  this.connection.write(buf);

  return this;
};