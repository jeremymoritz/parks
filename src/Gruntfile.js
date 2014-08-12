module.exports = function(grunt) {

	// load in package.json to reference any data from it (like the version number)
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
	});

	// Define other properties of the config object
	// Define the root directory for distribution
	var distRoot = "dist";
	// Derive major version from package.json version property
	var pkgObj = grunt.config.get("pkg");
	var majorVersion = pkgObj.version.substring(0, 1);
	var majorVersionStr = "v" + majorVersion;
	// Build main distribution path. NOTE: There is no slash at the end
	var distPath = distRoot + "/" + majorVersionStr;
	// Set distribution path to grunt config object
	// This should be used when defining output files
	// Access this config option using <%= distRoot %>
	grunt.config.set("distRoot", distRoot);
	// Access this config option using <%= majorVersion %>
	grunt.config.set("majorVersion", majorVersionStr);
	// Access this config option using <%= distPath %>
	grunt.config.set("distPath", distPath);

	// Typography font url (Gotham)
	var typographyFontUrl = "https://cloud.typography.com/7198092/657064/css/fonts.css";
	// Access this config option using <%= typographyFontUrl %>
	grunt.config.set("typographyFontUrl", typographyFontUrl);

	// Define banner for edgeui css and js files
	var banner = "/*!\n" +
          " * <%= pkg.description %> - v<%= pkg.version %> \n" +
          " * Build Date: <%= grunt.template.today('yyyy.mm.dd') %> \n" +
          " * Docs: <%= pkg.homepage %> \n" +
          " * Coded @ <%= pkg.author %> \n" +
          " */ \n \n";
  // Access this config option using <%= banner %>
	grunt.config.set("banner", banner);

	// Load Grunt plugins from the config files in the grunt/ directory
	grunt.loadTasks("grunt");

	// Register task for developing locally
	// Runs all of the dev task plus runs watch
	// Note this should not be used in Bamboo
	grunt.registerTask("dev-local", [
		"dev",
		"watch"
	]);

	// Register task for generating unminified output files
	// This is safe to run on bamboo
	// Note: all subtasks of the sass and autoprefixer tasks will run. This will generate a minified and unminified version of the css.
	// If you run this task all of the example html files and generated documentation will reference the unminified version of Edge UI's css and js
	grunt.registerTask("dev", [
		"clean:dist",
		"jshint",
		"copy:select2",
		"sass",
		"autoprefixer",
		"concat:js",
		"concat:ie8js",
		"uglify:prod",
		"uglify:ie8js",
		"concat:tests",
		"copy:imagesfonts",
		"replace:dev",
		"qunit"
	]);

	// Register task for generating minified (Prod ready) output files
	// Note: Removed svg2png plugin because of issues with bamboo
	// Note: all subtasks of the sass and autoprefixer tasks will run. This will generate a minified and unminified version of the css.
	// If you run this task all of the example html files and generated documentation will reference the minified version of Edge UI's css and js
	grunt.registerTask("prod", [
		"clean:dist",
		"jshint",
		"copy:select2",
		"sass",
		"autoprefixer",
		"concat:js",
		"concat:ie8js",
		"uglify:prod",
		"uglify:ie8js",
		"concat:tests",
		"modernizr",
		"copy:imagesfonts",
		"replace:prod",
		"qunit"
	]);

	// default is just dev
	grunt.registerTask("default", [
		"dev"
	]);

};