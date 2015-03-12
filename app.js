'use strict'

var express = require('express'),
    config = require('./config'),
    mongoose = require('mongoose')

var app = express()

app.db = mongoose.createConnection(config.MONGO_URI)

app.get('/', function(req, res) {
    res.send('thanks')
})

require('./schema/Post').init(app)
require('./api/posts')(app)

app.listen(3000)

module.exports = app