module.exports = {
    auth: function (login, password, next) {
        var PAM = require('authenticate-pam');
        PAM.authenticate("2c_" + login, password, next);
    },

    userRole: function (login) {
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
        cleanResult = result.filter(function () {
            return true
        });
        var Role = false;
        if (cleanResult.length > 0) Role = cleanResult[0];
        return Role;
    },

    createUser: function (login, password) {
        login = "2c_" + login;
        var execSync = require('child_process').execSync;
        try {
            result = execSync('useradd ' + login).toString('utf8');
        } catch (err) {
            result = err;
        }
        try {
            result += "\n" + execSync('echo "' + password + '\\n' + password + '" | passwd ' + login).toString('utf8');
        } catch (err) {
            result+= err;
        }
        return result;
    },

    setUserRole: function (login, role) {
        login = "2c_" + login;
        role = "2c_role_" + role;
        var execSync = require('child_process').execSync;
        try {
        result = execSync('gpasswd -d ' + login + ' ' + '2c_role_admin').toString('utf8');
    } catch (err) {
        result = err;
    }try {
        result += "\n" + execSync('gpasswd -d ' + login + ' ' + '2c_role_editor').toString('utf8');
    } catch (err) {
        result+= err;
    }try {
        result += "\n" + execSync('gpasswd -d ' + login + ' ' + '2c_role_sender').toString('utf8');
    } catch (err) {
        result+= err;
    }try {
        result += "\n" + execSync('gpasswd -d ' + login + ' ' + '2c_role_receiver').toString('utf8');
    } catch (err) {
        result+= err;
    }try {

        result += "\n" + execSync('gpasswd -a ' + login + ' ' + role).toString('utf8');
    } catch (err) {
        result+= err;
    }

        return result;
    },

    getList: function () {
        var execSync = require('child_process').execSync;
        result = execSync('getent passwd | grep "2c_"').toString('utf8');
        result = result.split("\n");
        var CleanResult = [];
        result.forEach(element => {
            element = element.split(':')[0].replace("2c_", "");
            if (element.length > 0) CleanResult.push(element);
        });
        return (CleanResult);
    },

    getOrgByUser: function (user) {
        user = "2c_" + user;
        var execSync = require('child_process').execSync;
        result = execSync('groups ' + user).toString('utf8');
        result = result.split(":")[1].trim().split(" ");
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if (!result[key].startsWith("2c_org_")) {
                    delete(result[key]);
                } else {
                    result[key] = result[key].replace("2c_org_", "");
                }
            }
        };
        cleanResult = result.filter(function () {
            return true
        });
        var Organisations = false;
        if (cleanResult.length > 0) Organisations = cleanResult;
        return Organisations;
    },

    getGroupsByUser: function (user) {
        user = "2c_" + user;
        var execSync = require('child_process').execSync;
        result = execSync('groups ' + user).toString('utf8');
        result = result.split(":")[1].trim().split(" ");
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if (!result[key].startsWith("2c_group_")) {
                    delete(result[key]);
                } else {
                    result[key] = result[key].replace("2c_group_", "");
                }
            }
        };
        cleanResult = result.filter(function () {
            return true
        });
        var Groups = false;
        if (cleanResult.length > 0) Groups = cleanResult;
        return Groups;
    },

    getOrgList: function () {
        var execSync = require('child_process').execSync;
        result = execSync('getent group | grep "2c_org_"').toString('utf8');
        result = result.split("\n");
        var CleanResult = [];
        result.forEach(element => {
            element = element.split(':')[0].replace("2c_org_", "");
            if (element.length > 0) CleanResult.push(element);
        });
        return CleanResult;
    },
    getGroupList: function () {
        var execSync = require('child_process').execSync;
        result = execSync('getent group | grep "2c_group_"').toString('utf8');
        result = result.split("\n");
        var CleanResult = [];
        result.forEach(element => {
            element = element.split(':')[0].replace("2c_group_", "");
            if (element.length > 0) CleanResult.push(element);
        });
        return CleanResult;
    },
}