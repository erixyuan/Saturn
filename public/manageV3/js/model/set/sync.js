define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url : Saturn.cmsPath+'ipa/sync/sites',
        initialize:function(){
        },
        defaults: {
        },
        update:function(data,callback){
            $.ajax({
                url:this.url,
                type:'post',
                data:{site:data},
                beforeSend:function(){
                    Saturn.beginLoading("更新中")
                },
                success:function(data){
                    if (data.errCode == 0) {
                        callback && callback(data);
                    }else{
                        alert(data.msg);
                    }
                    Saturn.afterLoading();
                }
            })
        }
    });
}

);