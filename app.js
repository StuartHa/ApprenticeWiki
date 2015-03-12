'use strict'

var express = require('express'),
    config = require('./config'),
    mongoose = require('mongoose'),
    serveStatic = require('serve-static')

var app = express()

app.db = mongoose.createConnection(config.MONGO_URI)

app.use(serveStatic('public/'))

app.get('/', function(req, res) {
    res.render('index.jade')
})

require('./schema/Post').init(app)
require('./api/posts')(app)

app.listen(3000)

module.exports = app