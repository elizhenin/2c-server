document.addEventListener('DOMContentLoaded', function() {
    ЗагрузитьМодуль("menubar");
    ГлавноеМеню(Хранилище.getItem("РольПользователя"),"right");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/" + Хранилище.getItem("РольПользователя") + "/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function() {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        InterfaceLayout.cells("a").setWidth(Math.round(document.body.clientWidth / 3));

        window.Окна = new dhtmlXWindows();
        Окна.attachViewportTo("body");
        window.ФормыОкон = {};
        window.ТаблицыЭкрана = {};

        var МенюОтчетов = InterfaceLayout.cells("a").attachMenu({
            items: {
                "id":"main_menu",
                    "items":[
                        {"id":"create", "text":"Создать"},
                        {"id":"edit", "text":"Править"},
                        {"id":"group", "text":"Права"}
                    ]
                }
        });
        МенюОтчетов.attachEvent("onClick", function(id) {
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
                        ФормыОкон[id_salt_reportadd].loadStruct("/views/editor/report_edit_form.json", "json", function() {
                            ФормыОкон[id_salt_reportadd].attachEvent("onButtonClick", function(id) {
                                switch (id) {
                                    case "save":
                                        {
                                            var Название = ФормыОкон[id_salt_reportadd].getInput("name").value;
                                           ЗапросыАПИ.Отчеты.Создать(Название);
                                            Окна.window(id_salt_reportadd).close();
                                            ФормыОкон[id_salt_reportadd] = false;
                                            ТаблицыЭкрана.СписокОтчетов.unload();
                                            ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
                                                multiselect:    false,           // boolean, optional, enables multiselect
                                                checkboxes:     false,           // boolean, optional, enables checkboxes
                                                dnd:            true,           // boolean, optional, enables drag-and-drop
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
                    case "edit":{
                        try{
                            if(ТаблицыЭкрана.СписокОтчетов.getSelectedId().startsWith("item_")){
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
                                ФормыОкон[id_salt_reportedit].loadStruct("/views/editor/report_edit_form.json", "json", function() {
                                    ФормыОкон[id_salt_reportedit].setItemValue("name", ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()));
                                    ФормыОкон[id_salt_reportedit].addItem(null, {
                                        "name": "current",
                                        "type": "input",
                                        "hidden": true,
                                        "value": ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId())
                                    });
                                    ФормыОкон[id_salt_reportedit].attachEvent("onButtonClick", function(id) {
                                        switch (id) {
                                            case "save":
                                                {
                                                    var НовоеНазвание = ФормыОкон[id_salt_reportedit].getInput("name").value;
                                                    var ТекущееНазвание = ФормыОкон[id_salt_reportedit].getInput("current").value;
                                                   ЗапросыАПИ.Отчеты.Сохранить(НовоеНазвание,ТекущееНазвание);
                                                    Окна.window(id_salt_reportedit).close();
                                                    ФормыОкон[id_salt_reportedit] = false;
                                                    ТаблицыЭкрана.СписокОтчетов.unload();
                                                    ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
                                                        multiselect:    false,           // boolean, optional, enables multiselect
                                                        checkboxes:     false,           // boolean, optional, enables checkboxes
                                                        dnd:            true,           // boolean, optional, enables drag-and-drop
                                                        items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
                                                    });
                                                    break;
                                                }
                                            default:
                                                {}
                                        }
                                    });
                                });
                            }else {alert("Выберите отчет")}
                        }
                        catch(e){}
                       
                        break;
                    }

                default:
                    {}
            }
        });
        
        ТаблицыЭкрана.СписокОтчетов = InterfaceLayout.cells("a").attachTreeView({
            multiselect:    false,           // boolean, optional, enables multiselect
            checkboxes:     false,           // boolean, optional, enables checkboxes
            dnd:            true,           // boolean, optional, enables drag-and-drop
            items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
        });

    });


});
