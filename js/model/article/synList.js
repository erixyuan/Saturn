define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(page){
            var page = page ? page : 1 ;
            this.url = Saturn.cmsPath+'ipa/sync/?page='+page;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/sync',
                type:'post',
                dataType:'json',
                data:JSON.stringify({ids:[data]}),
                contentType : 'application/json',
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