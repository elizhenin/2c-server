window.ГлавноеМеню = function (Роль = "sender", Выравнивание = "left") {
    ДождатьсяЭлемента(window.MainLayout, function () {
        window.MainMenu = window.MainLayout.cells("a").attachMenu();
        MainMenu.loadStruct("/views/" + Роль + "/main_menu.json");
        MainMenu.setAlign(Выравнивание);
        MainMenu.attachEvent("onClick", function (id) {
            switch (id) {
                case "exit":
                    {
                        ЗапросыАПИ.Пользователь.Выход();
                        Хранилище.removeItem("РольПользователя");
                        Хранилище.removeItem("ТокенАвторизации");
                        location.href = "/";
                    }
                default:
                    {}
            }
        });
    });
}