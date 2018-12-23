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
                    }
                ]
            }
        });

        МенюПользователей.attachEvent("onClick", function (id) {
            switch (id) {
                case "create":
                    {
                        var id_salt = Math.random() + "";
                        Окна.createWindow({
                            id: "useredit" + id_salt,
                            text: "Создать Пользователя",
                            left: 10,
                            top: 10,
                            width: "300",
                            height: "250",
                            center: true,
                            resize: true
                        });
                        ФормыОкон[id_salt] = Окна.window("useredit" + id_salt).attachForm();
                        ФормыОкон[id_salt].loadStruct("/views/admin/user_edit_form.json", "json");
                        ФормыОкон[id_salt].attachEvent("onButtonClick", function (id) {
                            switch (id) {
                                case "save":
                                    {
                                        var Имя = ФормыОкон[id_salt].getInput("login").value;
                                        var Пароль = ФормыОкон[id_salt].getInput("password").value;
                                        var Роль = ФормыОкон[id_salt].getSelect("role").value;
                                        var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                        Окна.window("useredit" + id_salt).close();
                                        СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(), "json");
                                        ФормыОкон[id_salt] = false;
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
                var id_salt = Math.random() + "";
                Окна.createWindow({
                    id: "useredit" + id_salt,
                    text: "Править Пользователя",
                    left: 10,
                    top: 10,
                    width: "300",
                    height: "250",
                    center: true,
                    resize: true
                });
                ФормыОкон[id_salt] = Окна.window("useredit" + id_salt).attachForm();
                ФормыОкон[id_salt].loadStruct("/views/admin/user_edit_form.json", "json", function(){
                    ФормыОкон[id_salt].getInput("login").value = СписокПользователей.cellByIndex(id, 0).getValue();
                    ФормыОкон[id_salt].setReadonly("login", true);
                    ФормыОкон[id_salt].setItemValue("role",Справочники.Роли[СписокПользователей.cellByIndex(id, 1).getValue()]);
                });
                
               
                ФормыОкон[id_salt].attachEvent("onButtonClick", function (id) {
                    switch (id) {
                        case "save":
                            {
                                var Имя = ФормыОкон[id_salt].getInput("login").value;
                                var Пароль = ФормыОкон[id_salt].getInput("password").value;
                                var Роль = ФормыОкон[id_salt].getSelect("role").value;
                                var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                Окна.window("useredit" + id_salt).close();
                                ФормыОкон[id_salt] = false;
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