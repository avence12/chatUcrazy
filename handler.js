'use strict'
const config = require('./config')
const request = require('request')

var Handler = {}

Handler.getProfile = function (id, cb) {
  if (!cb) cb = Function.prototype

  request({
    method: 'GET',
    uri: config.fb.graphUrl + id,
    qs: {
      fields: 'first_name,last_name,profile_pic',
      access_token: this.token
    },
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)
    if (body.error) return cb(body.error)

    cb(null, body)
  })
}

Handler.getStock = function (sender, stockIds, cb) {
  if (!cb) cb = Function.prototype
  request({
    method: 'GET',
    uri: config.stock.googleFinanceApi,
    qs: {
      q: stockIds
    },
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)
    if (body.error) return cb(body.error)
    // response of Google Finance API start from '// '
    var stocks = JSON.parse(body.substring(3))
    var elements = []
    for (var i = 0; i < stocks.length; i++) {
      elements.push({
        'title': stocks[i].t,
        'subtitle': 'Price ' + stocks[i].l_cur + ' | chg ' + stocks[i].c + ' | chg% ' + stocks[i].cp + '%',
        'image_url': config.stock.yahooFinanceGraph + stocks[i].t,
        'buttons': [{
          'type': 'web_url',
          'url': config.stock.yahooFinanceApi + stocks[i].t,
          'title': 'To Yahoo! Finance'
        }]
      })
    }
    var genericTmpl = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': elements
        }
      }
    }
    // console.log("String: "+JSON.stringify(genericTmpl))
    return cb(sender, genericTmpl)
  })
}

Handler.getBouBou = function (sender, text, cb) {
  return cb(sender, {text: '寶寶~~'})
}

module.exports = Handler
