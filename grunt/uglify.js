/**
 * concat and minify scripts
 */
module.exports = function(grunt) {
	grunt.config.set("uglify", {
		prod: {
			options: {
				banner: "<%= banner %>",
			},
			files: {
				"<%= distPath %>/parks.min.js": "<%= distPath %>/parks.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
};