module.exports = function(Environment){
    var fs = require("fs");
        Environment.app
        .get("/persons",
         function(req, res) {
            res.send("<script>location='/';</script>"); //just redirect
        });
  
        Environment.app
        .get("/persons/upload",
         function(req, res) {
            res.send("<script>location='/';</script>"); //just redirect
        });

        Environment.app
        .post("/persons/upload",
         function(req, res) {
            if (req.body.record.csvfile) {
                format_ok = true;
                req.body.record.csvfile.forEach(function(element) {
                    if (!((element.type == "text/csv")||(element.type == "application/vnd.ms-excel"))) {
                        format_ok = false;
                    }
                });
        
         if (format_ok) {
                        res.send("{status: 'success',message: 'Файлы успешно загружены<br/>Вы можете повторить загрузку или выйти из системы'}");
                    } else {
                        res.send("{status: 'error',message: 'Файлы, отличные от *.csv, не загружены'}");
                    }
        
                domain = req.session.login.split("@");
                domain = domain[1];
                domain = domain.split(".");
                domain = domain.reverse();
        
                if (domain.length == 2) {
                    domain = 'MAIN';
                } else {
                    domain = domain[2].toUpperCase();
                }
        
                var dir = Environment.uploads_dir + domain + "/";
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
        
                req.body.record.csvfile.forEach(function(element) {
                console.log(element.type+"\n");
                    if (format_ok) {
                        var now = new Date();
                        var formated_date = now.getFullYear().toString() +
                            ("0" + (now.getMonth() + 1)).slice(-2).toString() +
                            ("0" + now.getDate()).slice(-2).toString() +
                            ("0" + now.getHours()).slice(-2).toString() +
                            ("0" + now.getMinutes()).slice(-2).toString() +
                            ("0" + now.getSeconds()).slice(-2).toString() + '_' +
                            ("0" + now.getMilliseconds()).slice(-2).toString();
        
                        filename = domain + '_' + formated_date + '.csv';
                          buffer = new Buffer(element.content, 'base64');
                        fs.writeFile(dir + filename, buffer, function(err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log(filename + " was saved in subdir");
                        });
        
                    }
                }, this);
            }
        
        });
};

