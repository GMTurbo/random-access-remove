# random-access-remove

remove random chunks of a file given an offset and length

	npm install random-access-remove

## Why?

If you need to remove certain chunks of a file without wanting to do a full copy, this module is for you!

## It is easy to use

``` js

var randomAccessFile = require('random-access-remove');

var rar = new randomAccessRemove();

//remove a single piece
rar.remove('test.txt', 0, 1024, function(err) {
  if (err)
    console.error(err);
});

// or remove in bulk
var file = 'test2.txt';
var kb = 1024;
var size = fs.statSync(file).size;

var exclude = [
	[0, kb],
	[2 * kb + 1, kb],
	[4 * kb + 1, kb],
	[size - kb, kb]
];

rar.removeAll(file, exclude, function(err) {
	if (err)
		console.error(err);
});

```
## Inspiration

The format of this module is a copy of the awesome module [random-access-file](https://github.com/mafintosh/random-access-file) by [mafintosh](https://github.com/mafintosh).  This module is not affiliated with that module and was written to follow the format outlined in random-access because it makes sense.

## Implementation

Under the hood, this module does the following:
- *creates a readstream of the file arg*
- *creates a tmp output file (file + '.tmp')*
- *intercepts the piped data and excludes the data within the range/ranges passed to it*
- *deletes the original file arg*
- *renames the .tmp file to the original file name*

## License

MIT
