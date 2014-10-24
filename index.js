var fs = require('fs'),
  util = require('util'),
  through = require('through'),
  _ = require('lodash');

var randomAccessRemove = function(options) {

  options = options || {
    chunkSize: 1024
  };

  if (!(this instanceof randomAccessRemove))
    return new randomAccessRemove(options);

  var _unlink = function(filename, callback){

    fs.unlink(filename, function(err) {
      if (err){
        process.nextTick(function(){
          callback(err);
        });
        return;
      }
      try {
        fs.renameSync(filename + ".tmp", filename);
      } catch (e) {
        process.nextTick(function(){
          callback(e);
        });
        return;
      }
      process.nextTick(callback);
    });

  };

  var _getFilteredBuff = function(buffer, start, end, toRemoveStart, toRemoveEnd) {
    //all clear
    if (start > toRemoveEnd || end < toRemoveStart) {
      return buffer;
    }

    //start outside and end within removal range
    if (start <= toRemoveStart && end <= toRemoveEnd) {
      //remove the file contents within removal range
      return buffer.slice(start, toRemoveStart);
    }
    //start within removal range and end out of it
    else if (start >= toRemoveStart && end >= toRemoveEnd) {
      return buffer.slice((toRemoveEnd - start), buffer.length);

      //we have stepped over the removal range and have to
      // do a splice and concat
    } else if (start <= toRemoveStart && end >= toRemoveEnd) {

      return Buffer.concat([buffer.slice(0, toRemoveStart),
        buffer.slice(toRemoveEnd, buffer.length)
      ]);
    }
  }

  function removeAll(filename, offsets, callback) {

    if (!fs.existsSync(filename)) {

      console.error(filename + " doesn't exist :(");

      process.nextTick(function() {
        callback(filename + " doesn't exist :(");
      });

      return;
    }

    var source = fs.createReadStream(filename);

    var destination = fs.createWriteStream(filename + ".tmp");

    var _calculatePositions = function(offsetsAndLengths) {

      var ret = [];

      for (var i = 0, len = offsetsAndLengths.length; i < len; i++) {
        ret.push({
          start: offsetsAndLengths[i][0],
          end: offsetsAndLengths[i][0] + offsetsAndLengths[i][1]
        });
      }
      return ret;
    };

    var byteOffset = 0,
      offsets = _calculatePositions(offsets);

    var _getCutBuffer = function(buffer, bufStart, bufEnd) {

      var buffOffset = 0;

      var exlusionsWithin = _.forEach(offsets, function(offset) {

        buffer = _getFilteredBuff(buffer, bufStart, bufEnd - buffOffset, offset.start - buffOffset, offset.end - buffOffset);
        buffOffset += (offset.end - offset.start);

      });

      return buffer;
    };

    var onData = function(buffer) {

      bufStart = byteOffset;
      bufEnd = byteOffset + buffer.length;

      byteOffset += buffer.length;

      buffer = _getCutBuffer(buffer, bufStart, bufEnd);

      if (buffer)
        this.queue(buffer);
    };

    source.on('close', function() {

      _unlink(filename, callback);

    });

    source.
    pipe(new through(onData)).
    pipe(destination);
  }

  function remove(filename, offset, lengthToRemove, callback) {

    if (!fs.existsSync(filename)) {

      console.error(filename + " doesn't exist :(");

      process.nextTick(function() {
        callback(filename + " doesn't exist :(");
      });

      return;
    }

    var source = fs.createReadStream(filename);

    var destination = fs.createWriteStream(filename + ".tmp");

    var byteOffset = 0,
      start, end,
      toRemoveStart = offset,
      toRemoveEnd = offset + lengthToRemove;

    var onData = function(buffer) {

      start = byteOffset;

      end = byteOffset + buffer.length;

      byteOffset += buffer.length;

      var resultBuff = _getFilteredBuff(buffer, start, end, toRemoveStart, toRemoveEnd);

      if (resultBuff)
        this.queue(resultBuff);
    };

    source.on('close', function() {

      _unlink(filename, callback);

    });

    source.
    pipe(new through(onData)).
    pipe(destination);
  };

  return {
    remove: remove,
    removeAll: removeAll
  };
};

module.exports = randomAccessRemove;
