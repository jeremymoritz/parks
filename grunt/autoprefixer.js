/**
* Parses CSS files and adds vendor prefixes to CSS rules using the "Can I use" database to determine accurate prefixes
*  Adds prefixes so that code is compatible on (latest 2 versions) of all browsers
*/

module.exports = function (grunt) {

    grunt.config("autoprefixer", {
        dev: {
            src: "<%= distPath %>/edgeui.css",
            dest: "<%= distPath %>/edgeui.css"
        },
        prod: {
            src: "<%= distPath %>/edgeui.min.css",
            dest: "<%= distPath %>/edgeui.min.css"
        }
    });
    grunt.loadNpmTasks("grunt-autoprefixer");
};