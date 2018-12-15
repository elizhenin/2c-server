window.ЗапросыАПИ = {
    GET: {
        Sync: function(Адрес, Параметры = {}) {
            var ЗапросСервера = new XMLHttpRequest();
            ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + "/api" + Адрес + АдресИзОбъекта(Параметры), false);
            ЗапросСервера.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ("ТокенАвторизации" in Хранилище) {
                ЗапросСервера.setRequestHeader("Authorization", "Bearer " + Хранилище.getItem("ТокенАвторизации"));
            }
            ЗапросСервера.send(null);
            ТелоОтвета = ЗапросСервера.responseText;
            ЗапросСервера = undefined;
            return (ТелоОтвета);
        },
        Async: function(Адрес, Параметры = {}, Функция) {
            var ЗапросСервера = new XMLHttpRequest();
            ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + "/api" + Адрес + АдресИзОбъекта(Параметры), true);
            ЗапросСервера.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ("ТокенАвторизации" in Хранилище) {
                ЗапросСервера.setRequestHeader("Authorization", "Bearer " + Хранилище.getItem("ТокенАвторизации"));
            }
            ЗапросСервера.onload = function(e) {
                if (ЗапросСервера.readyState === 4) {
                    if (ЗапросСервера.status === 200) {
                        ТелоОтвета = ЗапросСервера.responseText;
                        Функция(ТелоОтвета);
                    }
                }
            };

            ЗапросСервера.send(null);

        }

    },
    POST: {
        Sync: function(Адрес, Параметры = {}, Тело = "") {
            var ЗапросСервера = new XMLHttpRequest();
            ЗапросСервера.open('POST', window.location.protocol + '//' + window.location.host + "/api" + Адрес + АдресИзОбъекта(Параметры), false);
            ЗапросСервера.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ("ТокенАвторизации" in Хранилище) {
                ЗапросСервера.setRequestHeader("Authorization", "Bearer " + Хранилище.getItem("ТокенАвторизации"));
            }
            ЗапросСервера.send(Тело);
            ТелоОтвета = ЗапросСервера.responseText;
            ЗапросСервера = undefined;
            return (ТелоОтвета);
        },
        Async: function(Адрес, Параметры = {}, Тело = "", Функция) {
            var ЗапросСервера = new XMLHttpRequest();
            ЗапросСервера.open('POST', window.location.protocol + '//' + window.location.host + "/api" + Адрес + АдресИзОбъекта(Параметры), true);
            ЗапросСервера.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ("ТокенАвторизации" in Хранилище) {
                ЗапросСервера.setRequestHeader("Authorization", "Bearer " + Хранилище.getItem("ТокенАвторизации"));
            }
            ЗапросСервера.onload = function(e) {
                if (ЗапросСервера.readyState === 4) {
                    if (ЗапросСервера.status === 200) {
                        ТелоОтвета = ЗапросСервера.responseText;
                        Функция(ТелоОтвета);
                    }
                }
            };

            ЗапросСервера.send(Тело);

        }

    },
    Пользователи: {
        Вход: function(Имя, Пароль) {
            ТелоЗапроса = {
                login: Имя,
                password: btoa(encodeURIComponent(Пароль))
            };
            ТелоЗапроса = JSON.stringify(ТелоЗапроса);
            Результат = JSON.parse(ЗапросыАПИ.POST.Sync("/users/login", {}, ТелоЗапроса));
            if (Результат.Статус) {
                Хранилище.setItem("ТокенАвторизации", Результат.Токен);
                Хранилище.setItem("РольПользователя", JSON.parse(decodeURIComponent(atob(Результат.Токен))).role);
                JSON.parse(decodeURIComponent(atob(Результат.Токен))).role
            } else {
                Хранилище.setItem("ТокенАвторизации", "");
                Хранилище.removeItem("ТокенАвторизации");
            }
            return Результат;
        },
        Выход: function() {
            return JSON.parse(ЗапросыАПИ.GET.Sync("/users/logout", {}, null));
        },
        Список: function() {
            var ГотовыйСписок = {rows:[]};
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_users_list", {}, null));
            window.СписокПользователей = ОтветСервера.Пользователи;
            for (var i=0; i< ОтветСервера.Пользователи.length; i++){
                ГотовыйСписок.rows.push(
                    {
                        id:ОтветСервера.Пользователи[i].Имя,
                        data:[ОтветСервера.Пользователи[i].Имя,Справочники.Роли[ОтветСервера.Пользователи[i].Роль]]
                    }
                );
            }
           return ГотовыйСписок;
        }
    },
    Организации: {
        Список: function(){
            var ГотовыйСписок = {rows:[]};
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_org_list", {}, null));
            window.СписокОрганизаций = ОтветСервера.Организации;
            for (var i=0; i< ОтветСервера.Организации.length; i++){
                ГотовыйСписок.rows.push(
                    {
                        id:ОтветСервера.Организации[i],
                        data:[ОтветСервера.Организации[i]]
                    }
                );
            }
           return ГотовыйСписок;
        }
    },
    Группы: {
        Список: function(){
            var ГотовыйСписок = {rows:[]};
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_group_list", {}, null));
            window.СписокГрупп = ОтветСервера.Группы;
            for (var i=0; i< ОтветСервера.Группы.length; i++){
                ГотовыйСписок.rows.push(
                    {
                        id:ОтветСервера.Группы[i],
                        data:[ОтветСервера.Группы[i]]
                    }
                );
            }
           return ГотовыйСписок;
        }
    }
}