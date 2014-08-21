module.exports = function(grunt) {

	grunt.config('copy', {
		dev: {
			files: [
				// copy all html pages
				{
					expand: true,
					cwd: 'src/',
					src: ['**/*.html'],
					dest: '<%= distRoot %>'
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: 'lib/fontawesome/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy Angular for head
				{
					src: 'lib/angular/angular.js',
					dest: '<%= distPath %>angular.js'
				},

				// copy all img files too
				{
					expand: true,
					cwd: 'src/',
					src: ['*.png'],
					dest: '<%= distRoot %>/_inc/'
				}
			]
		},
		tests: {
			files: [

				// Create tests
				{
					src: '<%= distRoot %>/tests/tests.html',
					dest: '<%= distRoot %>/tests.html'
				},

				// Create tests
				{
					src: 'src/tests/tests.js',
					dest: '<%= distPath %>tests.js'
				}
			]
		},
		prod: {
			files: [
				// copy all images / svgs
				{
					expand: true,
					cwd: 'src/',
					src: ['*.html'],
					dest: '<%= distRoot %>'
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: 'lib/fontawesome/fonts/',
					src: ['**'],
					dest: '<%= distRoot %>/fonts/'
				},

				// copy Angular for head
				{
					src: 'lib/angular/angular.min.js',
					dest: '<%= distPath %>angular.js'
				},

				// copy all img files too
				{
					expand: true,
					cwd: 'src/',
					src: ['*.png'],
					dest: '<%= distRoot %>/_inc/'
				}
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');

};
