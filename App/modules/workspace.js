module.exports = function(Environment){
    var imaps = require('imap-simple');

        Environment.app
        .get("/workspace",
        function(req, res) { 
            if (!req.session.login) {
                //auth broken
                res.send("<script>location='/';</script>"); //just redirect
                return;
            }
            res.render('window-tpl', {
                title: '2C',
                width: 1024,
                height: 600,
                body: 'workspace.htm'});
            });

            Environment.app
            .get("/workspace/api/templates",
            function(req, res) { 
                if (!req.session.login) {
                    //auth broken
                    res.send("<script>location='/';</script>"); //just redirect
                    return;
                }
                var Goodies = require(Environment.APPDIR + 'modules/goodies');
                var fs = require('fs');
                var dir = Environment.uploads_dir + "templates/";
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                Goodies.dir2json(dir, function(err, result){
                    if(err)
                        console.error(err);
                    else
                        res.send(JSON.stringify(result));
                });

                });

                Environment.app
                .get("/workspace/api/reports",
                function(req, res) { 
                    if (!req.session.login) {
                        //auth broken
                        res.send("<script>location='/';</script>"); //just redirect
                        return;
                    }
                    var Goodies = require(Environment.APPDIR + 'modules/goodies');
                    var fs = require('fs');
                    domain = req.session.login.split("@");
                    domain = domain[1];
                    domain = domain.split(".");
                    domain = domain.reverse();
            
                    if (domain.length == 2) {
                        domain = '';
                    } else {
                        domain = domain[2].toUpperCase()+"/";
                    }
		    var dir = Environment.uploads_dir+'reports/';
		    if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		    }
                    var dir = dir+domain;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
    
                    Goodies.dir2json(dir, function(err, result){
                        if(err)
                            console.error(err);
                        else
                            res.send(JSON.stringify(result));
                    });
    
                    });

};