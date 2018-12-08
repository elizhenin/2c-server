module.exports = function (Environment) {
    var fs = require('fs');
    var PAM = require('authenticate-pam');
    var Goodies = require("./goodies");

    Environment.app
        .post(Environment.api_url_prefix + "/users/login",
            function (req, res) {
                Request = req.body;
                Request.password = decodeURIComponent(Goodies.base64decode(Request.password));
                var ResponsePrepare = function (status, token, message) {
                    Response = {
                        Статус: status,
                        Токен: token,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                PAM.authenticate(Request.login, Request.password, function (err) {
                    if (err) {
                        res.send(ResponsePrepare(false, "", "Неправильная пара логин/пароль"));
                    } else {
                        var date = new Date();
                        date.setDate(date.getDate() + 3);
                        var Token = {
                            login: Request.login,
                            expires: date.toISOString()
                        };
                        Token = Goodies.base64encode(encodeURIComponent(JSON.stringify(Token)));
                        fs.writeFile(Environment.DBTOKENSDIR + "/" + Token, Token, function (err) {
                            if (err) {
                                res.send(ResponsePrepare(false, "", "Ошибка сохранения токена"));
                                return console.log(err);
                            }
                            res.send(ResponsePrepare(true, Token, "Авторизовано успешно"));
                        });
                    }
                });
            });
    Environment.app
        .get(Environment.api_url_prefix + "/users/logout",
            function (req, res) {
                var url = require('url');
                var url_parts = url.parse(req.url, true);
                var query = url_parts.query;
                var Response;
                var ResponsePrepare = function (status, token, message) {
                    Response = {
                        Статус: status,
                        Токен: token,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                if (fs.existsSync(Environment.DBTOKENSDIR + "/" + query.token)) {
                    fs.unlinkSync(Environment.DBTOKENSDIR + "/" + query.token);
                    console.log("token " + query.token + " unset");
                    Response = ResponsePrepare(true, "", "Токен удален");
                } else Response = ResponsePrepare(false, "", "Нет такого токена");
                res.send(Response);
            });
}