if (typeof (window.Справочники) == "undefined") window.Справочники = {};
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

        var МенюПериодов = InterfaceLayout.cells("b").attachMenu({
            items: {
                "id": "main_menu",
                "items": [{
                        "id": "create",
                        "text": "Создать"
                    },
                    {
                        "id": "edit",
                        "text": "Править"
                    }
                ]
            }
        });
        МенюПериодов.attachEvent("onClick", function (id) {
            switch (id) {
                case "create":
                    {
                        var ВвыбранныйОтчет = false;
                        try {
                            ВвыбранныйОтчет = ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId())
                        } catch (e) {
                            alert("Сначала выберите отчет");
                        }
                        if (ВвыбранныйОтчет) {
                            var id_salt_periodadd = Math.random() + "";
                            Окна.createWindow({
                                id: id_salt_periodadd,
                                text: "Добавить период",
                                left: 10,
                                top: 10,
                                width: "400",
                                height: "150",
                                center: true,
                                resize: true
                            });
                            ФормыОкон[id_salt_periodadd] = Окна.window(id_salt_periodadd).attachForm();
                            ФормыОкон[id_salt_periodadd].loadStruct("/views/receiver/period_edit_form.json", "json", function () {
                                ФормыОкон[id_salt_periodadd].addItem(null, {
                                    "name": "report",
                                    "type": "input",
                                    "hidden": true,
                                    "value": ВвыбранныйОтчет
                                });
                                ФормыОкон[id_salt_periodadd].attachEvent("onButtonClick", function (id) {
                                    switch (id) {
                                        case "save":
                                            {
                                                var Отчет = ФормыОкон[id_salt_periodadd].getInput("report").value;
                                                var НазваниеПериода = ФормыОкон[id_salt_periodadd].getInput("name").value;
                                                ЗапросыАПИ.Отчеты.Периоды.Создать(Отчет, НазваниеПериода);
                                                Окна.window(id_salt_periodadd).close();
                                                ФормыОкон[id_salt_periodadd] = false;
                                                try {
                                                    ТаблицыЭкрана.СписокПериодов.unload();
                                                } catch (e) {};
                                                if (ТаблицыЭкрана.СписокОтчетов.getSelectedId().startsWith("item_")) {
                                                    СоздатьСписокПериодов(ТаблицыЭкрана.СписокОтчетов.getSelectedId());
                                                }
                                                break;
                                            }
                                        default:
                                            {}
                                    }
                                });
                            });
                        }
                        break;
                    }
                case "edit":
                    {
                        var ВыбранныйОтчет = false;
                        var ВыбранныйПериод = false;
                        try {
                            ВыбранныйОтчет = ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId())
                        } catch (e) {
                            alert("Сначала выберите отчет");
                        }
                        try {
                            ВыбранныйПериод = ТаблицыЭкрана.СписокПериодов.getItemText(ТаблицыЭкрана.СписокПериодов.getSelectedId())
                        } catch (e) {
                            alert("Выберите период");
                        }
                        if (ВыбранныйОтчет && ВыбранныйПериод) {


                            var id_salt_periodedit = Math.random() + "";
                            Окна.createWindow({
                                id: id_salt_periodedit,
                                text: "Переименовать Период",
                                left: 10,
                                top: 10,
                                width: "400",
                                height: "150",
                                center: true,
                                resize: true
                            });
                            ФормыОкон[id_salt_periodedit] = Окна.window(id_salt_periodedit).attachForm();
                            ФормыОкон[id_salt_periodedit].loadStruct("/views/receiver/period_edit_form.json", "json", function () {
                                ФормыОкон[id_salt_periodedit].setItemValue("name", ТаблицыЭкрана.СписокПериодов.getItemText(ТаблицыЭкрана.СписокПериодов.getSelectedId()));
                                ФормыОкон[id_salt_periodedit].addItem(null, {
                                    "name": "report",
                                    "type": "input",
                                    "hidden": true,
                                    "value": ВыбранныйОтчет
                                });
                                ФормыОкон[id_salt_periodedit].addItem(null, {
                                    "name": "current",
                                    "type": "input",
                                    "hidden": true,
                                    "value": ВыбранныйПериод
                                });

                                ФормыОкон[id_salt_periodedit].attachEvent("onButtonClick", function (id) {
                                    switch (id) {
                                        case "save":
                                            {
                                                var Отчет = ФормыОкон[id_salt_periodedit].getInput("report").value;
                                                var НовоеНазвание = ФормыОкон[id_salt_periodedit].getInput("name").value;
                                                var ТекущееНазвание = ФормыОкон[id_salt_periodedit].getInput("current").value;
                                                ЗапросыАПИ.Отчеты.Периоды.Сохранить(Отчет, НовоеНазвание, ТекущееНазвание);
                                                Окна.window(id_salt_periodedit).close();
                                                ФормыОкон[id_salt_periodedit] = false;
                                                try {
                                                    ТаблицыЭкрана.СписокПериодов.unload();
                                                } catch (e) {};
                                                if (ТаблицыЭкрана.СписокОтчетов.getSelectedId().startsWith("item_")) {
                                                    СоздатьСписокПериодов(ТаблицыЭкрана.СписокОтчетов.getSelectedId());
                                                }
                                                break;
                                            }
                                        default:
                                            {}
                                    }
                                });
                            });
                        }


                        break;
                    }
                default:
                    {}
            }
        });


        window.СоздатьСписокОтчетов = function () {
            ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
                iconset: "font_awesome",
                multiselect: false, // boolean, optional, enables multiselect
                checkboxes: false, // boolean, optional, enables checkboxes
                dnd: false, // boolean, optional, enables drag-and-drop
                items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
            });
            ТаблицыЭкрана.СписокОтчетов.attachEvent("onSelect", function (id) {
                try {
                    ТаблицыЭкрана.СписокПериодов.unload();
                    ТаблицыЭкрана.СписокПервички.unload();
                } catch (e) {};
                if (id.startsWith("item_")) {
                    СоздатьСписокПериодов(id);
                }
            });
        };
        СоздатьСписокОтчетов();

        window.СоздатьСписокПериодов = function (id) {
            ТаблицыЭкрана.СписокПериодов = InterfaceLayout.cells("b").attachTreeView({
                iconset: "font_awesome",
                multiselect: false, // boolean, optional, enables multiselect
                checkboxes: false, // boolean, optional, enables checkboxes
                dnd: true, // boolean, optional, enables drag-and-drop
                items: ЗапросыАПИ.Отчеты.Периоды.СписокДерево(ТаблицыЭкрана.СписокОтчетов.getItemText(id))
            });
            ТаблицыЭкрана.СписокПериодов.attachEvent("onSelect", function (id) {
                try {
                    ТаблицыЭкрана.СписокПервички.unload();
                } catch (e) {};
                if (id.startsWith("item_")) {
                    СоздатьСписокПервички(id);
                }
            });
            ТаблицыЭкрана.СписокПериодов.attachEvent("onDrop", function (id, pId, index) {
                ЗапросыАПИ.Отчеты.Периоды.НазначитьДоступ(
                    ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()),
                    ТаблицыЭкрана.СписокПериодов.getItemText(id),
                    pId
                );
                return true;
            });
            ТаблицыЭкрана.СписокПериодов.attachEvent("onDragOver", function (id, pId, index) {

                switch (pId) {
                    case "opened":
                        {
                            return true;
                        }
                    case "closed":
                        {
                            return true;
                        }
                    default:
                        {
                            return false
                        }
                }
            });
        }

        window.СоздатьСписокПервички = function (id) {
            ТаблицыЭкрана.СписокПервички = InterfaceLayout.cells("c").attachTreeView({
                iconset: "font_awesome",
                multiselect: false, // boolean, optional, enables multiselect
                checkboxes: false, // boolean, optional, enables checkboxes
                dnd: false, // boolean, optional, enables drag-and-drop
                items: ЗапросыАПИ.Отчеты.Первичные.СписокДерево(ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()),ТаблицыЭкрана.СписокПериодов.getItemText(id))
            });
            ТаблицыЭкрана.СписокПервички.attachEvent("onDblClick", function(id) {
                var filename = "/api/documents/download/"+ТаблицыЭкрана.СписокОтчетов.getItemText(
                    ТаблицыЭкрана.СписокОтчетов.getSelectedId()
                    ) + "/Первичные/"+ТаблицыЭкрана.СписокПериодов.getItemText(
                        ТаблицыЭкрана.СписокПериодов.getSelectedId()
                        )+"/"+id;
                filename = encodeURIComponent(filename);
                var id_salt_editor = Math.random() + "";
                Окна.createWindow({
                    id: id_salt_editor,
                    text: "Редактор",
                    left: 10,
                    top: 10,
                    width: "600",
                    height: "300",
                    center: true,
                    resize: true
                });
                Окна.window(id_salt_editor).attachURL("/AppExcel/Excel.html?fileName="+filename);
                Окна.window(id_salt_editor).maximize();

                return true;
            });  
        }



    });


});