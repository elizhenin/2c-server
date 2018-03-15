module.exports = function(Environment) {
    var fs = require('fs'); // this engine requires the fs module
    var imaps = require('imap-simple');
    var Goodies = require(Environment.APPDIR + 'modules/goodies');
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
                domain = Goodies.login2domain(req.session.login);
            
                body = body.replace('<?=$domain?>',domain);
                res.render('window-tpl', {
                    title: '2C',
                    width: 1024,
                    height: 600,
                    body: body
                });
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
                body = body.replace('<?=$path_to?>', '' + req.query.to + '');

                res.render('dialog-tpl', {
                    title: '',
                    width: 400,
                    height: 200,
                    body: body
                });
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
                var dir = Environment.uploads_dir + "templates/";
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                Goodies.dir2json(dir, function(err, result) {
                    if (err)
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
                domain = Goodies.login2domain(req.session.login);
                if (domain != '') {
                    domain+='/';
                }
                var dir = Environment.uploads_dir + 'reports/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var dir = dir + domain;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                Goodies.dir2json(dir, function(err, result) {
                    if (err)
                        console.error(err);
                    else
                        res.send(JSON.stringify(result));
                });

            });


    Environment.app
        .post("/workspace/api/trafaret-upload",
            function(req, res) {
                if (!req.session.login) {
                    //auth broken
                    res.send("<script>location='/';</script>"); //just redirect
                    return;
                }
                var dir = req.body.record.to;
                var filename = req.body.record.name+'.ods';
                
                buffer = new Buffer(req.body.record.trafaret[0].content, 'base64');
                if(req.body.record.trafaret[0].type == 'application/vnd.oasis.opendocument.spreadsheet'){
                    buffer = new Buffer(req.body.record.trafaret[0].content, 'base64');
                    fs.writeFile(dir+filename, buffer, function(err) {
                            if (err) {
                                return console.log(err);
                                res.send("{status: 'error',message: 'Ошибка сохранения'}");
                            }
                            console.log(filename + " was saved in subdir");
                            res.send("{status: 'success',message: 'Трафарет успешно добавлен'}");
                        });
                    }else{res.send("{status: 'error',message: 'Трафарет принимается только в формате ods'}");};
                    });


};