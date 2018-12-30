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
                        Организация: AuthWrapper.getOrgByUser(user),
                        Группы: AuthWrapper.getGroupsByUser(user)
                    };
                    Response.push(item);
                });
                Response = ResponsePrepare(true, Response, "Список пользователей успешно получен");

                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_role_admin_prefix + "/add_user",
            function (req, res) {
                Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Отладка: items,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                var createUser = AuthWrapper.createUser(Request.login, Request.password);

                var setUserRole = AuthWrapper.setUserRole(Request.login, Request.role);

                Response = ResponsePrepare(true, {
                    'createUser': createUser,
                    'setUserRole': setUserRole
                }, "Параметры пользователя сохранены");

                res.send(Response);
            });
    Environment.app
        .get(Environment.api_url_prefix + api_role_admin_prefix + "/set_user_org",
            function (req, res) {
                Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Отладка: items,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                var setUserOrg = AuthWrapper.setUserOrg(Request.login, Request.org);

                Response = ResponsePrepare(true, setUserOrg, "Организация пользователя назначена");

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
                var OrgList = AuthWrapper.getOrgList(Environment.DBORGNAMESDIR);
                
                //TODO populate with info about included users
                var Response = OrgList;
                Response = ResponsePrepare(true, Response, "Список организаций успешно получен");

                res.send(Response);
            });

    Environment.app
        .get(Environment.api_url_prefix + api_role_admin_prefix + "/add_org",
            function (req, res) {
                Request = req.query;
                var Response;
                var ResponsePrepare = function (status, items, message) {
                    Response = {
                        Статус: status, // true/false
                        Отладка: items,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                var createOrg = AuthWrapper.createOrg(Request.name, Request.code, Environment.DBORGNAMESDIR);
                Response = ResponsePrepare(true, createOrg, "Организация сохранена");

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
                var GroupList = AuthWrapper.getGroupList(Environment.DBGROUPNAMESDIR);
                //TODO populate with info about included users
                var Response = GroupList;
                Response = ResponsePrepare(true, Response, "Список групп успешно получен");

                res.send(Response);
            });

    Environment.app
    .get(Environment.api_url_prefix + api_role_admin_prefix + "/add_group",
        function (req, res) {
            Request = req.query;
            var Response;
            var ResponsePrepare = function (status, items, message) {
                Response = {
                    Статус: status, // true/false
                    Отладка: items,
                    Сообщение: message
                };
                Response = JSON.stringify(Response);
                return Response;
            };
            var createGroup = AuthWrapper.createGroup(Request.name, Request.code, Environment.DBGROUPNAMESDIR);
            Response = ResponsePrepare(true, createGroup, "Группа сохранена");

            res.send(Response);
        });
        Environment.app
        .get(Environment.api_url_prefix + api_role_admin_prefix + "/get_group_users",
            function (req, res) {
                Request = req.query;
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
                var getGroupUsers = AuthWrapper.getGroupUsers(Request.code);
                Response = ResponsePrepare(true, getGroupUsers, "Пользователи группы получены");
    
                res.send(Response);
            });
            Environment.app
            .get(Environment.api_url_prefix + api_role_admin_prefix + "/add_group_user",
                function (req, res) {
                    Request = req.query;
                    var Response;
                    var ResponsePrepare = function (status, items, message) {
                        Response = {
                            Статус: status, // true/false
                            Отладка: items,
                            Сообщение: message
                        };
                        Response = JSON.stringify(Response);
                        return Response;
                    };
                    var setUserOrg = AuthWrapper.addGroupUser(Request.group, Request.login);
    
                    Response = ResponsePrepare(true, setUserOrg, "Пользователь добавлен в группу");
    
                    res.send(Response);
                });
                Environment.app
            .get(Environment.api_url_prefix + api_role_admin_prefix + "/del_group_user",
                function (req, res) {
                    Request = req.query;
                    var Response;
                    var ResponsePrepare = function (status, items, message) {
                        Response = {
                            Статус: status, // true/false
                            Отладка: items,
                            Сообщение: message
                        };
                        Response = JSON.stringify(Response);
                        return Response;
                    };
                    var setUserOrg = AuthWrapper.delGroupUser(Request.group, Request.login);
    
                    Response = ResponsePrepare(true, setUserOrg, "Пользователь убран из группы");
    
                    res.send(Response);
                });
}