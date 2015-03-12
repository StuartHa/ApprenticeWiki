'use strict'

var should = require('should'),
    app = require('../app'),
    request = require('supertest'),
    async = require('async'),
    mongoose = require('mongoose')

describe('posts', function() {

    beforeEach(function(done) {
        app.db.models.Post.remove(done)
    })

    describe('create', function () {
        it('should reject a request with missing query params', function(done) {
            request(app)
                .post('/posts?title=Donnie%20Darko')
                .expect(400, done)
        })

        it('should reject a request with empty title', function(done) {
            request(app)
                .post('/posts?title=&body=Hi%20there')
                .expect(400, done)
        })

        it('should create a database entry on valid request', function(done) {
            request(app)
                .post('/posts?title=Hello&body=JustATest')
                .expect(200)
                .end(function() {
                    app.db.models.Post.find(function(err, posts) {
                        posts.length.should.equal(1)
                        var createdPost = posts[0]
                        createdPost.title.should.equal('Hello')
                        createdPost.body.should.equal('JustATest')
                        createdPost.timestamp.should.be.ok
                        done()
                    })
                })
        })
    })

    describe('get', function () {
        it('should fail when given an invalid id', function (done) {
            request(app)
                .get('/posts/12345')
                .expect(400)
                .end(function(err, res) {
                    res.text.should.equal('Invalid id, must be hex string of length 24')
                    done()
                })
        })

        it('should fail when given a valid id that doesn\'t exist', function (done) {
            request(app)
                .get('/posts/15012b0818d0a4d628562003')
                .expect(400)
                .end(function(err, res) {
                    res.text.should.equal('No post found with given id')
                    done()
                })
        })

        it('should return post with given id', function (done) {
            var _id = '55012b0818d0a4d628562003'
            async.series([
                function(cb) {
                    var post = new app.db.models.Post({
                        _id: new mongoose.Types.ObjectId(_id),
                        title: 'ATitle',
                        body: 'ABody'
                    })
                    post.save(cb)
                },
                function(cb) {
                    request(app)
                        .get('/posts/' + _id)
                        .expect(200)
                        .end(function(err, res) {
                            var post = JSON.parse(res.text)
                            post.title.should.equal('ATitle')
                            post.body.should.equal('ABody')
                            post.timestamp.should.be.ok
                            post._id.should.equal(_id)
                            done()
                        })
                }
            ])


        })
    })

    describe('getAll', function () {
        it('should return an empty array when database is empty', function (done) {
            request(app)
                .get('/posts')
                .expect(200)
                .end(function(err, res) {
                    res.text.should.equal('[]')
                    done()
                })
        })

        it('should return an item when database has items', function (done) {
            async.series([
                function(cb) {
                    var post = new app.db.models.Post({
                        title: 'ATitle',
                        body: 'ABody'
                    })
                    post.save(cb)
                },
                function(cb) {
                    request(app)
                        .get('/posts')
                        .expect(200)
                        .end(function(err, res) {
                            var jsonRes = JSON.parse(res.text)
                            var post = jsonRes[0]
                            post.title.should.equal('ATitle')
                            post.body.should.equal('ABody')
                            post.timestamp.should.be.ok
                            post._id.should.be.ok
                            done()
                        })
                }
            ])


        })
    })
})

describe('schema/util', function() {
    describe('fieldValidation', function () {
        var fieldValidation = require('../schema/util').fieldValidation
        var fields = {
            title: {type: String, required: true, validate: function(str) {
                return str !== ''
            }},
            body: {type: String, required: true},
            timestamp: {
                type: Date, default: function () {
                    return new Date()
                }
            }
        }
        var validate = fieldValidation(fields)

        it('should detect when a field is missing', function () {
            validate({title: 'Living Long and Prospering'}).should.equal('Missing required field body:')
            validate({body: 'Hello world'}).should.equal('Missing required field title:')
            validate({footnote: 'Copyright 2015'}).should.equal('Missing required field title:Missing required field body:')
            validate({}).should.equal('Missing required field title:Missing required field body:')
        })

        it('should return falsy when everything passes', function () {
            validate({title: 'Living Long and Prospering', body: 'Just a test'}).should.not.be.ok
        })

        it('should detect when validate function fails', function () {
            validate({title: '', body: 'Just a test'}).should.equal('Validation failed for field title:')
        })
    })
})