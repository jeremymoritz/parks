module.exports = function(grunt) {
	
	grunt.config('bump', {
		options: {
     		files: [
     			'package.json',
     			'bower.json'
     		],
     		commit: false,
     		push: false,
     		createTag: false
     	}
	});

	grunt.loadNpmTasks('grunt-bump');
};