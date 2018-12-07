var РежимыРаботы = {
    "/": "workspace/home"
}

window.ОпределитьРежим = function() {
    РежимВнеВариантов = true;
    for (var Вариант in РежимыРаботы) {
        if (РежимыРаботы.hasOwnProperty(Вариант)) {
            if (Вариант == window.location.pathname) {
                РежимВнеВариантов = false;
                НужныйМодуль = РежимыРаботы[Вариант];
            }
        }
    }
    if (РежимВнеВариантов) {
        return "404";
    } else {
        return НужныйМодуль;
    }
}