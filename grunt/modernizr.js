/**
 * grunt-modernizr sifts through your project files,
 * gathers up your references to Modernizr tests and outputs a lean, mean Modernizr machine.
 */
module.exports = function(grunt) {
	grunt.config.set("modernizr", {
		prod: {
			devFile: "lib/modernizr/modernizr.js",
			outputFile: "<%= distPath %>/modernizr-custom.min.js",
			extra : {
					shiv : true,
					printshiv : false,
					load : false,
					mq : false,
					cssclasses : true
			},
			// implicitly add tests
			tests: [],
			// only look in files in src
			files: {
				src: ["src/**/*"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-modernizr");
};