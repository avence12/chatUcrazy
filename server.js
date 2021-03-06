'use strict'
const express = require('express')
const https = require('https')
const request = require('request')
const bodyParser = require('body-parser')
const fs = require('fs')
// global configuration
const config = require('./config')
const msgHandler = require('./handler')

var httpsOptions = {
  key: fs.readFileSync(config.sslKeyFile),
  cert: fs.readFileSync(config.sslCertFile)
}

var app = express()

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
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

// [Start of API Route]=============================================================================
var router = express.Router() // get an instance of the express Router
router.get('/webhook/', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.fb.webhookToken) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

router.post('/webhook/', function (req, res) {
  const messagingEvents = getFirstMessagingEntry(req.body)
  if (messagingEvents === null) {
    res.send('entry is empty')
  }
  for (var i = 0; i < messagingEvents.length; i++) {
    const event = messagingEvents[i]
    const sender = event.sender.id
    if (event.message && event.message.text) {
      const text = event.message.text
      console.log('sender: ' + sender + ' text: ' + text)
      if (text.substring(0, 5).toLowerCase() === 'stock') {
       // sendMessage(sender, msgHandler.getStock(text.substring(6)))
        msgHandler.getStock(sender, text.substring(6), sendMessage)
      } else {
        msgHandler.getBouBou(sender, text, sendMessage)
      }
    }
  }
  res.sendStatus(200)
})

// all of our routes will be prefixed with appName
app.use('/' + config.fb.appName, router)

// [End of API Route]=============================================================================

// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
function getFirstMessagingEntry (body) {
  var val = null
  if (body.object === 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging) {
    val = body.entry[0].messaging
  }
  return val
}

function sendMessage (sender, payload, cb) {
  if (!cb) cb = Function.prototype
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
      message: payload
    }
  }, function (error, res, body) {
    if (error) {
      console.log('Error sending messages: ', error)
      return cb(error)
    }
    if (res.body.error) {
      console.log('Error: ', res.body.error)
      return cb(res.body.error)
    }
  })
}
