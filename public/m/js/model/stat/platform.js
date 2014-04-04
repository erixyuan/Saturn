define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/stat/platform',
        initialize:function(obj){

        },
        update:function(obj,callback) {
            var url = Saturn.cmsPath+'ipa/stat/platform?'
            if (obj) {
                for(var i in obj){
                    url += (i+'='+obj[i]+'&')
                }
            }
            $.ajax({
                url:url,
                beforeSend:function(){
                    Saturn.beginLoading()
                },
                success:function(data){
                    if(data.errCode == 0){
                        callback && callback(data);
                    }else{
                        alert(data.msg);
                    }
                    Saturn.afterLoading();
                }
            })
        },
        validate:function(attributes){

        }
    });

}

);