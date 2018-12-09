module.exports = {
    auth: function(login, password, next) {
        var PAM = require('authenticate-pam');
        PAM.authenticate("2c_" + login, password, next);
    },

    userRole: function(login) {
        login = "2c_" + login;
        var execSync = require('child_process').execSync;
        result = execSync('groups ' + login).toString('utf8');
        result = result.split(":")[1].trim().split(" ");
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if (!result[key].startsWith("2c_role_")) {
                    delete(result[key]);
                } else {
                    result[key] = result[key].replace("2c_role_", "");
                }
            }
        };
        cleanResult = result.filter(function() { return true });
        var Role = false;
        if (cleanResult.length > 0) Role = cleanResult[0];
        return Role;
    },

    createUser: function(login, password) {

    },

    getList: function() {

    }

}