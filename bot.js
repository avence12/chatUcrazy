use 'strict'
const config = require('./config')
const restify = require('restify')
const builder = require('botbuilder')

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: config.msbot.appId, appSecret: config.msbot.appSecret })
bot.add('/', function (session) {
  session.send('Hello World')
})

// Setup Restify Server
var server = restify.createServer()
server.post('/api/messages', bot.verifyBotFramework(), bot.listen())
server.listen(process.env.port || 8080, function () {
  console.log('%s listening to %s', server.name, server.url)
})
