module.exports = function(grunt) {

	grunt.config("copy", {
		dev: {
			files: [
				// copy all images / svgs
				{
					expand: true,
					cwd: "src/",
					src: ["**"],
					dest: "<%= distPath %>/"
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: "lib/fontawesome/fonts/",
					src: ["**"],
					dest: "<%= distPath %>/fonts/"
				}
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");

};