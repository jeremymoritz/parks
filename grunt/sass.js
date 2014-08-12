/**
 * compile the SASS into CSS
 */
module.exports = function(grunt) {
	grunt.config.set("sass", {
		dev: {
			options: {
				style: "expanded",
				banner: "<%= banner %>",
			},
			files: {
				"<%= distPath %>/edgeui.css": [
					"src/edgeui.scss",
					"!src/component/components-template/components-template.scss"
				]
			}
		},
		prod: {
			options: {
				style: "compressed",
				banner: "<%= banner %>",
			},
			files: {
				"<%= distPath %>/edgeui.min.css": [
					"src/edgeui.scss",
					"!src/component/components-template/components-template.scss"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-sass");
};