'use strict'

var mongoose = require('mongoose'),
    util = require('./util')
var Schema = mongoose.Schema;

var fields = {
    title: {
        type: String,
        required: true,
        validate: function(str) {
            return str !== ''
        }
    },
    body: {type: String, required: true},
    timestamp: {type: Date, default: function() { return new Date() }}
}

exports.fieldValidation = util.fieldValidation(fields)

exports.init = function(app) {
    var postSchema = new Schema(fields)

    postSchema.methods.fields = function() {
        return {
            _id: this._id.toString(),
            title: this.title,
            body: this.body,
            timestamp: this.timestamp
        }
    }

    app.db.model('Post', postSchema)
}
