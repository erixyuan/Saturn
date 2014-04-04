var Saturn = {
    cmsPath: /(.*public\/)/.test(document.location.href) ?
                document.location.href.match(/(.*public\/)/)[1] :
                document.location.origin+'/',
    views:{}
}

Saturn.beginLoading = function(msg){
    if($('#js_loading').length != 0) return false;
    var msg = msg == undefined ? '' : msg;
    $('body').append('<div class="g-loading use-progress" id="js_loading">'+
                     '<div class="progress-bar" id="js_progressBar" style="width: 100%;"></div></div>');
    $("#js_loading").addClass("show");
    $('#js_progressBar').css({width: "0%"});
    $('#js_progressBar').animate({
        width: "100%"
    },10000);
}

// 加载进度条——加载结束
Saturn.afterLoading = function(){
    if($('#js_progressBar').length == 0) return false;
    $('#js_progressBar').stop();
    $("#js_loading").fadeOut(function(){
        $(this).remove();
    })
}

Saturn.renderToDom = function(html,domId){
    var domId = domId == undefined ? '#js_mainContent' : domId;
    $('#js_mainContent').prepend('<div id="js_tpl" style="display:none">'+html+'</div>'); //加入临时的dom，做模板的缓冲区
    $(domId).html($('#js_tpl').html());
    Saturn.afterLoading();
}

// 格式化事件，把秒数转化为
Saturn.formatTime = function(time){
      return new Date(time*1000).toISOString().substr(0,16).replace('T',' ');
}

Saturn.formatTimeToDate = function(time){
      return new Date(time*1000).toISOString().substr(0,10)
}

Saturn.defer = function(list,callback){
    var remain = list.length;
    var allData = [];
    if(remain == 0){
        return false;
    }
    for (var i = 0; i < list.length; i++) {
        var model = list[i].object;
        var method = list[i].method;
        var params = list[i].params;

        // 分为两种情况，一种是有附加参数的，代表为自定义的
        // 一种是没有参数的，就是backbonejs的fetch方法
        if(params){
            model[method](params,function(num){
                return function(data){
                    count(num,data)
                }
            }(i))
        }else{
            model[method]({
                success:function(num){
                    return function(data){
                        count(num,data)
                    }
                }(i),
            })
        }
    };

    //计数器,根据i的值来填充到数组中
    function count(i,data){
        allData[i] = data;
        if(!(--remain)){
            callback(allData);
        }
    }
}

Saturn.createDialog = function(title,html,isAutoClose){
    var timestamp = new Date().getTime();
    var dialogId = 'dialog'+timestamp;
    var dialogHtml = [
        '<div class="g-modal show" id="'+dialogId+'">',
            '<div class="g-modal-dialog">',
                '<span dialog-close class="close"><i class="fa fa-times"></i></span>',
                '<div class="fn-clear g-modal-dialog-header">',
                    '<h5 class="fn-left">'+title+'</h5>',
                '</div>',
                '<div class="fn-clear g-modal-dialog-container">'+html+'</div>',
                '<div class="fn-clear g-modal-dialog-footer">',
                    '<button type="button" dialog-close class="fn-right g-btn g-btn-primary">确定</button>',
                '</div>',
            '</div>',
        '</div>',
    ].join('');
    $('body').append(dialogHtml);
    $('#'+dialogId).on('click',function(){
        isAutoClose ? clearTimeout(timer) : null;
        $('#'+dialogId+'').remove();
        $('#'+dialogId+'').off();
    })
    if(isAutoClose){
        var timer = setTimeout(function(){
            $('#'+dialogId).trigger("click")
        }, 3000)
    }
}


// REST的赋值方法
// 主要是判断如果存在 article.a.b.c的情况
// 把这个字符串分割，然后赋值
Saturn.setRestValue = function(model,restName,value){
    var arr = restName.split('.');
    if(arr.length>1){
        var str = ''
        for(var i=0 ; i<arr.length ; i++){
            str += '["'+arr[i]+'"]';
        }
        eval('model'+str+'='+"'"+value+"'");
    }else{
        model[restName] = value;
    }
}


Saturn.client = function(){
    //呈现引擎
    var engine = {
        ie     : 0,
        gecko  : 0,
        webkit : 0,
        khtml  : 0,
        opera  : 0,
        //完整的版本号
        ver    : null
    };

    //浏览器
    var browser = {
    //主要浏览器
        ie      : 0,
        firefox : 0,
        konq    : 0,
        opera   : 0,
        chrome  : 0,
        safari  : 0,

        //具体的版本号
        ver     : null
    };

    //平台、设备和操作系统
    var system ={
        win : false,
        mac : false,
        xll : false,

        //移动设备
        iphone    : false,
        ipod      : false,
        nokiaN    : false,
        winMobile : false,
        macMobile : false,

        //游戏设备
        wii : false,
        ps  : false
    };
    //检测呈现引擎和浏览器
    var ua = navigator.userAgent;
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);

        //确定是Chrome还是Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
        //近似地确定版本号
            var safariVersion = 1;
            if(engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }
            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konquersor\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.kong = paresFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
        engine.ver = RegExp["$1"]
        engine.gecko = parseFloat(engine.ver);
        //确定是不是Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = pareseFloat(browser.ver);
        }
    } else if(/MSIE([^;]+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
    }
    //检测浏览器
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    //检测Windows操作系统
    if (system.win){
        if (/Win(?:doms)?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    default   :
                        system.win = "NT";
                        break;
                }
            } else if (RegExp["$1"]){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    //移动设备
    system.iphone    = ua.indexOf("iPhone") > -1;
    system.ipod      = ua.indexOf("iPod") > -1;
    system.nokiaN    = ua.indexOf("NokiaN") > -1;
    system.winMobile = (system.win == "CE");
    system.macMobile = (system.iphone || system.ipod);
    //游戏系统
    system.wii = ua.indexOf("Wii") > -1;
    system.ps  = /playstation/i.test(ua);
    //返回这些对象
    return {
        engine:  engine,
        browser:  browser,
        system:  system
    };
}


Saturn.IsPC = function()
{
   var userAgentInfo = navigator.userAgent;
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
   var flag = true;
   for (var v = 0; v < Agents.length; v++) {
       if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
   }
   return flag;
}



// 判断是否是空对象
Saturn.isEmpty = function (obj)
{
    for (var name in obj)
    {
        return false;
    }
    return true;
};

Saturn.isCurrentView = function(currentModule,secondModule){
    if(Saturn.navModel.get('currentModule') == currentModule && Saturn.navModel.get('secondModule') == secondModule){
        return true;
    }else{
        return false;
    }
}