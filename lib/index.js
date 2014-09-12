var uglify = require('uglify-js');
var browserify = require('browserify');

module.exports = function (srcFile, options, callback) {
  var b = browserify([srcFile], options);
  b.bundle(function (err, content) {
    if (err) { return callback(err); }
    if (options.uglify) {
      var topLevel = uglify.parse(content.toString(), {
        strict: false,
        filename: srcFile
      });
      topLevel.figure_out_scope();
      var compressor = uglify.Compressor();
      var compressed = topLevel.transform(compressor);
      compressed.figure_out_scope();
      compressed.compute_char_frequency();
      compressed.mangle_names();
      content = compressed.print_to_string();
    }
    return callback(null, content.toString());
  });
};