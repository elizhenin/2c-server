window.ЗапросыАПИ = {
    GET: {
        Sync: function (Адрес, Параметры = {}) {
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
        Async: function (Адрес, Параметры = {}, Функция) {
            var ЗапросСервера = new XMLHttpRequest();
            ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + "/api" + Адрес + АдресИзОбъекта(Параметры), true);
            ЗапросСервера.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ("ТокенАвторизации" in Хранилище) {
                ЗапросСервера.setRequestHeader("Authorization", "Bearer " + Хранилище.getItem("ТокенАвторизации"));
            }
            ЗапросСервера.onload = function (e) {
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
        Sync: function (Адрес, Параметры = {}, Тело = "") {
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
        Async: function (Адрес, Параметры = {}, Тело = "", Функция) {
            var ЗапросСервера = new XMLHttpRequest();
            ЗапросСервера.open('POST', window.location.protocol + '//' + window.location.host + "/api" + Адрес + АдресИзОбъекта(Параметры), true);
            ЗапросСервера.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ("ТокенАвторизации" in Хранилище) {
                ЗапросСервера.setRequestHeader("Authorization", "Bearer " + Хранилище.getItem("ТокенАвторизации"));
            }
            ЗапросСервера.onload = function (e) {
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
        Вход: function (Имя, Пароль) {
            ТелоЗапроса = {
                login: Имя,
                password: btoa(encodeURIComponent(Пароль))
            };
            ТелоЗапроса = JSON.stringify(ТелоЗапроса);
            Результат = JSON.parse(ЗапросыАПИ.POST.Sync("/users/login", {}, ТелоЗапроса));
            if (Результат.Статус) {
                Хранилище.setItem("ТокенАвторизации", Результат.ТокенДанные.Token);
                Хранилище.setItem("РольПользователя", Результат.ТокенДанные.role);

            } else {
                Хранилище.setItem("ТокенАвторизации", "");
                Хранилище.removeItem("ТокенАвторизации");
            }
            return Результат;
        },
        Выход: function () {
            return JSON.parse(ЗапросыАПИ.GET.Sync("/users/logout", {}, null));
        },
        Список: function () {
            var ГотовыйСписок = {
                rows: []
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_users_list", {}, null));
            window.СписокПользователей = ОтветСервера.Пользователи;
            for (var i = 0; i < ОтветСервера.Пользователи.length; i++) {
                ГотовыйСписок.rows.push({
                    id: i + 1,
                    data: [ОтветСервера.Пользователи[i].Имя, Справочники.Роли[ОтветСервера.Пользователи[i].Роль]]
                });
            }
            return ГотовыйСписок;
        },
        Сохранить: function (Имя, Пароль, Роль) {
            var Параметры = {
                login: Имя,
                password: Пароль,
                role: Роль
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/add_user", Параметры, null));
            return ОтветСервера;
        },

        НазначитьОрганизацию: function (Имя, Организация) {
            var Параметры = {
                login: Имя,
                org: Организация
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/set_user_org", Параметры, null));
            return ОтветСервера;
        }
    },
    Организации: {
        Список: function () {
            var ГотовыйСписок = {
                rows: []
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_org_list", {}, null));
            window.СписокОрганизаций = ОтветСервера.Организации;
            for (var i = 0; i < ОтветСервера.Организации.length; i++) {
                ГотовыйСписок.rows.push({
                    id: i + 1,
                    data: [ОтветСервера.Организации[i].Название, ОтветСервера.Организации[i].Код]
                });
            }
            return ГотовыйСписок;
        },
        Сохранить: function (Название, Код) {
            var Параметры = {
                name: Название,
                code: Код
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/add_org", Параметры, null));
            return ОтветСервера;
        }
    },
    Группы: {
        Список: function () {
            var ГотовыйСписок = {
                rows: []
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_group_list", {}, null));
            window.СписокГрупп = ОтветСервера.Группы;
            for (var i = 0; i < ОтветСервера.Группы.length; i++) {
                ГотовыйСписок.rows.push({
                    id: i + 1,
                    data: [ОтветСервера.Группы[i].Название, ОтветСервера.Группы[i].Код]
                });
            }
            return ГотовыйСписок;
        },
        Сохранить: function (Название, Код) {
            var Параметры = {
                name: Название,
                code: Код
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/add_group", Параметры, null));
            return ОтветСервера;
        },
        СоставГруппы: function (Код) {
            var ГотовыйСписок = {
                rows: []
            };
            var Параметры = {
                code: Код
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/get_group_users", Параметры, null));
            window.СписокПользователейГруппы = ОтветСервера.Пользователи;
            for (var i = 0; i < ОтветСервера.Пользователи.length; i++) {
                ГотовыйСписок.rows.push({
                    id: i + 1,
                    data: [ОтветСервера.Пользователи[i].Имя, ОтветСервера.Пользователи[i].Организация]
                });
            }
            return ГотовыйСписок;
        },
        ДобавитьПользователя: function (Код, Имя) {
            var Параметры = {
                login: Имя,
                group: Код
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/add_group_user", Параметры, null));
            return ОтветСервера;
        },
        УбратьПользователя: function (Код, Имя) {
            var Параметры = {
                login: Имя,
                group: Код
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/role/admin/del_group_user", Параметры, null));
            return ОтветСервера;
        }
    },
    Отчеты: {
        СписокДеревоГруппы: function () {
            //должен запросить сервер и получить перечень каталогов отчетов, с указанием группы.
            //полученный список переверстать в структуру для виджета дерева в формате Группа->Отчет
            var ГотовыйСписок = [];
            var Список = [];
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/reports/list", {}, null));
            window.СписокОтчетов = [];
            for (var i = 0; i < ОтветСервера.Отчеты.length; i++) {
                window.СписокОтчетов[ОтветСервера.Отчеты[i].Название] = {
                    Принимающий: ОтветСервера.Отчеты[i].Пользователь,
                    Сдающие: {
                        Код: ОтветСервера.Отчеты[i].Группа.Код,
                        Название: ОтветСервера.Отчеты[i].Группа.Название
                    }
                }
            }
            for (var i = 0; i < ОтветСервера.Отчеты.length; i++) {
                if (ОтветСервера.Отчеты[i].Группа.Название === false) {
                    ОтветСервера.Отчеты[i].Группа.Название = "(Без группы)"
                }
                Список[ОтветСервера.Отчеты[i].Группа.Код * 1] = {
                    id: "group_" + ОтветСервера.Отчеты[i].Группа.Код,
                    text: ОтветСервера.Отчеты[i].Группа.Название,
                    open: 0,
                    items: [],
                    icons: {
                        file: "fa-folder",
                        folder_opened: "fa-folder-open",
                        folder_closed: "fa-folder"
                    },
                    icon_color:"goldenrod"
                };
            };
            for (var i = 0; i < ОтветСервера.Отчеты.length; i++) {
                Список[ОтветСервера.Отчеты[i].Группа.Код * 1].items.push({
                    id: "item_" + i,
                    text: ОтветСервера.Отчеты[i].Название,
                    icons: {
                        file: "fa-table",
                        folder_opened: "fa-table",
                        folder_closed: "fa-table"
                    },
                    icon_color:"green"
                });

            };

            if (Список.length) {
                Список.forEach(Отчет => {
                    ГотовыйСписок.push(Отчет);
                });
            }

            return ГотовыйСписок;
        },
        Создать: function (Название) {
            var Параметры = {
                name: Название
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/reports/add", Параметры, null));
            return ОтветСервера;
        },
        Сохранить: function (НовоеНазвание, ТекущееНазвание) {
            var Параметры = {
                operation: "rename",
                new: НовоеНазвание,
                current: ТекущееНазвание
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/reports/update", Параметры, null));
            return ОтветСервера;
        },
        НазначитьДоступы: function (Название, Принимающий, Сдающие) {
            var Параметры = {
                operation: "rights",
                name: Название,
                user: Принимающий,
                group: Сдающие
            };
            var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/reports/update", Параметры, null));
            return ОтветСервера;
        },
        Трафареты: {
            СписокДерево: function (НазваниеОтчета) {
                //Должен спрашивать у сервета структуру, вложенную в подкаталог Трафареты каталога отчета.
                //Сейчас хардкод на 2 стандартных
                var Список = [{
                        id: "item_0",
                        text: "Первичный.xlsx",
                        icons: {
                            file: "fa-file-excel",
                            folder_opened: "fa-file-excel",
                            folder_closed: "fa-file-excel"
                        },
                        icon_color:"green"
                    },
                    {
                        id: "item_1",
                        text: "Сводный.xlsx",
                        icons: {
                            file: "fa-file-excel",
                            folder_opened: "fa-file-excel",
                            folder_closed: "fa-file-excel"
                        },
                        icon_color:"green"
                    }
                ]

                return Список;
            }
        },
        Периоды: {
            СписокДерево: function (НазваниеОтчета) {
                //должен запросить сервер и получить перечень каталогов периодов отчетов, с указанием RO RW.
                //полученный список переверстать в структуру для виджета дерева в формате Режим->Период
                var ГотовыйСписок = [];
                var Список = [{
                        id: "closed",
                        text: "Закрытые",
                        items: [],
                        open: 0,
                        icons: {
                            file: "fa-lock",
                            folder_opened: "fa-lock",
                            folder_closed: "fa-lock"
                        },
                        icon_color:"#fd7e14"
                    },
                    {
                        id: "opened",
                        text: "Открытые",
                        items: [],
                        open: 1,
                        icons: {
                            file: "fa-lock-open",
                            folder_opened: "fa-lock-open",
                            folder_closed: "fa-lock-open"
                        },
                        icon_color:"#fd7e14"
                    }
                ];
                var Параметры = {
                    report: НазваниеОтчета
                };
                var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/periods/list", Параметры, null));

                for (var i = 0; i < ОтветСервера.Периоды.length; i++) {
                    switch (ОтветСервера.Периоды[i].Права.Запись) {
                        case true:
                            {
                                Список[1].items.push({
                                    id: "item_" + i,
                                    text: ОтветСервера.Периоды[i].Название,
                        icons: {
                            file: "fa-calendar",
                            folder_opened: "fa-calendar",
                            folder_closed: "fa-calendar"
                        },
                        icon_color:"blue"
                                });
                                break;
                            }
                        case false:
                            {
                                Список[0].items.push({
                                    id: "item_" + i,
                                    text: ОтветСервера.Периоды[i].Название,
                                    icons: {
                                        file: "fa-calendar",
                                        folder_opened: "fa-calendar",
                                        folder_closed: "fa-calendar"
                                    },
                                    icon_color:"blue"
                                });
                                break;
                            }
                    }
                };
                
                if (Список.length) {
                    Список.forEach(Группа => {
                        ГотовыйСписок.push(Группа);
                    });
                }

                return ГотовыйСписок;
            },
            Создать: function (Отчет, НазваниеПериода) {
                var Параметры = {
                    report: Отчет,
                    name: НазваниеПериода
                };
                var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/periods/add", Параметры, null));
                return ОтветСервера;
            },
            Сохранить: function (Отчет, НовоеНазвание, ТекущееНазвание) {
                var Параметры = {
                    operation: "rename",
                    report: Отчет,
                    new: НовоеНазвание,
                    current: ТекущееНазвание
                };
                var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/periods/update", Параметры, null));
                return ОтветСервера;
            },
            НазначитьДоступ: function (Отчет, НазваниеПериода, Доступ){
                var Параметры = {
                    operation: "rights",
                    report: Отчет,
                    period: НазваниеПериода,
                    access: Доступ
                };
                var ОтветСервера = JSON.parse(ЗапросыАПИ.GET.Sync("/documents/periods/update", Параметры, null));
                return ОтветСервера;
            }
        },
        ДокументПоТрафарету: function (Отчет, НазваниеПериода){
            var Параметры = {
                report: Отчет,
                period: НазваниеПериода
            };
            var ОтветСервера = ЗапросыАПИ.GET.Sync("/documents/document/copy", Параметры, null);
            return ОтветСервера;
        }
    
    },

}