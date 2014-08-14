/**
 * Make less into css file in the dist directory
 */
module.exports = function(grunt) {

	grunt.config('less', {
		dev: {
			files: {
				'<%= distPath %>parks.css': [
					'lib/bootstrap/less/bootstrap.less',
					'lib/fontawesome/less/font-awesome.less',
					'src/**/*.less'
				]
			}
		},
		prod: {
			options: {
				cleancss: true,
				compress: true
			},
			files: {
				'<%= distPath %>parks.css': [
					'lib/bootstrap/less/bootstrap.less',
					'lib/fontawesome/less/font-awesome.less',
					'src/**/*.less'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
};
