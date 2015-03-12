'use strict'

var should = require('should'),
    app = require('../app'),
    request = require('supertest')

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