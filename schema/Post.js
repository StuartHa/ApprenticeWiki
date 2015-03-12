'use strict'

var mongoose = require('mongoose'),
    util = require('./util')
var Schema = mongoose.Schema;

var fields = {
    title: {type: String, required: true},
    body: {type: String, required: true},
    timestamp: {type: Date, default: function() { return new Date() }}
}

exports.fieldValidation = util.fieldValidation(fields)

exports.init = function(app) {
    var postSchema = new Schema(fields)

    app.db.model('Post', postSchema)
}
