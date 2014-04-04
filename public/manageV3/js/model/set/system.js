define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(key){
            if (key == undefined) {
                this.url = Saturn.cmsPath+'ipa/option'
            }else{
                this.url = Saturn.cmsPath+'ipa/option/'+key;
            }

        },
        defaults: {
        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/option',
                data:JSON.stringify(data),
                type:"post",
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('发布中...');
                },
                success:function(data){
                    if(data.errCode == 0){
                        callback && callback(data);
                    }else{
                        alert(data.msg);
                    }

                    Saturn.afterLoading('发布中...');
                }
            })
        }
    });
}

);