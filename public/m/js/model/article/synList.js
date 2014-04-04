define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(status,page){
            var status = status == undefined ? 0 : status;
            var page = page == undefined ? 0 : page ;
            this.url = Saturn.cmsPath+'ipa/sync/?site='+status+'&page='+page;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        update:function(site,id,callback){
            var data = [];
            if(id instanceof Array){
                data = id;
            }else{
                data.push(id);
            }
            $.ajax({
                url:Saturn.cmsPath+'ipa/sync',
                type:'post',
                data:JSON.stringify({ids:data,site:site}),
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading();
                },
                success:function(data){
                    if(data.errCode == 0){
                        callback && callback(data);
                    }else{
                        alter(data.msg);
                    }
                    Saturn.afterLoading();
                }
            })
        }
    });

}

);