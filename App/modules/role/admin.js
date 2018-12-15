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

            Response = ResponsePrepare(true, AuthWrapper.getList(), "Список успешно получен");

            res.send(Response);
        });

}