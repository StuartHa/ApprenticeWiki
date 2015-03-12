'use strict';

var _ = require('underscore'),
    mongoose = require('mongoose')

module.exports = function(app) {
    var fieldValidation = require('../schema/Post').fieldValidation

    var isObjectId = function(str) {
        var regex = /^[0-9a-fA-f]{24}$/
        return regex.test(str)
    }

    app.post('/posts', function(req, res) {
        var err = fieldValidation(req.query)

        if (err) {
            res.status(400)
                .send(err)
            return
        }

        var post = new app.db.models.Post({
            title: req.query.title,
            body: req.query.body
        })

        post.save(function(err) {
            if (err) {
                res.status(500)
                    .send('database error')
            } else {
                res.send('success')
            }
        })
    })

    app.get('/posts', function(req, res) {
        app.db.models.Post.find(function(err, posts) {
            if (err) {
                res.status(500)
                    .send('database error')
            } else {
                var cleanedPosts = _.map(posts, function(post) {
                    return post.fields()
                })
                res.type('application/json')
                    .send(cleanedPosts)
            }
        })
    })

    app.get('/posts/:postId', function(req, res) {
        if (!isObjectId(req.params.postId)) {
            res.status(400)
                .send('Invalid id, must be hex string of length 24')
            return
        }
        app.db.models.Post.findOne({ _id: new mongoose.Types.ObjectId(req.params.postId) }, function(err, post) {
            if (err) {
                res.status(500)
                    .send('database error')
            } else {
                if (!post) {
                    res.status(400)
                            .send('No post found with given id')
                } else {
                    var cleanedPost = post.fields()
                    res.type('application/json')
                        .send(cleanedPost)
                }
            }
        })
    })
}