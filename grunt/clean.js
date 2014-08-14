/**
 * Cleans the dist directory (deletes all files)
 */
module.exports = function(grunt) {

	grunt.config('clean', {
		dist: ['dist']
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
};