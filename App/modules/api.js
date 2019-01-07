module.exports = function (Environment) {

    Environment.api_url_prefix = "/api";
    //users and auth
    var Users = require('./users');
    Users(Environment);
    //roles specific
    var RoleAdmin = require('./role/admin');
    RoleAdmin(Environment);
    var RoleEditor = require('./role/editor');
    RoleEditor(Environment);
    var RoleReceiver = require('./role/receiver');
    RoleReceiver(Environment);
    var RoleSender = require('./role/sender');
    RoleSender(Environment);
    //documents backend
    var Documents = require('./documents');
    Documents(Environment);
 
}