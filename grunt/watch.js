module.exports = function(grunt) {
	grunt.config.set('watch', {
		src: {
			files: [
				'src/**/*.*'
			],
			tasks: [
				'default'
			]
		}
		// js: {
		// 	files: [
		// 		'src/**/*.js'
		// 	],
		// 	tasks: [
		// 		'jshint',
		// 		'concat'
		// 	]
		// },
		// css: {
		// 	files: [
		// 		'src/**/*.less'
		// 	],
		// 	tasks: [
		// 		'less:dev'
		// 	]
		// },
		// qunit: {
		// 	files: [
		// 		'src/**/*.js',
		// 		'src/**/*.html'
		// 	],
		// 	tasks: [
		// 		'qunit',
		// 		'copy'
		// 	]
		// }
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};
