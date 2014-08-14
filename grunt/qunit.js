/**
 * Runs the unit tests on all the components.
 */
module.exports = function(grunt){
	grunt.config.set('qunit', {
		all: ['<%= distRoot %>/tests.html']
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
};
