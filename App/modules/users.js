module.exports = function (Environment) {
    var fs = require('fs');
    var AuthWrapper = require('./auth-wrapper');
    var Goodies = require("./goodies");
    var api_users_prefix = "/users";

    var TokenMiddleware = function (req, res, next) {
        if ("authorization" in req.headers) {
            var Token = req.headers.authorization.replace("Bearer ", "");
            var TokenCheckFilename = Environment.DBTOKENSDIR + "/" + Token;
            
            if (
                fs.existsSync(TokenCheckFilename) &&
                (!(fs.lstatSync(TokenCheckFilename).isDirectory()))
            ) {
                var TokenCheck = fs.readFileSync(TokenCheckFilename).toString();
                TokenCheck = JSON.parse(decodeURIComponent(Goodies.base64decode(TokenCheck)));
                req.AuthToken = Token;
                req.AuthTokenDetails = TokenCheck;
            }
        }
       next();
    };
    Environment.app.use(TokenMiddleware);

    Environment.app
        .post(Environment.api_url_prefix + api_users_prefix + "/login",
            function (req, res) {
                Request = req.body;
                Request.login;
                Request.password = decodeURIComponent(Goodies.base64decode(Request.password));
                var ResponsePrepare = function (status, token, message) {
                    Response = {
                        Статус: status,
                        Токен: token,
                        Сообщение: message,
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                AuthWrapper.auth(Request.login, Request.password, function (err) {
                    if (err) {
                        res.send(ResponsePrepare(false, "", "Неправильная пара логин/пароль"));
                    } else {
                        var date = new Date();
                        date.setDate(date.getDate() + 3);
                        var Token = {
                            login: Request.login,
                            role: AuthWrapper.userRole(Request.login),
                            expires: date.toISOString(),
                            randomSeed: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
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
        .get(Environment.api_url_prefix + api_users_prefix + "/logout",
            function (req, res) {
                var Response;
                var ResponsePrepare = function (status, token, message) {
                    Response = {
                        Статус: status,  // true/false
                        Токен: token,
                        Сообщение: message
                    };
                    Response = JSON.stringify(Response);
                    return Response;
                };
                if (fs.existsSync(Environment.DBTOKENSDIR + "/" + req.AuthToken)) {
                    fs.unlinkSync(Environment.DBTOKENSDIR + "/" + req.AuthToken);
                    console.log("token " + req.AuthToken + " unset");
                    Response = ResponsePrepare(true, "", "Токен удален");
                } else Response = ResponsePrepare(false, "", "Нет такого токена");
                res.send(Response);
            });
}