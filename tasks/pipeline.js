/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    'styles/jquery-ui.min.css',
    'styles/iconFont.css',
    'styles/bootstrap.css',
    'styles/metro-bootstrap.css',
    'styles/codemirror.css',
    'styles/codemirror-neo.css',
    'styles/alchemy.css',
    'styles/vendor.css',
    'styles/custom.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
    'lib/socket.io.js',
    'lib/sails.io.js',
    'js/app.js',
    'lib/vendor.js',
    'lib/neo.js',
	'lib/jquery-2.1.1.min.js',
    'lib/jquery.widget.min.js',  
    'lib/jquery-ui.min.js',
    'lib/jquery-functions.js',
    'js/ui-panels.js',
    'lib/bootstrap.js',      
    'lib/ejs_production.js',
    'lib/codemirror.js',
    'lib/codemirror-cypher.js',
    'lib/alchemy.js',
    'lib/alchemyConfig.js', 
    'lib/metro.min.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});

module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});

module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
