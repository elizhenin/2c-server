var ТокенАвторизации = false;
if ("ТокенАвторизации" in Хранилище) {
    ТокенАвторизации = Хранилище.getItem("ТокенАвторизации");
}
if (ТокенАвторизации){
    location.href = "/"+Хранилище.getItem("РольПользователя");
}else{
    document.addEventListener('DOMContentLoaded', function() {
       ДождатьсяЭлемента(MainLayout, function() {
        var ОкнаОбласть = MainLayout.cells("a").attachObject("winVP");
        window.Окна = new dhtmlXWindows();
        Окна.attachViewportTo("winVP");
        Окна.createWindow({
            id:"auth",
            text:"Авторизация",
            left:20,
            top:30,
            width:290,
            height:200,
            center:true,
            resize:false
        });
        Окна.window("auth").button("close").hide();
        Окна.window("auth").button("park").hide();
        Окна.window("auth").button("minmax").hide();
        ФормаАвторизации  = Окна.window("auth").attachForm();
        ФормаАвторизации.loadStruct("/views/login_form.json", "json");
        ФормаАвторизации.attachEvent("onButtonClick", function(id){
            switch (id) {
                case "save":
                    {
                        var Имя = ФормаАвторизации.getInput("login").value;
                        var Пароль = ФормаАвторизации.getInput("password").value;
                    var Результат = ЗапросыАПИ.Пользователь.Вход(Имя,Пароль);
                    if(!Результат.Статус){alert(Результат.Сообщение)}
                    else{
                        Хранилище.setItem("РольПользователя",Результат.Роль);
                        location.href = "/"+Результат.Роль;
                    }
                    }
                default:
                    {}
            }
        });
       });
   
   });
   
}



