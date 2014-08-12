module.exports = function(grunt) {
	grunt.config.set("watch", {
		js: {
			files: [
				"src/**/*.js"
			],
			tasks: [
				"jshint",
				"concat:js",
				"concat:tests"
			]
		},
		css: {
			files: [
				"src/**/*.scss"
			],
			tasks: [
				"sass:dev"
			]
		},
		imgsvg: {
			files: [
				"src/**/*.svg",
				"src/**/*.png"
			],
			tasks: [
				"copy:dev"
			]
		},
		fonts: {
			files: [
				"lib/bootstrap-sass/vendor/assets/fonts/bootstrap/**"
			],
			tasks: [
				"copy:dev"
			]
		},
		qunit: {
			files: [
				"src/**/*.js",
				"src/**/*.html"
			],
			tasks: [
				"replace:dev",
				"qunit"
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
};