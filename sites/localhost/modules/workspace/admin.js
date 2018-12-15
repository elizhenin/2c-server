document.addEventListener('DOMContentLoaded', function() {
    ЗагрузитьМодуль("menubar");
    ГлавноеМеню(Хранилище.getItem("РольПользователя"),"right");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/" + Хранилище.getItem("РольПользователя") + "/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function() {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        InterfaceLayout.cells("a").attachMenu({
            items: {
                "id":"main_menu",
                    "items":[
                        {"id":"create", "text":"Создать"},
                        {"id":"change", "text":"Изменить"}
                    ]
                }
        });

        var СписокПользователей = InterfaceLayout.cells("a").attachGrid();
        СписокПользователей.setHeader("Имя входа");
        СписокПользователей.init();
        СписокПользователей.parse(ЗапросыАПИ.Пользователь.Список(),"json");
       
       
    });

});