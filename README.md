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

The format of this module is a copy of the awesome module [random-access-file](https://github.com/mafintosh/random-access-file) by [mafintosh](https://github.com/mafintosh).  This module is not affiliated with that module and was written to follow the already created format of random-access-file.

## License

MIT
