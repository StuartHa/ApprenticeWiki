'use strict';

module.exports = function(app) {
    var fieldValidation = require('../schema/Post').fieldValidation

    app.post('/posts', function(req, res) {
        var err = fieldValidation(req.query)

        if (err) {
            res.status(400)
            res.send(err)
            return
        }

        var post = new app.db.models.Post({
            title: req.query.title,
            body: req.query.body
        })

        post.save(function(err) {
            if (err) {
                res.status(500)
                res.send('database error')
            } else {
                res.send('success')
            }
        })
    })
}