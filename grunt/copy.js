module.exports = function(grunt) {

	grunt.config("copy", {
		dev: {
			files: [
				// copy all images / svgs
				{
					expand: true,
					cwd: "src/",
					src: ["**/*.html"],
					dest: "<%= distRoot %>"
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: "lib/fontawesome/fonts/",
					src: ["**"],
					dest: "<%= distRoot %>/fonts/"
				}
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");

};