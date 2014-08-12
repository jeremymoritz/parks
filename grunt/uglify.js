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
				"<%= distPath %>/edgeui.min.js": [
					"lib/jquery/dist/jquery.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/affix.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/alert.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/button.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/carousel.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/collapse.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/popover.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/tab.js",
					"lib/bootstrap-sass/assets/javascripts/bootstrap/transition.js",
					"lib/media-match/media.match.min.js",
					"lib/select2/select2.js",
					"src/**/*.js",
					"!src/components/components-template/**",
					"!src/components/*/tests.js"
				]
			}
		},
		ie8js: {
			files: {
				"<%= distPath %>/ie8includes.min.js": [
					"lib/html5shiv/dist/html5shiv.js",
					"lib/respond/dest/respond.min.js"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
};