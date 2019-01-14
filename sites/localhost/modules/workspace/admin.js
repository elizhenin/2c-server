if (typeof(window.Справочники) == "undefined") window.Справочники = {};
window.Справочники.Роли = JSON.parse(ЗагрузитьФайлСинхронно("/views/subtitles/roles.json"));

document.addEventListener('DOMContentLoaded', function() {
    ЗагрузитьМодуль("menubar");
    ГлавноеМеню(Хранилище.getItem("РольПользователя"), "right");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/" + Хранилище.getItem("РольПользователя") + "/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function() {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        window.Окна = new dhtmlXWindows();
        Окна.attachViewportTo("body");
        window.ФормыОкон = {};
        window.ТаблицыЭкрана = {};
        var МенюПользователей = InterfaceLayout.cells("b").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                    "id": "create",
                    "text": "Создать"
                }]
            }
        });

        МенюПользователей.attachEvent("onClick", function(id) {
            switch (id) {
                case "create":
                    {
                        var id_salt_useradd = Math.random() + "";
                        Окна.createWindow({
                            id: id_salt_useradd,
                            text: "Создать Пользователя",
                            left: 10,
                            top: 10,
                            width: "400",
                            height: "250",
                            center: true,
                            resize: true
                        });
                        ФормыОкон[id_salt_useradd] = Окна.window(id_salt_useradd).attachForm();
                        ФормыОкон[id_salt_useradd].loadStruct("/views/admin/user_edit_form.json", "json", function() {
                            ФормыОкон[id_salt_useradd].attachEvent("onButtonClick", function(id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Имя = ФормыОкон[id_salt_useradd].getInput("login").value;
                                            var Пароль = ФормыОкон[id_salt_useradd].getInput("password").value;
                                            var Роль = ФормыОкон[id_salt_useradd].getSelect("role").value;
                                            var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                            Окна.window(id_salt_useradd).close();
                                            ФормыОкон[id_salt_useradd] = false;
                                            ТаблицыЭкрана.СписокПользователей.clearAll();
                                            ТаблицыЭкрана.СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
                                            break;
                                        }
                                    default:
                                        {}
                                }
                            });
                        });

                        break;
                    }

                default:
                    {}
            }
        });

        var МенюОрганизаций = InterfaceLayout.cells("a").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                    "id": "create",
                    "text": "Создать"
                }]
            }
        });

        МенюОрганизаций.attachEvent("onClick", function(id) {
            switch (id) {
                case "create":
                    {
                        var id_salt_orgadd = Math.random() + "";
                        Окна.createWindow({
                            id: id_salt_orgadd,
                            text: "Добавить организацию",
                            left: 10,
                            top: 10,
                            width: "400",
                            height: "150",
                            center: true,
                            resize: true
                        });
                        ФормыОкон[id_salt_orgadd] = Окна.window(id_salt_orgadd).attachForm();
                        ФормыОкон[id_salt_orgadd].loadStruct("/views/admin/org_edit_form.json", "json", function() {
                            ФормыОкон[id_salt_orgadd].attachEvent("onButtonClick", function(id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Название = ФормыОкон[id_salt_orgadd].getInput("name").value;
                                            var Результат = ЗапросыАПИ.Организации.Сохранить(Название, false);
                                            Окна.window(id_salt_orgadd).close();
                                            ФормыОкон[id_salt_orgadd] = false;
                                            ТаблицыЭкрана.СписокОрганизаций.clearAll();
                                            ТаблицыЭкрана.СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
                                            break;
                                        }
                                    default:
                                        {}
                                }
                            });
                        });

                        break;
                    }

                default:
                    {}
            }
        });

        var МенюГрупп = InterfaceLayout.cells("c").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                    "id": "create",
                    "text": "Создать"
                }]
            }
        });

        МенюГрупп.attachEvent("onClick", function(id) {
            switch (id) {
                case "create":
                    {
                        var id_salt_groupadd = Math.random() + "";
                        Окна.createWindow({
                            id: id_salt_groupadd,
                            text: "Добавить группу",
                            left: 10,
                            top: 10,
                            width: "400",
                            height: "150",
                            center: true,
                            resize: true
                        });
                        ФормыОкон[id_salt_groupadd] = Окна.window(id_salt_groupadd).attachForm();
                        ФормыОкон[id_salt_groupadd].loadStruct("/views/admin/group_edit_form.json", "json", function() {
                            ФормыОкон[id_salt_groupadd].attachEvent("onButtonClick", function(id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Название = ФормыОкон[id_salt_groupadd].getInput("name").value;
                                            var Результат = ЗапросыАПИ.Группы.Сохранить(Название, false);
                                            Окна.window(id_salt_groupadd).close();
                                            ФормыОкон[id_salt_groupadd] = false;
                                            ТаблицыЭкрана.СписокГрупп.clearAll();
                                            ТаблицыЭкрана.СписокГрупп.parse(ЗапросыАПИ.Группы.Список(), "json");
                                            break;
                                        }
                                    default:
                                        {}
                                }
                            });
                        });

                        break;
                    }

                default:
                    {}
            }
        });

        var МенюПользователейГруппы = InterfaceLayout.cells("d").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                        "id": "add",
                        "text": "Добавить",
                        "disabled": true
                    },
                    {
                        "id": "del",
                        "text": "Убрать",
                        "disabled": true
                    }
                ]
            }
        });
        МенюПользователейГруппы.attachEvent("onClick", function(id) {
            switch (id) {
                case "add":
                    {
                        var Пользователь = ТаблицыЭкрана.СписокПользователей.getSelectedId();
                        Пользователь--;
                        var Группа = ТаблицыЭкрана.СписокГрупп.getSelectedId();
                        Группа--;
                        try{
                            
                        if(window.СписокПользователей[Пользователь].Роль == "sender"){
                         ЗапросыАПИ.Группы.ДобавитьПользователя(window.СписокГрупп[Группа].Код, window.СписокПользователей[Пользователь].Имя);
                         ТаблицыЭкрана.СписокПользователейГруппы.clearAll(); 
                         ТаблицыЭкрана.СписокПользователейГруппы.parse(ЗапросыАПИ.Группы.СоставГруппы(Хранилище.getItem("ВыбраннаяГруппа")), "json");
                        }
                        else{alert("Только пользователи роли сдающего отчеты могут быть добавлены в группы")};
                        }catch(e){
                            alert("Выберите пользователя в списке пользователей");
                        }
                        break;
                    }
                case "del":
                    {
                        var Пользователь = ТаблицыЭкрана.СписокПользователейГруппы.getSelectedId();
                        Пользователь--;
                        var Группа = ТаблицыЭкрана.СписокГрупп.getSelectedId();
                        Группа--;
                        try{
                         ЗапросыАПИ.Группы.УбратьПользователя(window.СписокГрупп[Группа].Код, window.СписокПользователейГруппы[Пользователь].Имя);
                         ТаблицыЭкрана.СписокПользователейГруппы.clearAll(); 
                         ТаблицыЭкрана.СписокПользователейГруппы.parse(ЗапросыАПИ.Группы.СоставГруппы(Хранилище.getItem("ВыбраннаяГруппа")), "json");
                        }catch(e){
                            alert("Выберите пользователя в списке");
                        }
                        break;
                    }
                default:
                    {}
            }
        });

        ТаблицыЭкрана.СписокПользователей = InterfaceLayout.cells("b").attachGrid();
        ТаблицыЭкрана.СписокПользователей.setHeader("Имя входа,Роль");
        ТаблицыЭкрана.СписокПользователей.setInitWidths("200,*");
        ТаблицыЭкрана.СписокПользователей.setColTypes("ro,ro");
        ТаблицыЭкрана.СписокПользователей.init();
        ТаблицыЭкрана.СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
        ТаблицыЭкрана.СписокПользователей.attachEvent("onRowDblClicked", function(id, cell) {
            var id_salt_useredit = Math.random() + "";
            id--;
            Окна.createWindow({
                id: id_salt_useredit,
                text: "Править Пользователя",
                left: 10,
                top: 10,
                width: "400",
                height: "250",
                center: true,
                resize: true
            });
            ФормыОкон[id_salt_useredit] = Окна.window(id_salt_useredit).attachForm();
            ФормыОкон[id_salt_useredit].loadStruct("/views/admin/user_edit_form.json", "json", function() {
                ФормыОкон[id_salt_useredit].getInput("login").value = window.СписокПользователей[id].Имя;
                ФормыОкон[id_salt_useredit].setReadonly("login", true);
                ФормыОкон[id_salt_useredit].setItemValue("role", window.СписокПользователей[id].Роль);
                var ВариантыОрганизаций = [];
                ЗапросыАПИ.Организации.Список().rows.forEach(element => {
                    Item = {
                        "value": element.data[1],
                        "text": element.data[0]
                    };
                    ВариантыОрганизаций.push(Item);
                });
                if (ФормыОкон[id_salt_useredit].getSelect("role").value == 'sender') {
                    ФормыОкон[id_salt_useredit].addItem(null, {
                        "name": "org",
                        "type": "select",
                        "label": "Организация",
                        "options": ВариантыОрганизаций,
                        "value": window.СписокПользователей[id].Организация
                    }, 3, 2);
                }
                ФормыОкон[id_salt_useredit].attachEvent("onButtonClick", function(id) {
                    switch (id) {
                        case "save":
                            {
                                var Имя = ФормыОкон[id_salt_useredit].getInput("login").value;
                                var Пароль = ФормыОкон[id_salt_useredit].getInput("password").value;
                                var Роль = ФормыОкон[id_salt_useredit].getSelect("role").value;
                                var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                if (ФормыОкон[id_salt_useredit].getSelect("org") != null) {
                                    var Организация = ФормыОкон[id_salt_useredit].getSelect("org").value;
                                    Результат += ЗапросыАПИ.Пользователи.НазначитьОрганизацию(Имя, Организация);
                                }
                                Окна.window(id_salt_useredit).close();
                                ФормыОкон[id_salt_useredit] = false;
                                ТаблицыЭкрана.СписокПользователей.clearAll();
                                ТаблицыЭкрана.СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
                                break;
                            }
                        default:
                            {}
                    }
                });
            });
        });

        ТаблицыЭкрана.СписокОрганизаций = InterfaceLayout.cells("a").attachGrid();
        ТаблицыЭкрана.СписокОрганизаций.setHeader("Организация,Код");
        ТаблицыЭкрана.СписокОрганизаций.setInitWidths("*,100");
        ТаблицыЭкрана.СписокОрганизаций.setColTypes("ro,ro");
        ТаблицыЭкрана.СписокОрганизаций.init();
        ТаблицыЭкрана.СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
        ТаблицыЭкрана.СписокОрганизаций.attachEvent("onRowDblClicked", function(id, cell) {
            id--;
            var id_salt_orgedit = Math.random() + "";
            Окна.createWindow({
                id: id_salt_orgedit,
                text: "Редактировать организацию",
                left: 10,
                top: 10,
                width: "400",
                height: "150",
                center: true,
                resize: true
            });
            ФормыОкон[id_salt_orgedit] = Окна.window(id_salt_orgedit).attachForm();
            ФормыОкон[id_salt_orgedit].loadStruct("/views/admin/org_edit_form.json", "json", function() {
                ФормыОкон[id_salt_orgedit].setItemValue("name", window.СписокОрганизаций[id].Название);
                ФормыОкон[id_salt_orgedit].setReadonly("code", true);
                ФормыОкон[id_salt_orgedit].addItem(null, {
                    "name": "code",
                    "type": "input",
                    "hidden": true,
                    "value": window.СписокОрганизаций[id].Код
                });
                ФормыОкон[id_salt_orgedit].attachEvent("onButtonClick", function(id) {
                    switch (id) {
                        case "save":
                            {
                                var Название = ФормыОкон[id_salt_orgedit].getInput("name").value;
                                var Код = ФормыОкон[id_salt_orgedit].getInput("code").value;
                                var Результат = ЗапросыАПИ.Организации.Сохранить(Название, Код);
                                Окна.window(id_salt_orgedit).close();
                                ФормыОкон[id_salt_orgedit] = false;
                                ТаблицыЭкрана.СписокОрганизаций.clearAll();
                                ТаблицыЭкрана.СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
                                break;
                            }
                        default:
                            {}
                    }
                });
            });
        });

        ТаблицыЭкрана.СписокГрупп = InterfaceLayout.cells("c").attachGrid();
        ТаблицыЭкрана.СписокГрупп.setHeader("Группа,Код");
        ТаблицыЭкрана.СписокГрупп.setInitWidths("*,100");
        ТаблицыЭкрана.СписокГрупп.setColTypes("ro,ro");
        ТаблицыЭкрана.СписокГрупп.init();
        ТаблицыЭкрана.СписокГрупп.parse(ЗапросыАПИ.Группы.Список(), "json");
        ТаблицыЭкрана.СписокГрупп.attachEvent("onRowDblClicked", function(id, cell) {
            id--;
            var id_salt_groupedit = Math.random() + "";
            Окна.createWindow({
                id: id_salt_groupedit,
                text: "Редактировать группу",
                left: 10,
                top: 10,
                width: "400",
                height: "150",
                center: true,
                resize: true
            });
            ФормыОкон[id_salt_groupedit] = Окна.window(id_salt_groupedit).attachForm();
            ФормыОкон[id_salt_groupedit].loadStruct("/views/admin/group_edit_form.json", "json", function() {
                ФормыОкон[id_salt_groupedit].setItemValue("name", window.СписокГрупп[id].Название);
                ФормыОкон[id_salt_groupedit].setReadonly("code", true);
                ФормыОкон[id_salt_groupedit].addItem(null, {
                    "name": "code",
                    "type": "input",
                    "hidden": true,
                    "value": window.СписокГрупп[id].Код
                });
                ФормыОкон[id_salt_groupedit].attachEvent("onButtonClick", function(id) {
                    switch (id) {
                        case "save":
                            {
                                var Название = ФормыОкон[id_salt_groupedit].getInput("name").value;
                                var Код = ФормыОкон[id_salt_groupedit].getInput("code").value;
                                var Результат = ЗапросыАПИ.Группы.Сохранить(Название, Код);
                                Окна.window(id_salt_groupedit).close();
                                ФормыОкон[id_salt_groupedit] = false;
                                ТаблицыЭкрана.СписокГрупп.clearAll();
                                ТаблицыЭкрана.СписокГрупп.parse(ЗапросыАПИ.Группы.Список(), "json");
                                break;
                            }
                        default:
                            {}
                    }
                });
            });
        });
        ТаблицыЭкрана.СписокГрупп.attachEvent("onRowSelect", function(id, cell) {
            id--;
            ТаблицыЭкрана.СписокПользователейГруппы.clearAll();
            Хранилище.setItem("ВыбраннаяГруппа",window.СписокГрупп[id].Код);
            ТаблицыЭкрана.СписокПользователейГруппы.parse(ЗапросыАПИ.Группы.СоставГруппы(window.СписокГрупп[id].Код), "json");
            МенюПользователейГруппы.setItemEnabled("add");
            МенюПользователейГруппы.setItemEnabled("del");
        });
        ТаблицыЭкрана.СписокПользователейГруппы = InterfaceLayout.cells("d").attachGrid();
        ТаблицыЭкрана.СписокПользователейГруппы.setHeader("Имя,Код");
        ТаблицыЭкрана.СписокПользователейГруппы.setInitWidths("200,*");
        ТаблицыЭкрана.СписокПользователейГруппы.setColTypes("ro,ro");
        ТаблицыЭкрана.СписокПользователейГруппы.init();
    });

});