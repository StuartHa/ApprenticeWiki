'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var postSchema = new Schema({
        title: String,
        body: String,
        timestamp: Date
    })

    mongoose.model('Post', postSchema)
}
