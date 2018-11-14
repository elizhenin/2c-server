module.exports = function(Environment) {
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    Environment.app.use(cookieParser());
    Environment.app.use(session({
        secret: "16846f5j4f6j468f1fd6h4f68h4fdh685d4681fh68fd74h",
        resave: true,
        saveUninitialized: true
    }));
    Environment.app.use(bodyParser.json({
        limit: Environment.upload_limit
    })); // to support JSON-encoded bodies
    Environment.app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true,
        limit: Environment.upload_limit
    }));
};