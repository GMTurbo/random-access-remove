var fs = require('fs'),
  util = require('util'),
  through = require('through');


var randomAccessRemove = function(options) {

  options = options || {
    chunkSize: 1024
  }

  if (!(this instanceof randomAccessRemove))
    return new randomAccessRemove(options);

  function remove(filename, offset, lengthToRemove, callback) {
    debugger;

    if (!fs.existsSync(filename)) {
      console.error(filename + " doesn't exist :(");
      process.nextTick(function() {
        callback({
          message: filename + " doesn't exist :("
        })
      })
      return;
    }

    var source = fs.createReadStream(filename);

    var destination = fs.createWriteStream(filename + ".tmp");

    var byteOffset = 0,
      allow = true,
      diff = 0,
      start, end;
    toRemoveStart = offset,
      toRemoveEnd = offset + lengthToRemove;

    var onData = function(buffer) {

      start = byteOffset;

      end = byteOffset + buffer.length;

      byteOffset += buffer.length;

      //all clear
      if (start > toRemoveEnd || end < toRemoveStart) {
        this.queue(buffer);

        return;
      }

      //start outside and end within removal range
      if (start <= toRemoveStart && end <= toRemoveEnd) {
        //remove the file contents within removal range
        var slicedBuf = buffer.slice(0, (end - offset));
        this.queue(slicedBuf);
      }
      //start within removal range and end within it
      else if (start >= toRemoveStart && end <= toRemoveEnd) {
        //don't add any contents to the output file
      }
      //start within removal range and end out of it
      else if (start >= toRemoveStart && end >= toRemoveEnd) {
        var slicedBuf = buffer.slice((toRemoveEnd - start), buffer.length);
        this.queue(slicedBuf);

        //we have stepped over the removal range and have to
        // do a splice and concat
      } else if (start <= toRemoveStart && end >= toRemoveEnd) {
        var slicedBuf1 = buffer.slice(0, toRemoveStart);
        var slicedBuf2 = buffer.slice(toRemoveEnd, buffer.length);

        this.queue(Buffer.concat([slicedBuf1, slicedBuf2]));
      }
    };

    source.on('close', function() {

      fs.unlink(filename, function(err) {
        if (err)
          throw err;
        fs.renameSync(filename + ".tmp", filename);
        process.nextTick(callback);
      });

    });

    source.
    pipe(new through(onData)).
    pipe(destination);
  };

  return {
    remove: remove
  };
};

module.exports = randomAccessRemove;
