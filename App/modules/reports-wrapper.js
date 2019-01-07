module.exports = {
    DBREPORTSSDIR: false, //to be initialised from outhere
    getList: function(){
        var fs = require("fs");
        return fs.readdirSync(this.DBREPORTSSDIR);

    },
    getRights: function(report){
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            result = execSync('ls -ld ' + this.DBREPORTSSDIR + '/' + report).toString('utf8').trim().split(" ");
            resultObj = {
                rights: result[0],
                user: result[2],
                group: result[3]
            }
            result = resultObj;
        } catch (err) {
            result += err;
        }

        return result;
    },
}