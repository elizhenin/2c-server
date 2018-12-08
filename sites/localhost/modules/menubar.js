ДождатьсяЭлемента(window.MainLayout, function() {
    var role = "sender";
    window.MainMenu = window.MainLayout.cells("a").attachMenu();
    window.MainMenu.loadStruct("/views/" + role + "/main_menu.json");
});