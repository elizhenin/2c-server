document.addEventListener('DOMContentLoaded', function() {
    ЗагрузитьМодульАсинхронно("menubar");
    РазбивкаЭкрана = JSON.parse(ЗагрузитьФайлСинхронно("/views/receiver/body_layout.json"));
    ДождатьсяЭлемента(MainLayout, function() {
        window.InterfaceLayout = MainLayout.cells("a").attachLayout(РазбивкаЭкрана);
        InterfaceLayout.cells("a").setWidth(Math.round(document.body.clientWidth / 3));
    });

});