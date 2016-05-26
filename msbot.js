'use strict'
const config = require('./config')
const restify = require('restify')
const builder = require('botbuilder')

// microsoft Cortana models
// var model = config.msbot.luisModelUrl;
var model = config.msbot.luisAssistV2

var dialog = new builder.LuisDialog(model)

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: config.msbot.appId, appSecret: config.msbot.appSecret })
/*
bot.add('/', function (session) {
  session.send('Hello World???')
})
*/
bot.add('/', dialog)

// Add intent handlers
dialog.on('builtin.intent.alarm.set_alarm', builder.DialogAction.send('Creating Alarm'))
dialog.on('builtin.intent.alarm.delete_alarm', builder.DialogAction.send('Deleting Alarm'))
dialog.onDefault(builder.DialogAction.send('I\'m sorry I didn\'t understand. I can only create & delete alarms.'))

// Setup Restify Server
var server = restify.createServer()
server.post('/msbot/messages', bot.verifyBotFramework(), bot.listen())
server.listen(process.env.port || 10978, function () {
  console.log('%s listening to %s', server.name, server.url)
})
