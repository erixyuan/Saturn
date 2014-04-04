 function isMobile(){
    var desktopWidth = 1024;
    if($(window).width() < desktopWidth){
        return true;
    }else {
        return false;
    }
 }



$(document).ready(function() {
    // 修复对顶栏的锚点链接偏移影响的问题 :TODO: 影响下载连接
    // 评论的锚点偏移
    $("#js-goto-comment-box").click(function(){
        var offset = $("#js-comments").offset();
        // 50是 评论框的标题高度
        $("body, html").animate({scrollTop: offset.top - $('.r-header').outerHeight(true) - 50 }, '200','swing');
        return false;
    });

    // 通用锚点偏移
    $("a").click(function(){
        var $this = $(this);
        var href = $this.attr("href");
        if($this.attr("no-scroll") == undefined && href.charAt(0) == "#" && href.charAt(1) != "#"){
            var target = $(href);
           if(target.length > 0){
              var offset = target.offset();
              $("body, html").animate({scrollTop: offset.top - $('.r-header').outerHeight(true) });
              return false;
           }
        }
    });






    // // 手机用的悬浮跳转到APP栏位置用的图标
    // $("#js-goto-app").click(function(){
    //     var top = $("#js-widget-appinfo").offset().top - $(".r-header").outerHeight(true) ;
    //       $("body, html").animate({scrollTop: top}, '50','swing',function(){
    //         top = $("#js-widget-appinfo").offset().top - $(".r-header").outerHeight(true) ;
    //             $("body, html").animate({scrollTop: top}, '50','swing');
    //       });
    //       return false;
    // });




    //罩层
    var Mask = {
        layer: null,
        closeEvent: [],
        // 初始化
        init: function(){
            var self = this;
            // 添加弹框背景
            this.layer = $("<div></div>").attr("id","js-mask").appendTo("body").click(function(){
                self.execClose();
                return false;
            });
        },

        //添加关闭事件
        addCloseEventHandle: function(event){
            if(typeof event === "object" && event.sender != undefined){
                this.closeEvent.push(event);
            }
        },

        //当弹框关闭的时候会执行关闭事件
        execClose: function(sender){
            for(var i = 0, l = this.closeEvent.length; i < l; i++){
                var event = this.closeEvent[i]
                if (sender != event.sender){
                    event.handle();//执行关闭事件
                }
            }
             this.layer.removeClass("active");
        },

        // 显示罩层
        show: function (){
            this.layer.addClass("active");
        },

        // 执行罩层关闭事件
        close: function(sender){
            this.execClose(sender);
        }

    };


    // 手机菜单
    var MobileMenu  = {
        btnMenu: $("#js-mobile-btn-menu"),
        menu: $("#js-mobile-nav-content"),

        // 关闭手机扩展菜单
        close: function(){
            this.btnMenu.removeClass("active");
            this.menu.removeClass("open");
            Mask.close("headerMobileMenu"); //关闭罩层
        },

        // 打开手机扩展菜单
        open: function(){
            this.btnMenu.addClass("active");
            this.menu.addClass("open");
            Mask.show();
        },

        // 切换手机扩展菜单
        switchMenu: function(){
            if(this.menu.hasClass("open")){
                this.close();
            }else{
                this.open();
            }
        }
    }


    // 当手机顶栏 手机菜单按下后
    $("#js-mobile-btn-menu").click(function(){
        MobileMenu.switchMenu();
        return false;
    });

    //当分页器 的当前页部分按下后
    $(".m-pager .current").click(function(){
        var pager = $(this).parents(".m-pager:first");
        var $nav = pager.find(".nav");
        var $current = pager.find(".current");

        if($nav.hasClass("open")){
            $nav.removeClass("open");
            $current.removeClass("open");
        } else {
            $nav.addClass("open");
            $current.addClass("open");
        }
    });

    //鼠标移开导航栏
    $(".m-pager .nav").mouseleave(function(){
        $(this).removeClass("open");
        $(".m-pager  .current").removeClass("open");
    });



    // 全局点击事件
    $("body").click(function(){
        //如果分页器没关闭的话 并且不鼠标不在上面
    });

    //初始化罩层;
    Mask.init();
    Mask.addCloseEventHandle({
        sender: "headerMobileMenu", //事件发起者
        handle: function(){
            MobileMenu.close();
        }
    });


    // 弹窗
    function Model(obj) {
        this._model = $(obj);
        var model = this._model;
        var self = this;
        this.onShowEvents = [];
        this.onCloseEvents = [];
        model.data("model",this);
        if(!model.data('inited')){
            model.find(".close, .cancel").click(function(){
                    self.close();
                    return false;
            });
        }

        if( Model.hasShowedModel == undefined ) {
            Model.hasShowedModel = false;
            // 遍历 现在有没有 显示弹窗
            $(".g-modal").each(function(){
                if( !$(this).is(":hidden") ){
                    Model.hasShowedModel = true;
                    return;
                }
            });
        }

        // 底部的黑色层
        if($(".overlay").length == 0) {
            //不存在的话就创建
            Model.overlay = $("<div class='overlay' ></div>").hide().appendTo("body");
            Model.overlay.click(function(){
                $(".g-modal").each(function(){
                    $(this).data('model').close();
                });
            });
        }
    }

    // 显示弹窗
    Model.prototype.show = function(){
        if(Model.hasShowedModel) {
            $(".g-modal").hide();
        }

        for(var i = 0, l = this.onShowEvents.length; i< l; i++){
            this.onShowEvents[i]();
        }

        Model.hasShowedModel = true;
        this._model.show();
        Model.overlay.show();
    };

    // 正在显示 的事件
    Model.prototype.onShow = function(handle) {
        this.onShowEvents.append(handle);
    }

    // 隐藏弹框
    Model.prototype.close = function () {
        Model.hasShowedModel = false;
        Model.overlay.hide();
        this._model.hide();
        for(var i = 0, l = this.onCloseEvents.length; i< l; i++){
            this.onCloseEvents[i]();
        }
    };

    // 正在隐藏 的事件
    Model.prototype.onclose= function(handle) {
        this.onCloseEvents.append(handle);
    }


    // 初始化 全局 弹框链接
    Model.initGolbal = function(){
        $(".g-modal-link").each(function(){
            var $this = $(this);
            var modalID = $this.data("modal-id");
            var model = new Model("#"+modalID);
            $this.click(function(){
                model.show();
                if($this.data("stop-bubble") == true){
                    return false;
                }
            });
        });
    };

    // 初始化 全部 Model 链接
    Model.initGolbal();

    //  顶栏二维码弹框
    $("#js-header-qrcode").hover(function(){
        var $this = $(this);
        var offset = $this.offset();
        var url = $this.data("url");
        var view = $("#js-header-qrcode-view");

        view.css({
            top: offset.top + $this.outerHeight(true),
            left:  offset.left - 160
        });

        view.slideDown(200);
    },function(){
        window.js_header_qrcode_view_time = setTimeout( function(){
            var view = $("#js-header-qrcode-view");
            view.stop();
            view.slideUp(50);
        },1000);
    });


    //  顶栏二维码弹框 QR鼠標hold住情況下
    $("#js-header-qrcode-view").hover(function(){
        clearTimeout(window.js_header_qrcode_view_time);
        var view = $("#js-header-qrcode-view").css('display','block');
    },function(){
        var view = $("#js-header-qrcode-view");
        view.stop();
        view.slideUp(50);
    });



    // 绑定二维码的链接弹框事件
     $(".js-show-qrcode").click(function(){
        var $this = $(this);
        var url = $this.data("url");
        var view = $("#js-qrcode-view");
        var qrImg = view.find("img:first");
        qrImg.attr("src", qrImg.data("base-src") + encodeURIComponent(url));
        var model = new Model("#js-qrcode-view");
        model.show();

        return false;
     });



    // 点击短信分享按钮 提交
    $("#js-send-sns").click(function(){
        $("#js-send-sns-share").submit();
        return false;
    });






    var header = $(".r-header");
    var logoHeight = $(".r-header .top").outerHeight(true) - 50;
    // 滚动时候 设置头部的样式
    function setHeaderStyle(pageTop) {
        if(pageTop > logoHeight  ){
            if(!header.hasClass("fixed-top")) {
                header.addClass("fixed-top");
            }
        }else{
            if(header.hasClass("fixed-top")) {
                header.removeClass("fixed-top");
            }
        }
    }


    //  滚动的时候设置 APP挂件悬停
    var appWidget = $("#js-widget-appinfo");
    var appWidgetHeight = 0;
    var appWidgetWidth = 0;
    var appWidgetSrcOffset = null;
    var hasAppWidget,headerHeight,siderBarHeight,footerOffset
    var hasAppWidgetPlaceholder = false;
    var appWidgetDelay = true; //延迟后才使悬停生效;
    hasAppWidget = appWidget.length > 0 ? true : false;

    // 设置APP挂件悬停的时候的运行环境
    function  setAppWidgetEvn(){
        hasAppWidgetPlaceholder = false;
        headerHeight = header.outerHeight(true);
        siderBarHeight = $(".m-sidebar").outerHeight(true);
        footerOffset = $(".r-footer").offset();

        if(hasAppWidget){
            appWidgetSrcOffset = appWidget.offset();
            appWidgetHeight = appWidget.height();
            appWidgetWidth = appWidget.width();
        }
    }



    function setAPPWidgetStyle(pageTop){
        if(!hasAppWidget || isMobile() || appWidgetDelay){
            return;
        }

        footerOffset = $(".r-footer").offset();

        //if((pageTop + headerHeight + 40 ) > appWidgetSrcOffset.top ) {
        if((pageTop + headerHeight ) > siderBarHeight ){
            var placeholder;
            var appinfo = $("#js-widget-appinfo");

             // 判断有没有已经触碰到 页脚
            if( (pageTop + appWidgetHeight + 50) >= footerOffset.top){
                    appinfo.css({
                        position:"absolute",
                        top: footerOffset.top - appWidgetHeight -50,
                        left: 0,
                        zIndex:1,
                        width: appWidgetWidth
                    });
            } else {
                //在没有触屏的情况下
                appinfo.css({
                    position: "fixed",
                    top: 10 + $(".r-header").outerHeight(true) +10,
                    left: appWidgetSrcOffset.left,
                    zIndex:1,
                    width: appWidgetWidth
                });

            }

        }else {
             // 在原来的位置上的时候
             $("#js-appWidget-placeholder").remove();
             $("#js-widget-appinfo").css({
                position: "",
                top: "",
                left: "",
                zIndex: ""
             });

             // hasAppWidgetPlaceholder = false;
         }
    }



    // 等到是文章内容的图片是否加载完毕
    if( hasAppWidget ){

        var imgdefereds=[];
        $(".r-container img").each(function(){
            var dfd = $.Deferred();
            $(this).on("load error",function(){
                dfd.resolve();
            });

            if(this.complete) {
                setTimeout(function(){
                    dfd.resolve();
                }, 1000);
            }
            imgdefereds.push(dfd);
        });

        $.when.apply(null,imgdefereds).done(function(){
            setAppWidgetEvn();
            appWidgetDelay = false;
        });

    }

    // 窗口滚动时
    $(window).scroll(function(){
        var pageTop = $(document).scrollTop();
        setHeaderStyle(pageTop);
        setAPPWidgetStyle(pageTop);
    });

    // 窗口变化时
    $(window).resize(function(){
         var pageTop = $(document).scrollTop();
        setHeaderStyle(pageTop);
        setAppWidgetEvn();
    });




    // 回滚到顶部的效果
    $(".m-rollback").click(function(){
        $("body, html").animate({scrollTop: 0}, '500','swing');
        return false;
    });



    // 电脑版的 上一篇文章和下一篇文章
    $("<div>").addClass("disktop-post-nav").append($(".post-nav a").clone()).appendTo("body");

    // hover上去，停留0.29秒後，再緩慢顯示。
    $(".disktop-post-nav a").hover(function(){
        var $this = $(this);
        setTimeout(function(){
            if($this.is(":hover")){
                $this.addClass("hover");
            }
        }, 290);
    },function(){
        var $this = $(this);
        $this.removeClass("hover");
    })



    // 拉微博评论数
    var urls = [];
    // 获得全部文章的URL
    $(".m-post, .post-item").each(function(){
        var $post = $(this);
        urls.push($post.data('url'));
    });


    var urlReqStr = urls.join("&url_long=");
    $.getJSON( window.siteBasePath + "comment/weibo?url_long=" +urlReqStr,function(data){
        for(var i = 0,l= data.length; i < l; i++){
            var url = data[i].url_long;
            var count = data[i].comment_counts;
            var countArea = $("[data-url='"+url+"'] .comment-count, [data-url='"+url+"'] .comments");
            countArea.each(function(){
                // 把评论数加上新浪微博的评论数
                $(this).text(parseInt($(this).text(),10) + parseInt(count,10));
            });
        }
    });



});