module.exports = function(Environment) {
        var path = require('path');
 /* serves main page */
 Environment.app.get("/", function(req, res) {
    if (req.session.login) {
        //auth ok
        res.send("<script>location='/workspace';</script>"); //just redirect
    } else {
        res.send("<script>location='/users/login';</script>"); //just redirect
     
    }
});
    };
