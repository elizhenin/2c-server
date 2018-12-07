ДождатьсяЭлемента(window.MainLayout, function () {
    window.MainMenu = window.MainLayout.cells("a").attachMenu();
    window.MainMenu.loadStruct("/views/main_menu.json");
});