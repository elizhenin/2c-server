module.exports = function(Environment){
    var imaps = require('imap-simple');

        Environment.app
        .get("/users",
             function(req, res) {
            res.send("<script>location='/';</script>"); //just redirect
        });

        Environment.app
        .get("/users/login",
        function(req, res) { 
        //login form
        res.render('dialog-tpl', {
            title: 'Вход в систему',
            width: 400,
            height: 200,
            body: 'login.htm'});
        });

        Environment.app
        .post("/users/login",
         function(req, res) {
            /* imap auth */
        
            var config = {
                imap: {
                    user: req.body.login,
                    password: req.body.password,
                    host: Environment.imap_host,
                    port: 993,
                    tls: true,
                    authTimeout: 3000
                }
            };
            imaps.connect(config, function(err, connection) {
        
                if (JSON.stringify(err) == 'null') {
                    req.session.login = req.body.login;
                    console.log('saving login '+req.session.login);
                    res.send("<script>location='/';</script>"); //just redirect
        
                } else {
                    req.session.destroy(function() {
                    });
        
                    res.send("<script>location='/';</script>"); //just redirect
                }
            });
        });
    
        Environment.app
        .get("/users/logout",
         function(req, res) {
    req.session.destroy(function() {
        console.log('deleting login');
    });

    res.send("<script>location='/';</script>"); //just redirect
});
};