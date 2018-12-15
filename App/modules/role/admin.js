module.exports = function (Environment) {

    var api_role_admin_prefix = "/role/admin";
    var AuthWrapper = require('../auth-wrapper');
    var Goodies = require("../goodies");

    Environment.app
    .get(Environment.api_url_prefix + api_role_admin_prefix + "/get_users_list",
        function (req, res) {
            var Response;
            var ResponsePrepare = function (status, items, message) {
                Response = {
                    Статус: status, // true/false
                    Пользователи: items,
                    Сообщение: message
                };
                Response = JSON.stringify(Response);
                return Response;
            };
            var UsersList = AuthWrapper.getList();
            var Response = [];
            UsersList.forEach(user => {
                var item = {
                    Имя: user,
                    Роль: AuthWrapper.userRole(user),
                    Организации: AuthWrapper.getOrgByUser(user),
                    Группы: AuthWrapper.getGroupsByUser(user)
                };
                Response.push(item);
            });
            Response = ResponsePrepare(true, Response, "Список пользователей успешно получен");

            res.send(Response);
        });
        Environment.app
        .get(Environment.api_url_prefix + api_role_admin_prefix + "/get_org_list",
            function (req, res) {
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Организации: items,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                var OrgList = AuthWrapper.getOrgList();
                //TODO populate with info about included users
                var Response = OrgList;
                Response = ResponsePrepare(true, Response, "Список организаций успешно получен");

                res.send(Response);
            });
            Environment.app
            .get(Environment.api_url_prefix + api_role_admin_prefix + "/get_group_list",
                function (req, res) {
                    var Response;
                    var ResponsePrepare = function (status, items, message) {
                        Response = {
                            Статус: status, // true/false
                            Группы: items,
                            Сообщение: message
                        };
                        Response = JSON.stringify(Response);
                        return Response;
                    };
                    var GroupList = AuthWrapper.getGroupList();
                    //TODO populate with info about included users
                    var Response = GroupList;
                    Response = ResponsePrepare(true, Response, "Список групп успешно получен");
    
                    res.send(Response);
                });
}