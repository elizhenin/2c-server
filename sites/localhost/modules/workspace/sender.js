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
        ФормаРедактора = Окна.createWindow({
            id: "editor",
            text: "Редактор",
            left: 10,
            top: 10,
            width: "600",
            height: "300",
            center: true,
            resize: true
        });
        
        ФормаРедактора.hide();

        window.СписокТрафаретов = InterfaceLayout.cells("a").attachTreeView({
            multiselect:    false,           // boolean, optional, enables multiselect
            checkboxes:     false,           // boolean, optional, enables checkboxes
            dnd:            true,           // boolean, optional, enables drag-and-drop
            items: [
                {id: 1, text: "Отчеты из ТЗ", open: 0, items: [
                    {id: 2, text: "МЗП_08"}
                ]}
            ]
        });
        СписокТрафаретов.attachEvent("onClick", function (id) {
            console.log(id);
            switch (id) {
                case 2:
                    {
                        window.СписокПериодов = InterfaceLayout.cells("b").attachTreeView({
                            multiselect:    false,           // boolean, optional, enables multiselect
                            checkboxes:     false,           // boolean, optional, enables checkboxes
                            dnd:            true,           // boolean, optional, enables drag-and-drop
                            items: [
                                {id: 1, text: "I квартал 2018 [ЗАКРЫТ]", open: 0, items: [
                                    {id: 11, text: "МЗП_08"}
                                ]},
                                {id: 2, text: "II квартал 2018 [ЗАКРЫТ]", open: 0, items: [
                                    {id: 21, text: "МЗП_08"}
                                ]},
                                {id: 3, text: "III квартал 2018 [ЗАКРЫТ]", open: 0, items: [
                                    {id: 31, text: "МЗП_08"}
                                ]},
                                {id: 4, text: "IV квартал 2018", open: 1, items: [
                                    {id: 41, text: "[НОВЫЙ]"}
                                ]}
                            ]
                        });
                        МенюОтчетов.detachEvent("onClick");
                        МенюОтчетов.attachEvent("onClick", function (id) {
                            switch (id) {
                                case "create":
                                    {
                                        ФормаРедактора
                                        .attachURL("https://personal.onlyoffice.com/products/files/doceditor.aspx?fileid=2684863&doc=UURFaUJZVXc0MDZVRWxkbm5nWjNSdVdlYzVOanB2dHpoQjNTM0N2VXEvUT0_IjI2ODQ4NjMi0");
                                       ФормаРедактора.show();
                                        ФормаРедактора.maximize();
                                 
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

    });


});
