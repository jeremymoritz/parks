/**
 * concatenate scripts together for dev
 */
module.exports = function(grunt) {
	grunt.config.set("concat", {
		dev: {
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
		},
		prod: {
			options: {
				stripBanners: true,
				banner: "<%= banner %>"
			},
			files: {
				"<%= distPath %>parks.js": [
					"lib/jquery/dist/jquery.js",
					"lib/bootstrap/dist/js/bootstrap.js",
					"lib/lodash/dist/lodash.js",
					"!src/tests/*",
					"src/**/*.js"
				],
				"<%= distPath %>parks.css": "<%= distPath %>parks.css"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
};