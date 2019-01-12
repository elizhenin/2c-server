module.exports = {
    DBREPORTSSDIR: false, //to be initialised from outhere
    AuthWrapper : false, //to be initialised from outhere
    getList: function(){
        var fs = require("fs");
        var result = [];
        fs.readdirSync(this.DBREPORTSSDIR, {withFileTypes: true}).forEach(item => {
            if (item.isDirectory()){
                result.push(item.name);
            }
        });
        return result;
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
                result[3] = result[3].replace(this.AuthWrapper.groupPrefix, "");
            }else{
                result[3] = 0;
            }
            resultObj = {
                rights: result[0],
                user: result[2],
                group:{code: result[3],
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
    },
    setRightsReport: function(report, user, group){
        var execSync = require('child_process').execSync;
        var result ="";
        report = report.replace(/(\s+)/g, '\\$1');
        user = this.AuthWrapper.userPrefix+user;
        group = this.AuthWrapper.groupPrefix+group;
        try{
            result = execSync('chown -R ' + user + ':' + group + " "+this.DBREPORTSSDIR+"/"+report).toString('utf8');
        }
        catch(e){
            result = e;
        }
        return  result;
    },
    getListPeriod: function(report){
        var fs = require("fs");
        var result = [];
        fs.readdirSync(this.DBREPORTSSDIR+"/"+report+"/"+"Первичные", {withFileTypes: true}).forEach(item => {
            if (item.isDirectory()){
                result.push(item.name);
            }
        });
        return result;
    },
    getRightsPeriod: function(report, period){
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            report = report.replace(/(\s+)/g, '\\$1');
            period = period.replace(/(\s+)/g, '\\$1');
            result = execSync('ls -ld ' + this.DBREPORTSSDIR+"/"+report+"/"+"Первичные"+'/'+period).toString('utf8').trim().split(" ");
            if(result[2].startsWith(this.AuthWrapper.userPrefix)){
                result[2] = result[2].replace(this.AuthWrapper.userPrefix, "");
            }else{
                result[2] = "";
            }
            if(result[3].startsWith(this.AuthWrapper.groupPrefix)){
                result[3] = result[3].replace(this.AuthWrapper.groupPrefix, "");
            }else{
                result[3] = 0;
            }
            resultObj = {
                rights: result[0],
                user: result[2],
                group:{code: result[3],
                    name: ""
                }
            }
            try{
                
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
    newReportPeriod: function(report,name){
        var fs = require("fs");
        var unzip = require("unzip");
        var result ="";
        try{
            result = fs.mkdirSync(this.DBREPORTSSDIR+"/"+report+"/"+"Первичные"+"/"+name);
        }
        catch(e){
            result = e;
        }
        return  result;
    },
    renameReportPeriod: function(report, oldname, newname){
        var fs = require("fs");
        var result ="";
        try{
            result = fs.renameSync(this.DBREPORTSSDIR+"/"+report+"/"+"Первичные"+"/"+oldname, this.DBREPORTSSDIR+"/"+report+"/"+"Первичные"+"/"+newname);
        }
        catch(e){
            result = e;
        }
        return  result;
    },
    rightsReportPeriod: function(report, period, access){
        var execSync = require('child_process').execSync;
        var result ="";
        var rights = "";
        switch(access){
            case "opened":{
                rights = "g=rwx";
                break;
            }
            case "closed":{
                rights = "g=rx";
                break;
            }
            default:{}
        }
        dirname = this.DBREPORTSSDIR+"/"+report.replace(/(\s+)/g, '\\$1')+"/"+"Первичные"+"/"+period.replace(/(\s+)/g, '\\$1');
     
        try{
            result = execSync('chmod ' + rights + " "+ dirname).toString('utf8');
        }
        catch(e){
            result = e;
        }
        return  result;
    },
    copySampleToPeriod: function(report, period, org_id){
        var fs = require("fs");
        var result ="";
        sample_filename = this.DBREPORTSSDIR+"/"+report+"/"+"Трафареты"+"/"+"Первичный.xlsx";
        org_filename = this.DBREPORTSSDIR+"/"+report+"/"+"Первичные"+"/"+period+"/"+org_id+".xlsx";
        if (fs.existsSync(org_filename)){
            result = true;
        }else {
            fs.copyFileSync(sample_filename,org_filename);
        }
        return result;
    },
    listReportPeriodDocs: function(report,period){
        var fs = require("fs");
        var result ="";
        lookup_dir = this.DBREPORTSSDIR+"/"+report+"/"+"Первичные"+"/"+period;
        var result = [];
        fs.readdirSync(lookup_dir, {withFileTypes: true}).forEach(item => {
            if (item.isFile()){

                result.push({
                    Код: item.name,
                    Название: this.AuthWrapper.getOrgNameByCode(item.name.replace(".xlsx",""))
                });
            }
        });
        return result;
    }
}