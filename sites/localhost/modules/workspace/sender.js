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
            iconset: "awesome",
            items: {
                "id": "main_menu",
                "items": [{
                        "id": "copy",
                        "text": "Копировать",
                        "img":"fas fa-copy",
                        "imgDis": "fas fa-copy",
                        "color": "green"
                    },
                    {
                        "id": "clipboard",
                        "text": "",
                        "disabled":true
                    },
                    {
                        "id": "paste",
                        "text": "Вставить",
                        "img":"fas fa-paste",
                        "imgDis": "fas fa-paste"
                    }
                ]
            }
        });
        МенюПериодов.attachEvent("onClick", function (id) {
            switch (id) {
                case "copy":
                    {
                        try{
                            if(ТаблицыЭкрана.СписокПериодов.getSelectedId().startsWith("item_")){
                            МенюПериодов.setItemText("clipboard", ТаблицыЭкрана.СписокПериодов.getItemText(ТаблицыЭкрана.СписокПериодов.getSelectedId()));  
                            }else{
                                throw "not_an_item";
                            }
                        }
                        catch(e){
                            alert("Выберите период-исходник для копирования значений");
                        };
                        break;
                    }
                    case "paste":
                    {
                        ИсхПериод = МенюПериодов.getItemText("clipboard");
                        if(ИсхПериод != ""){
                            try{
                                if(ТаблицыЭкрана.СписокПериодов.getSelectedId().startsWith("item_")){
                                ЦелПериод = ТаблицыЭкрана.СписокПериодов.getItemText(ТаблицыЭкрана.СписокПериодов.getSelectedId());
                                }else {
                                    throw "not_an_item";
                                }
                                if (ИсхПериод == ЦелПериод){
                                    throw "dest_equal_to_src";
                                }
                                Отчет = ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId());
                                filename = ЗапросыАПИ.Отчеты.ДокументПоДокументу(Отчет, ИсхПериод, ЦелПериод);
                                ОткрытьРедактор(filename);
                            }
                            catch(e){
                                alert("Выберите целевой период для вставки значений");
                            };
                            
                        }else{
                            alert("Скопируйте период-исходник для вставки значений");
                        }
                        break;
                    }
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
                dnd: false, // boolean, optional, enables drag-and-drop
                items: ЗапросыАПИ.Отчеты.Периоды.СписокДерево(ТаблицыЭкрана.СписокОтчетов.getItemText(id))
            });
            ТаблицыЭкрана.СписокПериодов.attachEvent("onDblClick", function (id) {
                if (id.startsWith("item_")) {
                    var filename = ЗапросыАПИ.Отчеты.ДокументПоТрафарету(ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()), ТаблицыЭкрана.СписокПериодов.getItemText(id)); //"/api/documents/download/"+ТаблицыЭкрана.СписокОтчетов.getItemText(ТаблицыЭкрана.СписокОтчетов.getSelectedId()) + "/Периоды/"+ТаблицыЭкрана.СписокПериодов.getItemText(id)+"/"+"ОргНейм"+".xlsx";
                    ОткрытьРедактор(filename);
                }
                return true;
            });

        }

        window.ОткрытьРедактор = function(filename){
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
            Окна.window(id_salt_editor).attachURL("/AppExcel/Excel.html?fileName=" + filename);
            Окна.window(id_salt_editor).maximize();
        };

    });

});