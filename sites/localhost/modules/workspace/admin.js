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
        var МенюПользователей = InterfaceLayout.cells("a").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                        "id": "create",
                        "text": "Создать"
                    },
                    {
                        "id": "change",
                        "text": "Изменить"
                    }
                ]
            }
        });

        МенюПользователей.attachEvent("onClick", function (id) {
            switch (id) {
                case "create":
                    {
                        var id_salt = Math.random() +"";
                        Окна.createWindow({
                            id: "useredit"+id_salt,
                            text: "Создать Пользователя",
                            left: 10,
                            top: 10,
                            width: "300",
                            height: "250",
                            center: true,
                            resize: true
                        });
                        РедакторПользователя = Окна.window("useredit"+id_salt).attachForm();
                        РедакторПользователя.loadStruct("/views/admin/user_edit_form.json", "json");
                        РедакторПользователя.attachEvent("onButtonClick", function (id) {
                            switch (id) {
                                case "save":
                                    {
                                        var Имя = РедакторПользователя.getInput("login").value;
                                        var Пароль = РедакторПользователя.getInput("password").value;
                                        var Роль = РедакторПользователя.getInput("role").value;
                                        //var Результат = ЗапросыАПИ.Пользователи.Сохранить(Имя, Пароль, Роль);
                                        Окна.window("useredit"+id_salt).close();
                                    }
                                default:
                                    {}
                            }
                        });

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
            console.log(id);
            console.log(cell);
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