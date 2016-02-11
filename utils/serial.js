var log4js = require('log4js');
var logger = log4js.getLogger('system');

var serialport = require('serialport');

exports.Serial = function(dev){
  var that = this;

  this.sp = new serialport.SerialPort(dev, {
      baudrate : 9600,
      dataBits : 8,
      parity : 'none',
      flowControl : false
  }, false);

  // open serial port
  logger.info('open serial (' + dev + ')');
  this.sp.open(function(err) {
      if(err) logger.error(err);
  });

  this.setCameraAngle = function(axis, angle, callback) {
    if(!this.sp.isOpen()){
      if(callback) callback();
      return;
    }

    angle = parseInt(angle);
    if(angle >= 40){
      logger.error("angle is too large : angle=" + angle); 
      return;
    }

    var data = [(1 << 7) | (axis ? (1 << 6) : 0)
                         | (angle & ((1 << 6) - 1))];
    this.sp.write(data, function(err, res) {
        if(err) logger.error(err);
        if(callback) callback();
    });
  };

  this.getCameraAngle = function(axis, callback) {
    if(!this.sp.isOpen()){
      if(callback) callback();
      return;
    }

    var data = [0 | (axis ? 1 : 0) | (1 << 6)];
    this.sp.write(data, function(err, res){
        if(err) logger.error(err);
        if(callback) callback(res & ((1<<7)-1)); 
    });
  };

  this.setLed = function(value, callback) {
    if(!this.sp.isOpen()){
      if(callback) callback();
      return;
    }

    var data = [0 | (1 << 5) | (value ? 1 : 0)];
    this.sp.write(data, function(err, res){
        if(err) logger.error(err);
        if(callback) callback();
    })
  };
};
