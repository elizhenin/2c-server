if (typeof (window.Справочники) == "undefined") window.Справочники = {};
window.Справочники.Роли = JSON.parse(ЗагрузитьФайлСинхронно("/views/subtitles/roles.json"));

document.addEventListener('DOMContentLoaded', function () {
    ЗагрузитьМодуль("menubar");
    ГлавноеМеню(Хранилище.getItem("РольПользователя"), "right");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/" + Хранилище.getItem("РольПользователя") + "/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function () {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        window.Окна = new dhtmlXWindows();
        Окна.attachViewportTo("body");
        window.ФормыОкон = {};
        var МенюПользователей = InterfaceLayout.cells("a").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                    "id": "create",
                    "text": "Создать"
                }]
            }
        });

        МенюПользователей.attachEvent("onClick", function (id) {
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
                        ФормыОкон[id_salt_useradd].loadStruct("/views/admin/user_edit_form.json", "json", function(){
                            ФормыОкон[id_salt_useradd].attachEvent("onButtonClick", function (id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Имя = ФормыОкон[id_salt_useradd].getInput("login").value;
                                            var Пароль = ФормыОкон[id_salt_useradd].getInput("password").value;
                                            var Роль = ФормыОкон[id_salt_useradd].getSelect("role").value;
                                            var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                            Окна.window(id_salt_useradd).close();
                                            ФормыОкон[id_salt_useradd] = false;
                                            СписокПользователей.clearAll();
                                            СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
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

        var МенюОрганизаций = InterfaceLayout.cells("b").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                    "id": "create",
                    "text": "Создать"
                }]
            }
        });

        МенюОрганизаций.attachEvent("onClick", function (id) {
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
                        ФормыОкон[id_salt_orgadd].loadStruct("/views/admin/org_edit_form.json", "json", function(){
                            ФормыОкон[id_salt_orgadd].attachEvent("onButtonClick", function (id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Название = ФормыОкон[id_salt_orgadd].getInput("name").value;
                                            var Результат = ЗапросыАПИ.Организации.Сохранить(Название, false);
                                            Окна.window(id_salt_orgadd).close();
                                            ФормыОкон[id_salt_orgadd] = false;
                                            СписокОрганизаций.clearAll();
                                            СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
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

        МенюГрупп.attachEvent("onClick", function (id) {
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
                        ФормыОкон[id_salt_groupadd].loadStruct("/views/admin/group_edit_form.json", "json", function(){
                            ФормыОкон[id_salt_groupadd].attachEvent("onButtonClick", function (id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Название = ФормыОкон[id_salt_groupadd].getInput("name").value;
                                            var Результат = ЗапросыАПИ.Группы.Сохранить(Название, false);
                                            Окна.window(id_salt_groupadd).close();
                                            ФормыОкон[id_salt_groupadd] = false;
                                            СписокОрганизаций.clearAll();
                                            СписокОрганизаций.parse(ЗапросыАПИ.Группы.Список(), "json");
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
        var СписокПользователей = InterfaceLayout.cells("a").attachGrid();
        СписокПользователей.setHeader("Имя входа,Роль");
        СписокПользователей.setInitWidths("200,*");
        СписокПользователей.setColTypes("ro,ro");
        СписокПользователей.init();
        СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
        СписокПользователей.attachEvent("onRowDblClicked", function (id, cell) {
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
            ФормыОкон[id_salt_useredit].loadStruct("/views/admin/user_edit_form.json", "json", function () {
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
                        "value":window.СписокПользователей[id].Организации[0]
                    }, 3, 2);
                }
                ФормыОкон[id_salt_useredit].attachEvent("onButtonClick", function (id) {
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
                                Окна.window("useredit" + id_salt_useredit).close();
                                ФормыОкон[id_salt_useredit] = false;
                                СписокПользователей.clearAll();
                                СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
                                break;
                            }
                        default:
                            {}
                    }
                });
            });
        });

        var СписокОрганизаций = InterfaceLayout.cells("b").attachGrid();
        СписокОрганизаций.setHeader("Организация,Код");
        СписокОрганизаций.setInitWidths("*,100");
        СписокОрганизаций.setColTypes("ro,ro");
        СписокОрганизаций.init();
        СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
        СписокОрганизаций.attachEvent("onRowDblClicked", function (id, cell) {
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
            ФормыОкон[id_salt_orgedit].loadStruct("/views/admin/org_edit_form.json", "json",function(){
                ФормыОкон[id_salt_orgedit].setItemValue("name", window.СписокОрганизаций[id].name);
                ФормыОкон[id_salt_orgedit].setReadonly("code", true);
                ФормыОкон[id_salt_orgedit].addItem(null, {
                    "name": "code",
                    "type": "input",
                    "hidden": true,
                    "value": window.СписокОрганизаций[id].code
                });   
                ФормыОкон[id_salt_orgedit].attachEvent("onButtonClick", function (id) {
                    switch (id) {
                        case "save":
                            {
                                var Название = ФормыОкон[id_salt_orgedit].getInput("name").value;
                                var Код = ФормыОкон[id_salt_orgedit].getInput("code").value;
                                var Результат = ЗапросыАПИ.Организации.Сохранить(Название, Код);
                                Окна.window(id_salt_orgedit).close();
                                ФормыОкон[id_salt_orgedit] = false;
                                СписокОрганизаций.clearAll();
                                СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
                                break;
                            }
                        default:
                            {}
                    }
                });
            });
        });

        var СписокГрупп = InterfaceLayout.cells("c").attachGrid();
        СписокГрупп.setHeader("Группа,Код");
        СписокГрупп.setInitWidths("*,100");
        СписокГрупп.setColTypes("ro,ro");
        СписокГрупп.init();
        СписокГрупп.parse(ЗапросыАПИ.Группы.Список(), "json");
        СписокГрупп.attachEvent("onRowDblClicked", function (id, cell) {
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
            ФормыОкон[id_salt_groupedit].loadStruct("/views/admin/group_edit_form.json", "json",function(){
                ФормыОкон[id_salt_groupedit].setItemValue("name", window.СписокГрупп[id].name);
                ФормыОкон[id_salt_groupedit].setReadonly("code", true);
                ФормыОкон[id_salt_groupedit].addItem(null, {
                    "name": "code",
                    "type": "input",
                    "hidden": true,
                    "value": window.СписокГрупп[id].code
                });   
                ФормыОкон[id_salt_groupedit].attachEvent("onButtonClick", function (id) {
                    switch (id) {
                        case "save":
                            {
                                var Название = ФормыОкон[id_salt_groupedit].getInput("name").value;
                                var Код = ФормыОкон[id_salt_groupedit].getInput("code").value;
                                var Результат = ЗапросыАПИ.Группы.Сохранить(Название, Код);
                                Окна.window(id_salt_groupedit).close();
                                ФормыОкон[id_salt_groupedit] = false;
                                СписокГрупп.clearAll();
                                СписокГрупп.parse(ЗапросыАПИ.Группы.Список(), "json");
                                break;
                            }
                        default:
                            {}
                    }
                });
            });
        });

    });

});