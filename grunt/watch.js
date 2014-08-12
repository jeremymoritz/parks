module.exports = function(grunt) {
	grunt.config.set("watch", {
		js: {
			files: [
				"src/**/*.js"
			],
			tasks: [
				"jshint",
				"concat"
			]
		},
		css: {
			files: [
				"src/**/*.less"
			],
			tasks: [
				"less:dev"
			]
		},
		qunit: {
			files: [
				"src/**/*.js",
				"src/**/*.html"
			],
			tasks: [
				"qunit"
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
};