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
                }
                return true;
            });

        }


    });

});