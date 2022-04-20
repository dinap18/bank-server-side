elogger
=======
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Exclusive logging for nodejs, expressjs, sailsjs, restify, meanjs and many other nodejs based applications.


<h4>Introduction</h4>
elogger is an exclusive logging middleware framework for different kind of nodejs application, which can be used either as an middleware or simple module. It reuses power & flexibility of morgan (https://www.npmjs.com/package/morgan) for HTTP logging. Find different examples below.

### Installation:
Installing elogger is very simple and one step process. You just need to go inside you nodejs application and run following command.
```
$ npm install elogger
```

### Usage 01: As Middleware with ExpressJS
```
const loggingtype = 'combined';
const express = require('express'),
      elogger = require('elogger');

app.use(elogger(loggingtype));
```

**Supported logging types:**
As elogger uses morgan as it's backbone so all logging type supported by "morgan" is supported here as well by default.
- *null*
- *combined*
- *common*
- *tiny*

Besides those it supports custom formatted string of pre-defined tokens. e.g.
- *:method :url :status :res[content-length] - :response-time ms*


### Usage 02: For NodeJS command-line applications:
elogger provides few abstract methods for different logging levels to make logging easier and color coded in the terminal as mentioned below:

```
const logger = require('elogger');

logger.debug('My First Debug Test');
logger.info('My Second Info Test');
logger.warn('My Third Warn Test');
logger.error('My Fourth Error Test');
logger.trace('My Fifth Trace Test');
```

---
> For more detailed documentation you may refer to official [documentation](https://expressjs.com/en/resources/middleware/morgan.html) of morgan.
