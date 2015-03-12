'use strict'

var express = require('express'),
    config = require('./config'),
    mongoose = require('mongoose')

var app = express()

app.db = mongoose.createConnection(config.MONGO_URI)

app.get('/', function(req, res) {
    res.send('thanks')
})

require('./schema/Post')()

app.listen(3000)