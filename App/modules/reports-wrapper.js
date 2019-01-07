module.exports = {
    DBREPORTSSDIR: false, //to be initialised from outhere
    AuthWrapper : false, //to be initialised from outhere
    getList: function(){
        var fs = require("fs");
        return fs.readdirSync(this.DBREPORTSSDIR);

    },
    getRights: function(report){
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            report = report.replace(/(\s+)/g, '\\$1');
            result = execSync('ls -ld ' + this.DBREPORTSSDIR + '/' + report).toString('utf8').trim().split(" ");
            if(result[2].startsWith(this.AuthWrapper.userPrefix)){
                result[2] = result[2].replace(this.AuthWrapper.userPrefix, "");
            }else{
                result[2] = "";
            }
            if(result[3].startsWith(this.AuthWrapper.groupPrefix)){
                result[3] = result[2].replace(this.AuthWrapper.groupPrefix, "");
            }else{
                result[3] = 0;
            }
            resultObj = {
                rights: result[0],
                user: result[2],
                group:{code: result[3]+0,
                    name: ""
                }
            }
            try{
                var fs = require("fs");
                resultObj.group.name = this.AuthWrapper.getGroupNameByCode(resultObj.group.code)
            }
            catch(e){

            }
            result = resultObj;
        } catch (err) {
            result += err;
        }

        return result;
    },
    newReport: function(name){
        var fs = require("fs");
        var unzip = require("unzip");
        var result ="";
        try{
            result = fs.createReadStream(this.DBDIR+"/"+"report_structure.zip").pipe(unzip.Extract({ path: this.DBREPORTSSDIR+"/"+name}));  
        }
        catch(e){
            result = e;
        }
        return  result;
    },
    renameReport: function(oldname, newname){
        var fs = require("fs");
        var result ="";
        try{
            result = fs.renameSync(this.DBREPORTSSDIR+"/"+oldname, this.DBREPORTSSDIR+"/"+newname);
        }
        catch(e){
            result = e;
        }
        return  result;
    }
}