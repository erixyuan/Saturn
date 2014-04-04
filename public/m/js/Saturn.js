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



/**
 * 创建编辑器
 * object是配置文件
 */

Saturn.createEditor = function(object) {
    var option = {
        currentEditType : '',
        textarea_id : '',         //插件注入的DOM的id
        ACE_id:'',          //ACE的id
        ACE_setting:'',      //ACE的配置
        codeTheme:'',
    }
    // return;
    for(var i in object){
        option[i] = object[i];
    }
    var ace = require('ace/ace');
    // 初始化ACEditor
    var aceEditor;
    window.aceEditor = aceEditor;

    /**
     * 启用emmet插件，插件的使用方法，必须是
     * require([插件名字1,插件名字2],function(){
     *     然后在这里初始化ace，
     *     因为插件加载之后，会修改ace这个类，接着ace初始化，插件才会生效
     * })
     * @param  {[type]} a [description]
     * @return {[type]}   [description]
     *
     * 配置文档
     * https://github.com/ajaxorg/ace/blob/master/lib/ace/editor.js#L2393
     */
    require(['ace/ext/emmet'],function(a){
        aceEditor =  ace.edit(option.ACE_id);
        aceEditor.session.setValue($(option.textarea_id).val());

        aceEditor.session.setMode("ace/mode/html");
        aceEditor.setOption("enableEmmet", true);
        aceEditor.setTheme("ace/theme/"+(option.codeTheme == 1 ? 'monokai' : 'xcode'));
        aceEditor.setOption("fontSize", 12);
        aceEditor.setOption("highlightActiveLine", true);
        aceEditor.setOption("tabSize", '4');
        aceEditor.setOption("showGutter", true);
        aceEditor.setOption("showFoldWidgets", true);
        aceEditor.setOption("fadeFoldWidgets", true);
        aceEditor.setOption("printMargin", false);
        aceEditor.setOption("showPrintMargin", false);
        aceEditor.setOption("showInvisibles", true);
        aceEditor.setOption("hScrollBarAlwaysVisible", true);
        aceEditor.setOption("highlightGutterLine", true);
        aceEditor.setOption("wrap", true);
        aceEditor.setOption("hScrollBarAlwaysVisible", false);
        // 自动配对符号
        // aceEditor.setOption("behavioursEnabled", ture);

        aceEditor.on('change',function(){
            $(option.textarea_id).val(aceEditor.session.getValue());
        })
    })





    // 设置换行线方法
    function setSoftWrap(value){
        var session = aceEditor.env.editor.session;
        var renderer = aceEditor.env.editor.renderer;
        switch (value) {
            case "off":
                session.setUseWrapMode(false);
                renderer.setPrintMarginColumn(80);
                break;
            case "free":
                session.setUseWrapMode(true);
                session.setWrapLimitRange(null, null);
                renderer.setPrintMarginColumn(80);
                break;
            default:
                session.setUseWrapMode(true);
                var col = parseInt(value, 10);
                session.setWrapLimitRange(col, col);
                renderer.setPrintMarginColumn(col);
        }
    }





    // 创建tinymce编辑器 START ===========================================================================================
    tinyMCE.init({
        selector: option.textarea_id,
        language:"zh_CN",
        theme:"modern",
        skin: 'light_saturn',

        //定义载入插件
        plugins : "fullscreen image code media link preview searchreplace visualblocks textcolor contextmenu paste code",
        toolbar1: "formatselect | forecolor | blockquote | bullist numlist  | alignleft aligncenter alignright | anchor searchreplace visualblocks code | fullscreen",
        contextmenu: "bold italic | image link | removeformat",

        //定义工具栏的位置
        theme_advanced_toolbar_location : "top",

        // 隱藏設定
        menubar: false,

        statusbar : false,

        //定义输入框下方是否显示状态栏，默认不显示
        theme_advanced_statusbar_location : "bottom",

        keep_styles: false,

        // 純文本粘貼，依賴 paste
        // paste_as_text: true,

        // 把圖片的data屬性，如data-url一起帶過來
        paste_data_images: true,


        //定义工具栏工具的对其方式
        theme_advanced_toolbar_align : "left",

        //定义是否可以改变输入窗口大小
        theme_advanced_resizing : true,

        height : 600,


        // 这里让附件路径以「绝对」路径显示
        // setup: function(editor) {
            // editor.on('keypress blur', function(){
                // 每次可视化编辑器按钮按下，光标取消就会把可视化内容填充到文本模式中
                // 每次填充，把tinymce的图片属性data-mce-src全部拿掉,然后保存
                // var html = $(tinymce.activeEditor.getBody()).html().replace(/data-mce-src=".*"/,'');
                // $(option.textarea_id).val(html);
            // })
        // }


        // ::TODO:: 这里要修复，换成所有都是相对路径
        // 这里让附件路径以「相对」路径显示
        setup: function(editor) {
            editor.on('keypress blur', function(){
                /* 每次可视化编辑器按钮按下，光标取消就会把可视化内容填充到文本模式中 */
                /* 每次填充，把tinymce的图片属性data-mce-src全部拿掉,然后保存 */
                var html = tinymce.activeEditor.getContent().replace(/data-mce-src=".*"/,'');
                $(option.textarea_id).val(html);
            })
        }


        });
    // 创建tinymce编辑器 END ===========================================================================================





    // 定时器，等所有的东西都加载完成后，再执行
    setTimeout(function(){
        changeEdior();
        /* 为可视化编辑模块加入样式 */
        $(tinymce.activeEditor.getDoc().head).append('<link rel="stylesheet" href="'+
            Saturn.cmsPath+'themes/'+Saturn.theme+'/_res/css/typo.css'+'">');
        $(tinymce.activeEditor.getDoc().body).addClass('typo');
        $(tinymce.activeEditor.getDoc().body).css({
            'overflow' : 'visible',
            'max-width' : '640px',
        });
    }, 500)

    function changeEdior(){
        $('#js_editor span').removeClass('g-btn-primary');
        $('#js_editor span[type='+option.currentEditType+']').addClass('g-btn-primary');
        var doms = $('#js_aceEditor,.mce-tinymce,'+option.textarea_id);
        doms.hide();
        doms.eq(option.currentEditType).show();
    }


    /* 监听可视化，代码，文本三个按钮的事件 */
    $('#editorView,#editorCode,#editorText').click(function(){
        var changeToType = $(this).attr('type');
        /* 如果当前模式 和 准备切换的模式相对，返回false*/


        if (changeToType == option.currentEditType) { return false;};

        if(changeToType == 1) {
            /* tinymce模式*/
            var content = $(option.textarea_id).val();
            // var reg = /(<!--##page_break_tag##)(.*?)(##page_break_tag##-->)/i;
            // if(reg.test(content)){
            //     var title1 = content.match(reg)[1];
            //     var title3 = content.match(reg)[3];

            //     content = content.replace(title1, '<div class="post-inner-pagination">');
            //     content = content.replace(title3, '<\/div>');
            //     $(option.textarea_id).val(content);
            // }

            tinymce.activeEditor.setContent(content);
            option.currentEditType = 1;
            changeEdior();

        }else if(changeToType == 0){
            /* ace模式*/
            var content = $(option.textarea_id).val();
            // var reg = /(<div class="post-inner-pagination">)(.*?)(<\/div>)/i;
            // if(reg.test(content)){
            //     var title1 = content.match(reg)[1];
            //     var title3 = content.match(reg)[3];

            //    content = content.replace(title1, '<!--##page_break_tag##');
            //     content = content.replace(title3, '##page_break_tag##-->');
            //     $(option.textarea_id).val(content);
            // }

            aceEditor.session.setValue(content);
            option.currentEditType = 0;
            changeEdior();

        }else{
            /* 文本模式 */
            option.currentEditType = 2;
            changeEdior();
        }
    })

    /* 添加图片的事件 */
    function addImg(data){

        // 把图片的绝对路径改成相对路径
        data.url = '../'+data.url.match(/attachment.*/)[0]

        // 如果是可视化模式
        if(option.currentEditType == 1){
            // 如果是可视化模式
            var rang = tinymce.activeEditor.selection.getRng();  // 获取光标的范围，是一个对象
            rang.deleteContents();
            rang.insertNode($('<img src="'+data.url+'"></img>')[0]);
            $(option.textarea_id).val(tinymce.activeEditor.getContent());
        }else if(option.currentEditType == 2){
            // 如果是文本模式
            //getTextareaCursor('content')
            var text = $(option.textarea_id).val();
            var length = text.length;
            var position = $(option.textarea_id)[0].selectionStart;
            var img = "<img src="+data.url+">"
            var html = text.substr(0,position) + img + text.substr(position);
            $(option.textarea_id).val(html);
        }else{
            // 如果是代码模式
            var img = "<img src="+data.url+">";
            aceEditor.insert(img);
            $(option.textarea_id).val(aceEditor.session.getValue());
        }
    }

    /* 插入html */
    function addHtml(html){
        // 如果是可视化模式
        if(option.currentEditType == 1){
            // 如果是可视化模式
            var rang = tinymce.activeEditor.selection.getRng();  // 获取光标的范围，是一个对象
            rang.deleteContents();
            rang.insertNode($(html)[0]);
            $(option.textarea_id).val(tinymce.activeEditor.getContent());
        }else if(option.currentEditType == 2){
            // 如果是文本模式
            //getTextareaCursor('content')
            var text = $(option.textarea_id).val();
            var length = text.length;
            var position = $(option.textarea_id)[0].selectionStart;
            var html = text.substr(0,position) + html + text.substr(position);
            $(option.textarea_id).val(html);
        }else{
            // 如果是代码模式
            aceEditor.insert(html);
            $(option.textarea_id).val(aceEditor.session.getValue());
        }
    }


    /* 获取 textare 的位置，返回 {row:xx, column:xx}*/
    function getTextareaCursor(domId){
        var textLengh = $(domId)[0].selectionStart;
        var valueArr = $(domId).val().split('\n');
        var length = 0;
        var obj = {
            row:0,
            column:0
        }
        for(var i =0 ; i<valueArr.length; i++){
            if(textLengh < valueArr[i].length){
                obj.row = i;   //确定行的位置
                obj.column = textLengh;
                return obj;
            }
            else if(textLengh == valueArr[i].length){
                obj.row = i;
                obj.column = textLengh;
                return obj;
            }
            else{
                textLengh -= (valueArr[i].length+1);
            }
        }
    }

    /****************************************************
     * 多图上传 开始
     ****************************************************/
    $('#uploadImgBtn').click(function(){
        $('#images').trigger('click');
    })
    $('#images').on('change' ,function(e){
        var files = e.target.files;
        for(var i = 0; i < files.length ; i++) {
            var formData = new FormData();
            formData.append("file", files[i]);
            formData.append('object_id',Saturn.articleModel.get('id'));
            formData.append('object_type','subject');
            formData.append('object_relation','thumb');
            $.ajax({
                url: Saturn.cmsPath+'ipa/attachment',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success:function(data){
                    addImg(data);
                }
            })
        };
    })
    /****************************************************
     * 多图上传 结束
     ****************************************************/

    /****************************************************
     * 图列表 开始
    ****************************************************/
    var editorImgListTmp = [
        '{{each}}',
            '<li>',
                '<img src="{{$value.thumb_url}}" title="{{$value.filename}}" alt="{{$value.filename}}" data-thumb-url="{{$value.thumb_url}}" data-origin-url="{{$value.origin_url}}">',
                '<span class="bottom">',
                    '<span class="filename">{{$value.filename}}</span>',
                    '<span class="actions">',
                        '<span class="g-btn g-btn-mini" href="javascript:void(0);" operateId="{{$value.id}}" operate="deleteImg">删除</span> ',
                        '| <span class="g-btn g-btn-mini" href="javascript:void(0);" operateId="{{$value.id}}" operate="selectImg">确定</span>',
                    '</span>',
                '</span>',
            '</li>',
        '{{/each}}',
    ].join('');


    // 显示图片列表
    $('#editorImgListBtn').click(function(e){
        var page = option.page ? option.page : 1;
        $.ajax({
            url: Saturn.cmsPath+'ipa/attachment?type=subject&id='+option.id+"&page="+page,
            type: 'get',
            success:function(data){
                // 把图片的链接改成相对地址
                _.each(data.data,function(value,key,list){
                    value.thumb_url = '../'+value.thumb_url.match(/attachment.*/)[0]
                });
                // 加载分页器，传入data列表
                require(['view/PaginationPluginView'],function(PaginationPluginView){
                    var pagination = new PaginationPluginView({
                        id:'#paginationPlugin_img',
                        data:data,
                        callback:function(){
                            $('#editorImgListBtn').trigger('click');
                        },
                        parent:option,
                    });
                })
                if (data.data) {
                    var html = template.compile(editorImgListTmp)(data.data);
                    $('#editorImgListContent').html(html);
                    $('#editorImgList').css('display','block');
                    $('#editorImgListClose').on('click',function(){
                        $('#editorImgList').hide();
                    });

                    $('#editorImgListContent span[operate=deleteImg]').unbind();
                    $('#editorImgListContent span[operate=selectImg]').unbind();
                    /* 删除图片 */
                    $('#editorImgListContent span[operate=deleteImg]').on('click',function(e){
                        $.ajax({
                            url:Saturn.cmsPath+'ipa/attachment/'+$(this).attr('operateId'),
                            type:'DELETE',
                            beforeSend:function(){
                                Saturn.beginLoading('删除中...');
                            },
                            success:function(data){
                                $(this).parents('li').remove();
                                Saturn.afterLoading();
                            }.bind(this)
                        });
                    })

                    /* 插入图片 */
                    $('#editorImgListContent span[operate=selectImg]').on('click',function(e){
                        var src = $(this).parents('li').find('img').attr('data-origin-url');
                        addImg({url:src});
                    })
                };
            }
        })
    });




     /****************************************************
     * 图列表 结束
     ****************************************************/


     /****************************************************
     * 工具栏 开始
     ****************************************************/

     $('#pagination').click(function(){
        addHtml('<!--##page_break_tag##分页##page_break_tag##-->');
     })


     /****************************************************
     * 工具栏 结束
     ****************************************************/

    /*************************************************
     * 模板
    *************************************************/
    var tpl1 = [
        '<h2>左1图右文模板</h2>\n'+
        '<div class="row">\n'+
            '    <div class="grid6">\n'+
            '        <img src="../resource/img/template/top_pct20.gif" title="" alt="">\n'+
            '    </div>\n'+
            '    <div class="grid6">\n'+
            '        <p>这里是文字</p>\n'+
            '    </div>\n'+
        '</div>'

    ].join('');



    var tpl2 = [
        '<div class="row">\n'+
            '    <div class="grid6">\n'+
            '        <img src="../resource/img/template/top_pct20.gif" title="" alt="">\n'+
            '    </div>\n'+
            '    <div class="grid6">\n'+
            '        <img src="../resource/img/template/top_pct20.gif" title="" alt="">\n'+
            '    </div>\n'+
        '</div>'
    ].join('');


    var tpl3 = [
        '<div class="row">\n'+
            '    <div class="grid4">\n'+
            '        <img src="../resource/img/template/top_pct20.gif" title="" alt="">\n'+
            '    </div>\n'+
            '    <div class="grid4">\n'+
            '        <img src="../resource/img/template/top_pct20.gif" title="" alt="">\n'+
            '    </div>\n'+
            '    <div class="grid4">\n'+
            '        <img src="../resource/img/template/top_pct20.gif" title="" alt="">\n'+
            '    </div>\n'+
        '</div>'

    ].join('');

    // 左边名字，右边值，如果改左边名字为aa1，那么模板edit.html也要改
    var tpls = {
        tpl1 : tpl1,
        tpl2 : tpl2,
        tpl3 : tpl3,
    };

    $('#tpl').on('change',function(){
        var name = $(this).val();
        if(!name){
            return false;
        }
        addHtml(tpls[name]);
        $(this).val('undefined');
    })
}



/****************************************
 * 上传图片初始化
 * obj = {
 *     inputId : '#bannerImg',
 *     params:{
 *         object_type: 'subject',
 *         object_id : this.model.get('id'),
 *         object_relation:'thumb'
 *     },
 *     callback:function(){
 *
 *     }
 * }
 * @return {[type]}     [description]
 *****************************************/
Saturn.initImgLoad = function(obj){
    var option = {
        inputId:'',
        params:{},
    };

    for(var i in obj){
        option[i] = obj[i];
    }
    $(option.inputId).trigger('click');

    $(option.inputId).unbind('change');

    $(option.inputId).bind('change',function(e){
        var files = e.target.files;
        for(var i = 0; i < files.length ; i++) {
            var formData = new FormData();
            formData.append("file", files[i]);
            for(var j in option.params){
                formData.append(j,option.params[j]);
            }
            $.ajax({
                url: Saturn.cmsPath+'ipa/attachment',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend:function(){
                    Saturn.beginLoading("上传中...");
                },
                success:function(data){
                    option.callback ? option.callback(data) : null;
                    Saturn.afterLoading();
                }
            })
        };
    })

}

