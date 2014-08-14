/**
 * concatenate scripts together for dev
 */
module.exports = function(grunt) {
	grunt.config.set("concat", {
		js: {
			options: {
				stripBanners: true,
				banner: "<%= banner %>",
			},
			files: {
				"<%= distPath %>lib.js": [
					"lib/jquery/dist/jquery.js",
					"lib/bootstrap/dist/js/bootstrap.js",
					"lib/lodash/dist/lodash.js"
				],
				"<%= distPath %>parks.js": [
					"src/*.js"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
};