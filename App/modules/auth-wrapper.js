module.exports = {
    DBGROUPNAMESDIR: false, // to be set from outhere
    DBORGNAMESDIR: false, // to be set from outhere
    auth: function (login, password, next) {
        var PAM = require('authenticate-pam');
        PAM.authenticate("2c_" + login, password, next);
    },
    userPrefix: "2c_",
    rolePrefix: "2c_role_",
    orgPrefix: "2c_org_",
    groupPrefix: "2c_group_",
    userRole: function (login) {
        login = this.userPrefix + login;
        var execSync = require('child_process').execSync;
        result = execSync('groups ' + login).toString('utf8');
        result = result.split(":")[1].trim().split(" ");
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if (!result[key].startsWith(this.rolePrefix)) {
                    delete(result[key]);
                } else {
                    result[key] = result[key].replace(this.rolePrefix, "");
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
        login = this.userPrefix + login;
        var execSync = require('child_process').execSync;
        try {
            result = execSync('useradd ' + login).toString('utf8');
        } catch (err) {
            result = err;
        }
        if (password.length > 0) {
            try {
                result += "\n" + execSync('echo "' + password + '\\n' + password + '" | passwd ' + login).toString('utf8');
            } catch (err) {
                result += err;
            }
        } else result += "password empty - not changed\n";
        return result;
    },

    setUserRole: function (login, role) {
        var currentRole = this.userRole(login);
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            execSync('gpasswd -d ' + this.userPrefix + login + ' ' + this.rolePrefix + currentRole).toString('utf8');
        } catch (err) {
            result += err;
        }

        try {

            execSync('usermod -a -G ' + this.rolePrefix + role + ' ' + this.userPrefix + login).toString('utf8');
            result += "\n" + "Назначение роли " + role;
        } catch (err) {
            result += err;
        }

        return result;
    },

    getList: function () {
        var execSync = require('child_process').execSync;
        result = execSync('getent passwd | grep "' + this.userPrefix + '"').toString('utf8');
        result = result.split("\n");
        var CleanResult = [];
        result.forEach(element => {
            element = element.split(':')[0].replace(this.userPrefix, "");
            if (element.length > 0) CleanResult.push(element);
        });
        return (CleanResult);
    },

    getOrgByUser: function (user) {
        user = this.userPrefix + user;
        var execSync = require('child_process').execSync;
        result = execSync('groups ' + user).toString('utf8');
        result = result.split(":")[1].trim().split(" ");
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if (!result[key].startsWith(this.orgPrefix)) {
                    delete(result[key]);
                } else {
                    result[key] = result[key].replace(this.orgPrefix, "");
                }
            }
        };
        cleanResult = result.filter(function () {
            return true
        });
        var Organisation = false;
        if (cleanResult.length > 0) Organisation = cleanResult[0];
        return Organisation;
    },

    getGroupsByUser: function (user) {
        user = this.userPrefix + user;
        var execSync = require('child_process').execSync;
        result = execSync('groups ' + user).toString('utf8');
        result = result.split(":")[1].trim().split(" ");
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if (!result[key].startsWith(this.groupPrefix)) {
                    delete(result[key]);
                } else {
                    result[key] = result[key].replace(this.groupPrefix, "");
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

    setUserOrg: function (login, org) {
        var currentOrg = this.getOrgByUser(login);
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            execSync('gpasswd -d ' + this.userPrefix + login + ' ' + this.orgPrefix + currentOrg).toString('utf8');
        } catch (err) {
            result += err;
        }
        try {
            result += "\n" + execSync('usermod -a -G ' + this.orgPrefix + org + ' ' + this.userPrefix + login).toString('utf8');
            result += "\n" + "Назначение организации " + org;
        } catch (err) {
            result += err;
        }

        return result;
    },

    getOrgList: function () {
        var fs = require("fs");
        var execSync = require('child_process').execSync;
        try {
            result = execSync('getent group | grep "' + this.orgPrefix + '"').toString('utf8');
        } catch (e) {
            result = "";
        }
        result = result.split("\n");
        var CleanResult = [];
        result.forEach(element => {
            element = element.split(':')[0].replace(this.orgPrefix, "");
            if (element.length > 0) try {
                CleanResult.push({
                    Код: element,
                    Название: fs.readFileSync(this.DBORGNAMESDIR + "/" + this.orgPrefix + element).toString()
                });
            } catch (e) {
                CleanResult.push({
                    Код: element,
                    Название: element
                });
            }
        });
        return CleanResult;
    },


    createOrg: function (name, code) {
        var fs = require('fs');
        var execSync = require('child_process').execSync;
        var result = "";
        if (code == "false") {
            code = 1;
            while (fs.existsSync(this.DBORGNAMESDIR + "/" + this.orgPrefix + ("000000000" + code).slice(-9))) {
                console.log(fs.existsSync(this.DBORGNAMESDIR + "/" + this.orgPrefix + ("000000000" + code).slice(-9)));
                code++;
            }
        }

        var filename = this.orgPrefix + ("000000000" + code).slice(-9);
        result += filename + "\n";
        fs.writeFile(this.DBORGNAMESDIR + "/" + filename, name, function (err) {});
        try {
            result += execSync('groupadd ' + filename).toString('utf8');
        } catch (e) {
            result += e;
        }

        return result;
    },
    getGroupList: function () {
        var fs = require("fs");
        var execSync = require('child_process').execSync;
        try {
            result = execSync('getent group | grep "' + this.groupPrefix + '"').toString('utf8');
        } catch (e) {
            result = "";
        }
        result = result.split("\n");
        var CleanResult = [];
        result.forEach(element => {
            element = element.split(':')[0].replace(this.groupPrefix, "");
            if (element.length > 0) try {
                CleanResult.push({
                    Код: element,
                    Название: this.getGroupNameByCode(element)
                });
            } catch (e) {
                CleanResult.push({
                    Код: element,
                    Название: element
                });
            }
        });
        return CleanResult;
    },
    getGroupNameByCode: function (code) {
        try {
            var fs = require("fs");
            return fs.readFileSync(this.DBGROUPNAMESDIR + "/" + this.groupPrefix + code).toString();
        } catch (e) {
            return false;
        }
    },
    createGroup: function (name, code) {
        var fs = require('fs');
        var execSync = require('child_process').execSync;
        var result = "";
        if (code == "false") {
            code = 1;
            while (fs.existsSync(this.DBGROUPNAMESDIR + "/" + this.groupPrefix + ("000000000" + code).slice(-9))) {
                console.log(fs.existsSync(this.DBGROUPNAMESDIR + "/" + this.groupPrefix + ("000000000" + code).slice(-9)));
                code++;
            }
        }

        var filename = this.groupPrefix + ("000000000" + code).slice(-9);
        result += filename + "\n";
        fs.writeFile(this.DBGROUPNAMESDIR + "/" + filename, name, function (err) {});
        try {
            result += execSync('groupadd ' + filename).toString('utf8');
        } catch (e) {
            result += e;
        }

        return result;
    },
    getGroupUsers: function (code) {
        var execSync = require('child_process').execSync;
        var result = "";
        try {
            result += execSync('getent group ' + this.groupPrefix + code).toString('utf8');
        } catch (e) {
            result += "";
        }
        var CleanResult = [];
        if (result) {
            result = result.split(':')[3];
            result = result.split(',');
            result.forEach(element => {
                element = element.trim().replace(this.userPrefix, "");;

                if (element) {
                    CleanResult.push({
                        Имя: element,
                        Организация: this.getOrgByUser(element)
                    });
                }
            });
        }

        return CleanResult;
    },
    addGroupUser: function (group, login) {
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            result += "\n" + execSync('usermod -a -G ' + this.groupPrefix + group + ' ' + this.userPrefix + login).toString('utf8');
            result += "\n" + "Добавление в группу " + group;
        } catch (err) {
            result += err;
        }

        return result;
    },
    delGroupUser: function (group, login) {
        var result = "";
        var execSync = require('child_process').execSync;
        try {
            execSync('gpasswd -d ' + this.userPrefix + login + ' ' + this.groupPrefix + group).toString('utf8');
        } catch (err) {
            result += err;
        }

        return result;
    }
}