module.exports = {
    dir2json: function(dir, done) {
        
            var fs = require('fs');
             var path = require('path');
             var directoryTreeToObj = function(dir, done) {
            var results = [];
        
            fs.readdir(dir, function(err, list) {
                if (err)
                    return done(err);
        
                var pending = list.length;
        
                if (!pending)
                    return done(null, {icon: "/static/img/folder-symbolic.svg",text: path.basename(dir),id:dir, children: results});
        
                list.forEach(function(file) {
                    file = path.resolve(dir, file);
                    fs.stat(file, function(err, stat) {
                        if (stat && stat.isDirectory()) {
                            directoryTreeToObj(file, function(err, res) {
                                results.push({
                                    text: path.basename(file),
                                      icon: "/static/img/system-file-manager-symbolic.svg",
                                      id:file+'/',
                                    children: res
                                });
                                
                                if (!--pending)
                                    done(null, results);
                            });
                        }
                        else {
                            results.push({
                                text: path.basename(file),
                                id:file,
                                icon: "/static/img/libreoffice-calc.svg"
                            });
                           
                            if (!--pending)
                                done(null, results);
                        }
                    });
                });
            });
        };
        directoryTreeToObj(dir, done);
    }

};
