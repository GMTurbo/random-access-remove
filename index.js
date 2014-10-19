var fs = require('fs'),
  chunkingStreams = require('chunking-streams'),
  EventEmitter = require('events').EventEmitter,
  util = require('util'),
  though = require('through');


var randomAccessRemove = function(options){

  options = options || {
    chunkSize: 1024;
  }

  if (!(this instanceof randomAccessRemove))
     return new randomAccessRemove(options);


  function remove(filename, offet, length, callback){

    var source = fs.createReadStream(fileName);

    var destination = fs.createWriteStream(fileName);

    var chunker = new SizeChunker({
      chunkSize: options.chunkSize,
      flushTail: true
    });

    var byteCount = 0;

    //we need to block the buffer chunks that
    // are within offset->offset+length
    chunker.on('data', function(chunk) {

      byteCount+=chunk.data.length;

      if(byteCount > offset){

      }

    });

    source.pipe(chunker).(new through(onData)).pipe(destination);
  };

  return {
    remove: remove
  };
};

module.exports = randomAccessRemove;
