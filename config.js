var config = {}
config.fb = {}
config.stock = {}
config.msbot = {}

// server
config.port = process.env.PORT || 8080
config.sslKeyFile = '/etc/letsencrypt/live/lightblue.asia/privkey.pem'
config.sslCertFile = '/etc/letsencrypt/live/lightblue.asia/fullchain.pem'

// facebook
config.fb.appName = 'chatUcrazy'
config.fb.webhookToken = 'bfa7ec01d68c19d4b1fc96c9975d614d'
config.fb.pageToken = 'CAAODaRtkEagBAONZARZBMZCJM1oZAionZBBKBzJTySZBzjQyFZCGFOxuTZA5ErUWk6l0HteFWDfxHstMG2o30yS9U6wMtDOisbucC1E1J1utb5y9qTw0TcK4QrdVnWKPZCySc8MJTss2bfUagnFAjim8ZBhVGcWemKaiZAiekUVsSutcZCzunIl26a4yhwjZB0UkWCcE7E5DqozvqmwZDZD'
config.fb.graphUrl = 'https://graph.facebook.com/v2.6/'
config.fb.msgUrl = config.fb.graphUrl + 'me/messages/'

// stock
config.stock.googleFinanceApi = 'https://www.google.com/finance/info'
config.stock.yahooFinanceGraph = 'https://chart.finance.yahoo.com/t?lang=en-US&region=US&width=240&height=144&s='
config.stock.yahooFinanceApi = 'https://finance.yahoo.com/q?s='

// microsoft bot platform
config.msbot.appId = 'chatUcrazy'
config.msbot.appSecret = 'b66786bfe96547c78777806ea6cfbf12'
config.msbot.luisModelUrl = 'https://api.projectoxford.ai/luis/v1/application?id=0d0f2e7b-9336-4bab-a25a-810fb843bda6&subscription-key=a8abb1dd414d489898ec41e743647220&q='

module.exports = config
