'use strict'

module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            options: {},
            files: '**/*.less',
            tasks: []
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask('default', ['watch'])
}