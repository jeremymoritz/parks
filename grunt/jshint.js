module.exports = function(grunt) {

	grunt.config('jshint', {
		options: {
			reporter: require('jshint-stylish'),
			jshintrc: '.jshintrc'
		},
		all: [
			'src/**/*.js', 
			'grunt/**/*.js'
		]
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

};