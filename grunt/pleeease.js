module.exports = function(grunt) {

	grunt.config('pleeease', {
		dev: {
			options: {
				optimizers: {
					minifier: false
				}
			},
			files: {
				'<%= distPath %>parks.css': '<%= distPath %>parks.css'
			}
		},
		prod: {
			options: {
				optimizers: {
					minifier: true
				}
			},
			files: {
				'<%= distPath %>parks.css': '<%= distPath %>parks.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-pleeease');
};
