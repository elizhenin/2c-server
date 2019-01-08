if (typeof(window.Справочники) == "undefined") window.Справочники = {};
window.Справочники.Роли = JSON.parse(ЗагрузитьФайлСинхронно("/views/subtitles/roles.json"));
document.addEventListener('DOMContentLoaded', function () {
    ЗагрузитьМодуль("menubar");
    ГлавноеМеню(Хранилище.getItem("РольПользователя"), "right");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/" + Хранилище.getItem("РольПользователя") + "/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function () {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        InterfaceLayout.cells("a").setWidth(Math.round(document.body.clientWidth / 3));

        window.Окна = new dhtmlXWindows();
        Окна.attachViewportTo("body");
        window.ФормыОкон = {};
        window.ТаблицыЭкрана = {};

        var МенюОтчетов = InterfaceLayout.cells("a").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                        "id": "create",
                        "text": "Создать"
                    },
                    {
                        "id": "edit",
                        "text": "Править"
                    },
                    {
                        "id": "rights",
                        "text": "Права"
                    }
                ]
            }
        });
        МенюОтчетов.attachEvent("onClick", function (id) {
            switch (id) {
                case "create":
                    {
                        var id_salt_reportadd = Math.random() + "";
                        Окна.createWindow({
                            id: id_salt_reportadd,
                            text: "Создать Отчет",
                            left: 10,
                            top: 10,
                            width: "400",
                            height: "150",
                            center: true,
                            resize: true
                        });
                        ФормыОкон[id_salt_reportadd] = Окна.window(id_salt_reportadd).attachForm();
                        ФормыОкон[id_salt_reportadd].loadStruct("/views/editor/report_edit_form.json", "json", function () {
                            ФормыОкон[id_salt_reportadd].attachEvent("onButtonClick", function (id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Название = ФормыОкон[id_salt_reportadd].getInput("name").value;
                                            ЗапросыАПИ.Отчеты.Создать(Название);
                                            Окна.window(id_salt_reportadd).close();
                                            ФормыОкон[id_salt_reportadd] = false;
                                            ТаблицыЭкрана.СписокОтчетов.unload();
                                            ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
                                                multiselect: false, // boolean, optional, enables multiselect
                                                checkboxes: false, // boolean, optional, enables checkboxes
                                                dnd: true, // boolean, optional, enables drag-and-drop
                                                items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
                                            });
                                            break;
                                        }
                                    default:
                                        {}
                                }
                            });
                        });

                        break;
                    }
                case "edit":
                    {
                        try {
                            if (ТаблицыЭкрана.СписокОтчетов.getSelectedId().startsWith("item_")) {
                                var id_salt_reportedit = Math.random() + "";
                                Окна.createWindow({
                                    id: id_salt_reportedit,
                                    text: "Переименовать Отчет",
                                    left: 10,
                                    top: 10,
                                    width: "400",
                                    height: "150",
                                    center: true,
                                    resize: true
                                });
                                ФормыОкон[id_salt_reportedit] = Окна.window(id_salt_reportedit).attachForm();
                                ФормыОкон[id_salt_reportedit].loadStruct("/views/editor/report_edit_form.json", "json", function () {
                                    ФормыОкон[id_salt_reportedit].setItemValue("name", ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()));
                                    ФормыОкон[id_salt_reportedit].addItem(null, {
                                        "name": "current",
                                        "type": "input",
                                        "hidden": true,
                                        "value": ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId())
                                    });
                                    ФормыОкон[id_salt_reportedit].attachEvent("onButtonClick", function (id) {
                                        switch (id) {
                                            case "save":
                                                {
                                                    var НовоеНазвание = ФормыОкон[id_salt_reportedit].getInput("name").value;
                                                    var ТекущееНазвание = ФормыОкон[id_salt_reportedit].getInput("current").value;
                                                    ЗапросыАПИ.Отчеты.Сохранить(НовоеНазвание, ТекущееНазвание);
                                                    Окна.window(id_salt_reportedit).close();
                                                    ФормыОкон[id_salt_reportedit] = false;
                                                    ТаблицыЭкрана.СписокОтчетов.unload();
                                                    ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
                                                        multiselect: false, // boolean, optional, enables multiselect
                                                        checkboxes: false, // boolean, optional, enables checkboxes
                                                        dnd: true, // boolean, optional, enables drag-and-drop
                                                        items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
                                                    });
                                                    break;
                                                }
                                            default:
                                                {}
                                        }
                                    });
                                });
                            } else {
                                alert("Выберите отчет")
                            }
                        } catch (e) {}

                        break;
                    }
                case "rights":
                    {
                        try {
                            if (ТаблицыЭкрана.СписокОтчетов.getSelectedId().startsWith("item_")) {
                                var id_salt_reportrights = Math.random() + "";
                                Окна.createWindow({
                                    id: id_salt_reportrights,
                                    text: "Права доступа",
                                    left: 10,
                                    top: 10,
                                    width: "400",
                                    height: "250",
                                    center: true,
                                    resize: true
                                });
                                ФормыОкон[id_salt_reportrights] = Окна.window(id_salt_reportrights).attachForm();
                                ФормыОкон[id_salt_reportrights].loadStruct("/views/editor/report_rights_form.json", "json", function () {
                                    ФормыОкон[id_salt_reportrights].setItemValue("name", ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()));
                                    ФормыОкон[id_salt_reportrights].setReadonly("name", true);
                                    var ВариантыПользователей = [];
                                    ЗапросыАПИ.Пользователи.Список().rows.forEach(element => {
                                        Item = {
                                            "value": element.data[0],
                                            "text": element.data[0]
                                        };
                                        if(element.data[1] == "Принимающий"){
                                            ВариантыПользователей.push(Item);
                                        }
                                    });
                                    ФормыОкон[id_salt_reportrights].addItem(null, {
                                        "name": "receiver",
                                        "type": "select",
                                        "label": "Принимающий",
                                        "options": ВариантыПользователей,
                                        "value": window.СписокОтчетов[ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId())].Принимающий
                                    }, 1, 0);
                                    var ВариантыГрупп = [];
                                    ЗапросыАПИ.Группы.Список().rows.forEach(element => {
                                        Item = {
                                            "value": element.data[1],
                                            "text": element.data[0]
                                        };
                                        ВариантыГрупп.push(Item);
                                    });
                                    ФормыОкон[id_salt_reportrights].addItem(null, {
                                        "name": "sender",
                                        "type": "select",
                                        "label": "Сдающие",
                                        "options": ВариантыГрупп,
                                        "value": window.СписокОтчетов[ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId())].Сдающие.Код
                                    }, 2, 0);
                                    ФормыОкон[id_salt_reportrights].attachEvent("onButtonClick", function (id) {
                                        switch (id) {
                                            case "save":
                                                {
                                                    var Название = ФормыОкон[id_salt_reportrights].getInput("name").value;
                                                    var Принимающий = ФормыОкон[id_salt_reportrights].getSelect("receiver").value;
                                                    var Сдающие = ФормыОкон[id_salt_reportrights].getSelect("sender").value;
                                                    
                                                    ЗапросыАПИ.Отчеты.НазначитьДоступы(Название, Принимающий, Сдающие);
                                                    Окна.window(id_salt_reportrights).close();
                                                    ФормыОкон[id_salt_reportrights] = false;
                                                    ТаблицыЭкрана.СписокОтчетов.unload();
                                                    ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
                                                        multiselect: false, // boolean, optional, enables multiselect
                                                        checkboxes: false, // boolean, optional, enables checkboxes
                                                        dnd: true, // boolean, optional, enables drag-and-drop
                                                        items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
                                                    });
                                                    break;
                                                }
                                            default:
                                                {}
                                        }
                                    });
                                });
                            } else {
                                alert("Выберите отчет")
                            }
                        } catch (e) {}

                        break;
                    }
                default:
                    {}
            }
        });

        ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
            multiselect: false, // boolean, optional, enables multiselect
            checkboxes: false, // boolean, optional, enables checkboxes
            dnd: true, // boolean, optional, enables drag-and-drop
            items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
        });

    });


});