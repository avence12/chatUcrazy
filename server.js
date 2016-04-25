var express    = require('express');        // call express
var https      = require('https');
var request    = require('request');
var bodyParser = require('body-parser');
var fs         = require('fs');
var config     = require('./config');

var httpsOptions = {
    key: fs.readFileSync(config.sslKeyFile),
    cert: fs.readFileSync(config.sslCertFile)
};

var app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = https.createServer(httpsOptions, app).listen(config.port, function(){
    console.log('Secured API server listening on port ' + config.port);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// [Start of API Route]=============================================================================
var router = express.Router();              // get an instance of the express Router
router.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === config.fb.webhookToken) {
          res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
})

router.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log('sender: ' + sender + '  text: ' + text);
      // Handle a text message from this sender
      sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

// all of our routes will be prefixed with appName
app.use('/' + config.fb.appName, router);

// [End of API Route]=============================================================================

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: config.fb.msgUrl,
    qs: {access_token:config.fb.pageToken},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

