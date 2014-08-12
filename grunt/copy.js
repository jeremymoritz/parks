module.exports = function(grunt) {

	grunt.config("copy", {
		imagesfonts: {
			files: [
				// copy all images / svgs
				{
					expand: true,
					cwd: "src/img/",
					src: ["**"],
					dest: "<%= distPath %>/"
				},

				// copy all fonts
				{
					expand: true,
					cwd: "lib/bootstrap-sass/assets/fonts/bootstrap/",
					src: ["**"],
					dest: "<%= distPath %>/bootstrap/"
				},

				// copy all fontawesome fonts
				{
					expand: true,
					cwd: "lib/fontawesome/fonts/",
					src: ["**"],
					dest: "<%= distPath %>/fonts/"
				}
			]
		},
		select2: {
			files: [
				// copy select2 styles
				{
					src: "lib/select2/select2.css",
					dest: "lib/select2/select2.scss"
				},

				// copy select2 styles
				{
					expand: true,
					cwd: "lib/select2/",
					src: ["*.png"],
					dest: "<%= distPath %>/"
				},
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");

};