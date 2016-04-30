'use strict'

var Handler = new Object();

Handler.getProfile = function (id, cb) {
  if (!cb) cb = Function.prototype

  request({
    method: 'GET',
    uri: 'https://graph.facebook.com/v2.6/'+id,
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

Handler.getStock = function (stockIds) {

}

Handler.getBouBou = function (text) {
  text = '寶寶~'
  return text
}

module.exports = Handler
