document.addEventListener('DOMContentLoaded', function() {
    ЗагрузитьМодуль("menubar");
    ГлавноеМеню(Хранилище.getItem("РольПользователя"),"right");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/" + Хранилище.getItem("РольПользователя") + "/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function() {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        InterfaceLayout.cells("a").setWidth(Math.round(document.body.clientWidth / 3));
        var МенюОтчетов = InterfaceLayout.cells("b").attachMenu({
            items: {
                "id":"main_menu",
                    "items":[
                        {"id":"create", "text":"Создать"}
                    ]
                }
        });

        window.Окна = new dhtmlXWindows();
        Окна.attachViewportTo("body");
        window.ФормыОкон = {};
        window.ТаблицыЭкрана = {};
        ТаблицыЭкрана.СписокТрафаретов = InterfaceLayout.cells("a").attachTreeView({
            multiselect:    false,           // boolean, optional, enables multiselect
            checkboxes:     false,           // boolean, optional, enables checkboxes
            dnd:            true,           // boolean, optional, enables drag-and-drop
            items: ЗапросыАПИ.Отчеты.СписокДеревоГруппы()
        });

    });


});
