define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/stat/pv',
        initialize:function(state,page){

        },
        defaults: {

        },
        validate:function(attributes){

        },
        update:function(obj,callback) {
            var url = Saturn.cmsPath+'ipa/stat/pv?'
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
    });

}

);