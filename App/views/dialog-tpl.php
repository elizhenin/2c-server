<!DOCTYPE html>
<html>

<head>
    <title><?=$title?></title>
    <link rel="stylesheet" type="text/css" href="/static/css/w2ui-1.4.3.css" />
    <script src="/static/js/jquery.min.js"></script>
    <script type="text/javascript" src="/static/js/w2ui-1.4.3.js"></script>
    <script type="text/javascript" src="/static/js/filesaver.js"></script>
    <script type="text/javascript">
    var win = nw.Window.get();
    win.unmaximize();
    win.resizeTo(<?=$width?>,<?=$height?>);
    win.setResizable(false);
    win.moveTo(Math.round(screen.width/2)-Math.round(win.width/2),
               Math.round(screen.height/2)-Math.round(win.height/2));
    </script>
</head>

<body style="padding: 0px; margin:0px">
    <script type="text/javascript">
        w2utils.locale('/static/js/ru-ru.json');
    </script>
    <div style="width: 100vw; height: 100vh;">
        <div id="body" style="width: 100%; height: 100%;"></div>
    </div>
   
    <?=$body?>


</body>

</html>
