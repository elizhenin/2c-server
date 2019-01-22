function ДождатьсяЭлемента(Элемент, Функция, Период = 1000) {
    var Попытки = setInterval(function () {
        if (typeof(Элемент) != 'undefined') {
            clearInterval(Попытки);
            Функция();
        }
    }, Период);
}

ДождатьсяЭлемента(Grids, function(){

});