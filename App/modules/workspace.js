module.exports = function(Environment){
    var fs = require('fs'); // this engine requires the fs module
    var imaps = require('imap-simple');
//GUI section
        Environment.app
        .get("/workspace",
        function(req, res) { 
            if (!req.session.login) {
                //auth broken
                res.send("<script>location='/';</script>"); //just redirect
                return;
            }
            var body = fs.readFileSync(Environment.APPDIR + 'views/' + 'workspace.htm', 'utf8');

            res.render('window-tpl', {
                title: '2C',
                width: 1024,
                height: 600,
                body: body});
            });
            Environment.app
            .get("/workspace/trafaret-upload",
            function(req, res) { 
                if (!req.session.login) {
                    //auth broken
                    res.send("<script>location='/';</script>"); //just redirect
                    return;
                }
                var body = fs.readFileSync(Environment.APPDIR + 'views/' + 'trafaret-upload.htm', 'utf8');
                body = body.replace('<?=$path_to?>', ''+ req.query.to +'');

                res.render('dialog-tpl', {
                    title: '',
                    width: 400,
                    height: 200,
                    body: body});
                });
    

//API section
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

                    Environment.app
            .post("/workspace/api/trafaret-upload",//TODO unfinished
            function(req, res) { 
                if (!req.session.login) {
                    //auth broken
                    res.send("<script>location='/';</script>"); //just redirect
                    return;
                }
                var to = req.body.to;
              //  var trafaret = req.query.trafaret;
                var body = '';
                filePath = to+'test1.ods';
                req.on('data', function(data) {
                    body += data;
                });
            
                req.on('end', function (){
                    fs.appendFile(filePath, body, function() {
                        res.end();
                    });
                });


            });

};