# random-access-remove

remove random chunks of a file given an offset and length

	npm install random-access-remove

## Why?

If you need to remove certain chunks of a file without wanting to do a full copy, this module is for you!

## It is easy to use

``` js

var randomAccessFile = require('random-access-remove');

var rar = new randomAccessRemove();

rar.remove('test.txt', 0, 1024, function(err) {
  if (err)
    console.error(err);
});

```
## Inspiration

The format of this module is a copy of the awesome module [random-access-file](https://github.com/mafintosh/random-access-file) by [mafintosh](https://github.com/mafintosh).  This module is not affiliated with that module and was written to follow the format outlined in random-access because it makes sense.

##Implementation

Under the hood, this module does the following:
1. creates a readstream of the file arg
2. creates a tmp output file (file + '.tmp')
3. intercepts the piped data and excludes the data within the range passed to it
4. deletes the original file arg
5. renames the .tmp file to the original file name

## License

MIT
