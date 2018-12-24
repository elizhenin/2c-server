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
                            id: "useredit" + id_salt_useradd,
                            text: "Создать Пользователя",
                            left: 10,
                            top: 10,
                            width: "300",
                            height: "250",
                            center: true,
                            resize: true
                        });
                        ФормыОкон[id_salt_useradd] = Окна.window("useredit" + id_salt_useradd).attachForm();
                        ФормыОкон[id_salt_useradd].loadStruct("/views/admin/user_edit_form.json", "json");
                        ФормыОкон[id_salt_useradd].attachEvent("onButtonClick", function (id) {
                            switch (id) {
                                case "save":
                                    {
                                        var Имя = ФормыОкон[id_salt_useradd].getInput("login").value;
                                        var Пароль = ФормыОкон[id_salt_useradd].getInput("password").value;
                                        var Роль = ФормыОкон[id_salt_useradd].getSelect("role").value;
                                        var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                        Окна.window("useredit" + id_salt_useradd).close();
                                        ФормыОкон[id_salt_useradd] = false;
                                        СписокПользователей.clearAll();
                                        СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
                                        break;
                                    }
                                default:
                                    {}
                            }
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
                id: "useredit" + id_salt_useredit,
                text: "Править Пользователя",
                left: 10,
                top: 10,
                width: "300",
                height: "250",
                center: true,
                resize: true
            });
            ФормыОкон[id_salt_useredit] = Окна.window("useredit" + id_salt_useredit).attachForm();
            ФормыОкон[id_salt_useredit].loadStruct("/views/admin/user_edit_form.json", "json", function () {
                ФормыОкон[id_salt_useredit].getInput("login").value = window.СписокПользователей[id].Имя;
                ФормыОкон[id_salt_useredit].setReadonly("login", true);
                ФормыОкон[id_salt_useredit].setItemValue("role", window.СписокПользователей[id].Роль);
                var ВариантыОрганизаций = [];
                ЗапросыАПИ.Организации.Список().rows.forEach(element => {
                    Item = {
                        "value": element.data[0],
                        "text": element.data[0]
                    };
                    ВариантыОрганизаций.push(Item);
                });
                if (ФормыОкон[id_salt_useredit].getSelect("role").value == 'sender') {
                    ФормыОкон[id_salt_useredit].addItem(null, {
                        "name": "org",
                        "type": "select",
                        "label": "Организация",
                        "options": ВариантыОрганизаций
                    }, 3, 2);
                    ФормыОкон[id_salt_useredit].setItemValue("org", window.СписокПользователей[id].Организации[0]);
                }
            });

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

        var СписокОрганизаций = InterfaceLayout.cells("b").attachGrid();
        СписокОрганизаций.setHeader("Организация");
        СписокОрганизаций.setColTypes("ro");
        СписокОрганизаций.init();
        СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(), "json");
        СписокОрганизаций.attachEvent("onRowDblClicked", function (id, cell) {
            console.log(id);
            console.log(cell);
        });

        var СписокГрупп = InterfaceLayout.cells("c").attachGrid();
        СписокГрупп.setHeader("Группа");
        СписокГрупп.setColTypes("ro");
        СписокГрупп.init();
        СписокГрупп.parse(ЗапросыАПИ.Группы.Список(), "json");
        СписокГрупп.attachEvent("onRowDblClicked", function (id, cell) {
            console.log(id);
            console.log(cell);
        });

    });

});