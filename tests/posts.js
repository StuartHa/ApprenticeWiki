'use strict'

var should = require('should')

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