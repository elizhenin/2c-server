module.exports = function (Environment) {

    Environment.api_url_prefix = "/api";
    var Users = require('./users');
    Users(Environment);
    var RoleAdmin = require('./role/admin');
    RoleAdmin(Environment);

}