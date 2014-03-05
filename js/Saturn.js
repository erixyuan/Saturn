var Saturn = {
    cmsPath:document.location.href.match(/(.*public\/)/)[1],  //用来组装ipa请求,
    views:{}
}

Saturn.beginLoading = function(msg){
    if($('#js_loading').length != 0) return false;
    var msg = msg == undefined ? '正在加载数据.....' : msg;
    $('body').append('<div class="g-loading use-progress" style="" id="js_loading">'+
                     '<span class="img-loading"></span>'+msg+
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
      return new Date(time*1000).toISOString().substr(0,16)
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