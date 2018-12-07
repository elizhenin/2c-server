window.ТокенАвторизации = "kfgeshoghsoj";

СтрокаАдреса = window.location.href;
if (СтрокаАдреса.indexOf('?') > -1) {
    СтрокаАдреса = СтрокаАдреса.split('?')[1];
}
var Пары = СтрокаАдреса.split('&'); //бьем на пары ключ=значение
window.ПараметрыАдреса = {};
Пары.forEach(function(Пара) {
    Пара = Пара.split('=');
    ПараметрыАдреса[Пара[0]] = decodeURIComponent(Пара[1] || '');
});

function ПоказатьСистемноеСообщение(Текст) {
    global.alert(Текст);
}

function ПоказатьСообщение(Текст) {
    alert(Текст);
}

window.ФорматироватьДатуВремя = function(ДатаВремя, Относительное = true) {
    var Сегодня = new Date();
    var День = ("0" + ДатаВремя.getDate()).slice(-2) + "." + (ДатаВремя.getMonth() + 1) + "." + ДатаВремя.getFullYear();

    if (Относительное)
        if (ДатаВремя.getFullYear() == Сегодня.getFullYear())
            if (ДатаВремя.getMonth() == Сегодня.getMonth()) {
                if (ДатаВремя.getDate() == Сегодня.getDate()) День = "Сегодня";
                else if (ДатаВремя.getDate() - Сегодня.getDate() == 1) День = "Завтра";
            }

    var Время = ДатаВремя.getHours() + ":" + ("0" + ДатаВремя.getMinutes(2)).slice(-2);

    return День + " в " + Время;
}
window.ЧитатьКуки = function(Имя) {
    var Совпадения = document.cookie.match(new RegExp(
        "(?:^|; )" + Имя.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return Совпадения ? decodeURIComponent(Совпадения[1]) : undefined;
}

window.ВзятьЭлементПоИД = function(ИД) {
    return document.getElementById(ИД);
};

window.ВзятьПервыйЭлементПоКлассу = function(Класс) {
    var ЭлементыКласса = document.getElementsByClassName(Класс);
    return ЭлементыКласса[0];
};

window.ВзятьВсеЭлементыПоКлассу = function(Класс) {
    var ЭлементыКласса = Array.from(document.getElementsByClassName(Класс));
    return ЭлементыКласса;
};

window.ВзятьВсеЭлементыПоТегу = function(Тег) {
    var ЭлементыТега = Array.from(document.getElementsByTagName(Тег));
    return ЭлементыТега;
}

window.СоздатьЭлементДокумента = function(Тип) {
    return document.createElement(Тип);
};

window.ЗагрузитьМодуль = function(ИмяМодуля) {
    var ЗапросСервера = new XMLHttpRequest();
    ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + '/modules/' + ИмяМодуля + '.js', false);
    ЗапросСервера.send(null);
    ТелоМодуля = ЗапросСервера.responseText;
    ЗапросСервера = undefined;
    eval(ТелоМодуля);
};

window.ЗагрузитьСтраницу = function(ИмяМодуля) {
    var ЗапросСервера = new XMLHttpRequest();
    ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + '/views/' + ИмяМодуля + '.html', false);
    ЗапросСервера.send(null);
    ТелоСтраницы = ЗапросСервера.responseText;
    ЗапросСервера = undefined;
    return ТелоСтраницы;
};

window.ЗагрузитьСтиль = function(ИмяСтиля) {
    var ЗапросСервера = new XMLHttpRequest();
    ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + '/static/css/' + ИмяСтиля + '.css', true);
    ЗапросСервера.onload = function(e) {
        if (ЗапросСервера.readyState === 4) {
            if (ЗапросСервера.status === 200) {
                Стиль = document.createElement('style');
                Стиль.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(Стиль);
                Стиль.innerHTML = ЗапросСервера.responseText;
            }
        }
    };

    ЗапросСервера.send(null);

};

window.ЗагрузитьФайлАсинхронно = function(ИмяФайла, ВыполнитьДалее) {
    var ЗапросСервера = new XMLHttpRequest();
    ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + ИмяФайла, true);
    ЗапросСервера.onload = function(e) {
        if (ЗапросСервера.readyState === 4) {
            if (ЗапросСервера.status === 200) {
                ВыполнитьДалее(ЗапросСервера.responseText);
            }
        }
    };
    ЗапросСервера.send(null);
};

window.ЗагрузитьФайлСинхронно = function(ИмяФайла) {
    var ЗапросСервера = new XMLHttpRequest();
    ЗапросСервера.open('GET', window.location.protocol + '//' + window.location.host + ИмяФайла, false);
    ЗапросСервера.send(null);
    ТелоФайла = ЗапросСервера.responseText;
    ЗапросСервера = undefined;
    return ТелоФайла;
};


window.СменитьРежим = function(Режим) {
    window.location.href = Режим;
};


window.Хранилище = localStorage;


if (typeof nw != 'undefined') { // игнорим в браузере
    ЗагрузитьМодуль("app_presets");
}
//ЗагрузитьМодуль("app_requests");
ЗагрузитьМодуль("app_routes");

РежимРаботы = ОпределитьРежим();
ЗагрузитьМодуль(РежимРаботы);
