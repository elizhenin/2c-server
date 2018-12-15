if(typeof (window.Справочники)=="undefined") window.Справочники = {};
window.Справочники.Роли = JSON.parse(ЗагрузитьФайлСинхронно("/subtitles/roles.json"));

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
        СписокПользователей.setHeader("Имя входа,Роль");
        СписокПользователей.setInitWidths("200,*");
        СписокПользователей.setColTypes("ro,ro"); 
        СписокПользователей.init();
        СписокПользователей.parse(ЗапросыАПИ.Пользователи.Список(),"json");
        СписокПользователей.attachEvent("onRowDblClicked", function (id,cell) {
         console.log(id);
         console.log(cell);
         });

         var СписокОрганизаций =  InterfaceLayout.cells("b").attachGrid();
         СписокОрганизаций.setHeader("Организация");
         СписокОрганизаций.setColTypes("ro"); 
         СписокОрганизаций.init();
         СписокОрганизаций.parse(ЗапросыАПИ.Организации.Список(),"json");
         СписокОрганизаций.attachEvent("onRowDblClicked", function (id,cell) {
          console.log(id);
          console.log(cell);
          });

          var СписокГрупп =  InterfaceLayout.cells("c").attachGrid();
          СписокГрупп.setHeader("Группа");
          СписокГрупп.setColTypes("ro"); 
          СписокГрупп.init();
          СписокГрупп.parse(ЗапросыАПИ.Группы.Список(),"json");
          СписокГрупп.attachEvent("onRowDblClicked", function (id,cell) {
          console.log(id);
          console.log(cell);
          });
       
    });

});