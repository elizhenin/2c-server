module.exports = {
    auth: function(login, password, next) {
        var PAM = require('authenticate-pam');
        PAM.authenticate("2c_" + login, password, next);
    },

    userRole: function(login) {
        login = "2c_" + login;
        var Role = "admin";
        var execSync = require('child_process').execSync;
        // result = execSync('groups ' + login);
        //  console.log(result);

        return Role;
    },

    createUser: function(login, password) {

    },

    getList: function() {

    }

}