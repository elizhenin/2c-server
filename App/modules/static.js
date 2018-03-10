module.exports = function(Environment) {
        var path = require('path');

        Environment.app
        .get("/static",
             function(req, res) {
            res.send("<script>location='/';</script>"); //just redirect
        });
      /* serves all the static files */
      Environment.app
      .get(/^\/static\/(.+)$/,
       function(req, res) {

    res.sendFile(path.join(Environment.APPDIR, 'static', req.params[0]));

});
};