var rar = require('../randomAccessRemove');

function begin(oldFile, newFile) {
  // or remove in bulk

  var start = function(newFile) {
    var kb = 1024;
    var size = fs.statSync(newFile).size;
    // must be in ascending order by offset values
    //[ [offset, length], ...]
    var exclude = [
      [0, kb],
      [~~(size / 4), kb / 2],
      [~~(size / 2), kb],
      [~~(size - (size / 4)), kb / 2],
      [size - kb, kb]
    ];

    var rar = new randomAccessRemove();

    rar.removeAll(newFile, exclude, function(err) {
      if (err)
        console.error(err);
    });
  };

  var oldFileStream = fs.createReadStream(oldFile),
    newFileStream = fs.createWriteStream(newFile);

  oldFileStream.on('end', function() {
    newFileStream.end();
    start(newFile);
  });

  oldFileStream.pipe(newFileStream);
};
// var makeNumberedFile = (function(filename, count, cb) {
//
//   var fs = require('fs');
//
//   var stream = fs.createWriteStream(filename, {
//     flags: 'w'
//   });
//
//   var i = 0;
//
//   function write() {
//     if (i === count) {
//       process.nextTick(function() {
//         process.exit();
//       })
//     }; // A callback could go here to know when it's done.
//     while (stream.write((i++).toString() + '\n') && i < count);
//     stream.once('drain', write);
//   }
//   write(); // Initial call.
//
//
// })('test.txt', 10000, begin);

begin('test.txt', 'test2.txt');
