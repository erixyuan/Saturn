<!DOCTYPE html>
<html lang="zh-cn" class="modpage" id="{{$c->slug or null}}">
    <head>
        <meta charset="utf-8" />
        <title>
            @section('title')
            {{Option::get('sitename');}}
            @show
        </title>
        <link rel="stylesheet" type="text/css" href="{{asset('themes/appwall/res/css/style.css')}}?v=10" />
        <link rel="stylesheet" type="text/css" href="{{asset('themes/appwall/res/css/style_modpage.css')}}?v=1" />
        <link rel="shortcut icon" type="image/x-icon" href="{{asset('favicon.ico')}}">
        <link rel="alternate" type="application/rss+xml" title="订阅 应用墻 (RSS 2.0)" href="{{asset('/rss.xml')}}" />

        <script language="javascript" type="text/javascript" src="{{asset('themes/appwall/res/js/jquery.js')}}"></script>
        <script language="javascript" type="text/javascript" src="{{asset('themes/appwall/res/js/bootstrap-modal.js')}}"></script>
        <script language="javascript" type="text/javascript" src="{{asset('themes/appwall/res/js/slimbox2.js')}}?v=2"></script>
        <script language="javascript" type="text/javascript" src="{{asset('themes/appwall/res/js/slides.min.jquery.js')}}"></script>

        <!--[if IE 6]>
            <script language="javascript" type="text/javascript" src="{{asset('themes/appwall/res/js/DD_belatedPNG_0.0.8a.js')}}"></script>
            <script>
                DD_belatedPNG.fix('.logo a img, .logo a span, .box .app .mask, .box .app .icon');
            </script>
        <![endif]-->
        @section('head')
        <meta name="description" content="{{Option::get('site::description')}}" />
        <meta name="keywords" content="{{Option::get('site::keywords')}}" />
        @show
        <script>
function nextCategory() {
    if ($(".header li.current").length)
    {
        var nextIndex = $(".header li.current").index() + ($(".header li.current").parent().index() - 1) * 4;
        nextIndex = (nextIndex + 1) % $(".header li").length;
        location.href = $(".header li:eq(" + nextIndex + ") a").attr('href');
    }
}
function prevCategory() {
    if ($(".header li.current").length)
    {
        var prevIndex = $(".header li.current").index() + ($(".header li.current").parent().index() - 1) * 4;
        prevIndex = prevIndex - 1 < 0 ? $(".header li").length - 1 : prevIndex - 1;
        location.href = $(".header li:eq(" + prevIndex + ") a").attr('href');
    }
}
function bindForm() {
    $("#win-fj-share .close").click(function() {

        $(".modal-backdrop").remove();
        $("#win-fj-share").hide()
    });
    $("form").submit(function() {
        $(this).attr('target', 'iframe-fj-share');
        $("body").append('<div class="modal-backdrop"></div>');
        $("#win-fj-share").show();

        var appid = $(this).find('input[type="submit"]').attr('data-application-id');
        if (appid)
        {
        }

    });
}
$(function() {
    bindForm();
    $("#slides li a").click(function() {
        var appid = $(this).attr('href').replace('#w', '');
        if (appid)
        {
        }
    });
});

        </script>

    </head>

    <body>

        <div class="header clearfix">
            <div class="wrap">
                <h1 class="logo">
                    <a href="{{url('appwall')}}">
                        <img src="{{asset('themes/appwall/res/images/aw_logo.png')}}" alt="少数派应用墙"/>
                        <span>应用墙</span>
                    </a>
                </h1>               
                <ul>

                    @foreach ($categories as $k=>$c)
                    <li class="top_h" id="top_{{$c->slug}}_h">
                        <a href="{{url('appwall/'.$c->slug)}}">{{$c->name}}</a>
                    </li>
                    {{($k+1)== 4 ? '</ul><ul>' : ''}}
                    @endforeach
                </ul>
            </div>
            <a class = "back" href = "#"></a>
        </div>


        @section('main')
        @show


        <div class = "footer clearfix">

            <!--QQ统计 -->
<!--            <script type = "text/javascript" src = "http://tajs.qq.com/stats?sId=9359638" charset = "UTF-8"></script> 
            <div style="display: none;">
                <script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F5f713c46f2a2ef514713c9f17b24f7f7' type='text/javascript'%3E%3C/script%3E"));
                </script>
            </div>-->

        </div>
        <div id="win-fj-share">
            <div class="close">x</div>
            <iframe width="100%" height="100%" src="about:blank" frameborder="0" name="iframe-fj-share"></iframe>
        </div>
        <script   >
//                (function(i, s, o, g, r, a, m) {
//                    i['GoogleAnalyticsObject'] = r;
//                    i[r] = i[r] || function() {
//                        (i[r].q = i[r].q || []).push(arguments)
//                    }, i[r].l = 1 * new Date();
//                    a = s.createElement(o),
//                            m = s.getElementsByTagName(o)[0];
//                    a.async = 1;
//                    a.src = g;
//                    m.parentNode.insertBefore(a, m)
//                })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//
//                ga('create', 'UA-45781071-2', 'sspai.com');
//                ga('send', 'pageview');

        </script>
    </body>
</html>
