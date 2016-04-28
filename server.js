'use strict'
const express = require('express')
const https = require('https')
const request = require('request')
const bodyParser = require('body-parser')
const fs = require('fs')
// global configuration
const config = require('./config')

var httpsOptions = {
  key: fs.readFileSync(config.sslKeyFile),
  cert: fs.readFileSync(config.sslCertFile)
}

var app = express()

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Create server by HTTPS
https.createServer(httpsOptions, app).listen(config.port, function () {
  console.log('Secured API server listening on port ' + config.port)
})

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

var genericTmpl = {
  'attachment': {
    'type': 'template',
    'payload': {
      'template_type': 'generic',
      'elements': [{
        'title': 'First card',
        'subtitle': 'Element #1 of an hscroll',
        'image_url': 'http://messengerdemo.parseapp.com/img/rift.png',
        'buttons': [{
          'type': 'web_url',
          'url': 'https://www.messenger.com',
          'title': 'web url'
        }, {
          'type': 'postback',
          'title': 'Postback',
          'payload': 'Payload for first element in a generic bubble'
        }]
      }, {
        'title': 'Second card',
        'subtitle': 'Element #2 of an hscroll',
        'image_url': 'http://messengerdemo.parseapp.com/img/gearvr.png',
        'buttons': [{
          'type': 'postback',
          'title': 'Postback',
          'payload': 'Payload for second element in a generic bubble'
        }]
      }]
    }
  }
}

// [Start of API Route]=============================================================================
var router = express.Router() // get an instance of the express Router
router.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === config.fb.webhookToken) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

router.post('/webhook/', function (req, res) {
  var messaging_events = null
  if (undefined !== req.body.entry[0].messaging) {
    messaging_events = req.body.entry[0].messaging
  } else {
    res.send('entry is empty')
  }
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      console.log('sender: ' + sender + ' text: ' + text)
      if (text === 'Generic') {
        sendGenericMessage(sender, genericTmpl)
      }
      // Handle a text message from this sender
      sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200))
    }
    continue // important! it prevents from processing the same message repeatedly
  }
  res.send(JSON.stringify({
    status: 'ok'
  }))
})

router.get('/msbot/', function (req, res) {
  res.send('Microsoft BOT!!!')
})

// all of our routes will be prefixed with appName
app.use('/' + config.fb.appName, router)

// [End of API Route]=============================================================================

function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: config.fb.msgUrl,
    qs: {
      access_token: config.fb.pageToken
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function sendGenericMessage (sender, payload, cb) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: config.fb.pageToken
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: payload
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
      return cb(error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
      return cb(response.body.error)
    }
    cb(null, body)
  })
}
