function SNCookie(){
    this._cookie = {};
    this._refreshCookie();
}

SNCookie.prototype.get = function (key) {
    key = this._trim(key);
    return this._cookie[key];
};

SNCookie.prototype.set = function(key,value,day){
    key = this._trim(key);
    value = this._trim(value);
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + day);
    var c_value=escape(value) + ((day==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=key + "=" + c_value;
    this._refreshCookie();
};


SNCookie.prototype._refreshCookie = function(){
    this._cookie = {};
    var _c = document.cookie.split(";");
    for(var i = 0, l = _c.length; i < l; i++){
        var kvStr = this._trim(_c[i]);
        var kvPart = this._readKV(kvStr);
        this._cookie[kvPart.key] = kvPart.value;
    }
};

SNCookie.prototype._readKV = function(str){
    var kvPart = [];
    var equIndex = str.indexOf("=");
    if(equIndex == -1){
        kvPart.key = str;
        kvPart.value = "";
    }else{
        kvPart.key = this._trim( str.substr(0,equIndex));
        kvPart.value = unescape(this._trim( str.substring(equIndex+1) ));
    }
    return kvPart;
};

SNCookie.prototype._trim = function(str){
    var str = str.replace(/^\s+/,""),
    end = str.length - 1;
    ws = /\s/;
   while (ws.test(str.charAt(end))) {
       end--;
   }
   return str.slice(0,end+1);
};


$.fn.setCursorPosition = function(position){
    if(this.lengh == 0) return this;
    return $(this).setSelection(position, position);
}

$.fn.setSelection = function(selectionStart, selectionEnd) {
    if(this.lengh == 0) return this;
    input = this[0];

    if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    } else if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }

    return this;
}

$.fn.focusEnd = function(){
    this.setCursorPosition(this.val().length);
}



$(function(){
    // 这个文件是 评论框的交互文件

    //未登录的情况下获得之前的登陆信息
    if( $("#js-create-comment #author").length == 1){
        var cookie = new SNCookie();
        var author = cookie.get("CM-author");
        var email = cookie.get("CM-email");
        if(author){
            $("#author").val(author);
            $("#email").val(email);
        }
    }


    // 当评论被按下
    $("#js-comments .reply").click(function(){
        var $this = $(this);
        var pid = $this.data("reply-comment-id");
        // 获得要回复的人的名字
        // 所在的评论
        var comment = $("#comment-id-" + pid);
        var author = $.trim(comment.find(".js-author:first").text());
        var commentID = $this.data("reply-comment-id");
        var parentCommentID = $this.data("reply-parent-comment-id");
        $("#message").val("回复 @" + author + " ").focus().focusEnd();

        // 填写回复评论的ID
        $("#new-comment-parent").val(pid);

        // 显示取消评论按钮
        $("#btn-cancel-reply").show();

        // 滚动到评论框
        $("body, html").animate({scrollTop: $("#js-comments").offset().top - $('.r-header').outerHeight(true) -20}, '500','swing');
        return false;
    });


    // 评论提交
    $("#js-create-comment").on("submit",function(){
        //未登录
        if( $("#js-create-comment #author").length == 1){
            var cookie = new SNCookie();
            cookie.set("CM-author",$("#author").val(),365);
            cookie.set("CM-email",$("#email").val(),365);
        }


        // 发布的时候，也是检测是否登陆和checkbox是否勾上
        // 如果前置条件成立，就发布到微博
        if($('#js-publish-to-weibo').prop('checked') && WB2.checkLogin()){
            var obj = WB2.Cookie.load();
            $('#weiboForm input[name=content]').val($('#message').val() + $("#weibo-url").val());
            $('#weiboForm input[name=uid]').val(obj.uid);
            $('#weiboForm input[name=access_token]').val(obj.access_token);
            $('#weiboForm').submit();
        }


        // 本地评论
        var $this = $(this);
            $.post($this.attr("action"),$this.serialize(),function(data){
                 var data = $.parseJSON(data);
                 // 拉取评论
                if(data.success){
                     $.get(window.location.href,function(pageData){
                            var page = $(pageData);
                            var comment = page.find("#comment-id-"+ data.comment.id);
                             if(data.comment.parent_id > 0) {
                                $("#comment-id-"+ data.comment.parent_id + " .sub-comment-thread").append(comment);
                            }else {
                                $("#js-comments .root-commits-thread").prepend(comment);
                            }

                            $("#message").val("");
                            $("body, html").animate({scrollTop: comment.offset().top - $(".r-header").outerHeight(true) - 20}, '500','swing');

                            $("#js-comments p.no-comments").remove();

                            //评论数+1
                            var $commentCount = $("#js-comments .count-comments strong");
                            var commentCount = parseInt($.trim($commentCount.text()),10) +1;
                            $commentCount.text(commentCount);
                            $(".comment-count").text(commentCount);
                     });
            } else {
                $("#captcha").val("");
            }

             // 显示成功和失败
            var commentAlert = $('<div class="sn-alert" id="comment"><div class="message">'+data.errmsg+'</div></div>');
            commentAlert.hide();
            commentAlert.appendTo($("body"));
            //淡入后三秒淡出
            commentAlert.fadeIn(function(){
                window.setTimeout(function(){
                    //淡出
                    commentAlert.fadeOut(function(){
                        commentAlert.remove();
                    });
                }, 6000);
            });

        });

        // 隐藏取消按钮
        $("#btn-cancel-reply").hide();
        return false;
    });


    // 取消回复
    $("#btn-cancel-reply").click(function(){
        $(this).hide();
        $("#message").val('');
        $("#new-comment-parent").val('');
        return false;
    });


    // ctrl+enter 发表评论
    $("#message").keydown(function(e){
        if (e.ctrlKey && e.keyCode === 13) {
            $("#js-create-comment").submit();
        }
    });


    // 刷新验证码
    $("#img-captcha").click(function() {
        var img = $(this).show().find("img");
        var src = img.attr("src");
        var urlpart = src.split("?");
        urlpart.pop()
        urlpart.push("?=" + (new Date().getTime()));
        img.attr("src", urlpart.join(""));
        return false;
    });





    // 如果有登陆了，就把checkbox勾上
    if(WB2.checkLogin()){
        $('#js-publish-to-weibo').prop('checked',true)
    }

    // 勾上checkbox，检查是否登陆，如果没有登陆，就走登陆
    $('#js-publish-to-weibo').click(function(){
        if($(this).prop('checked') && !WB2.checkLogin()){
            WB2.login()
        }
    });





});