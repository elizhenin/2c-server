module.exports = function(Environment) {
        var fs = require('fs'); // this engine requires the fs module
        Environment.app.engine('php', function (filePath, options, callback) { // define the template engine
          fs.readFile(filePath, function (err, content) {
            if (err) return callback(new Error(err));
            // this is an extremely simple template engine
            var rendered = content.toString()
            .replace('<?=$title?>', ''+ options.title +'')
            .replace('<?=$height?>', ''+ options.height +'')
            .replace('<?=$width?>', ''+ options.width +'')
            .replace('<?=$body?>', ''+ options.body +'');
            return callback(null, rendered);
          });
        });
        Environment.app.set('views', Environment.APPDIR + 'views/'); // specify the views directory
        Environment.app.set('view engine', 'php'); // register the template engine
};

