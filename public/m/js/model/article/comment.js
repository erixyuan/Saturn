define([
    'underscore',
    'backbone',
    'jquery'
    ],

function(_, Backbone,$){
    return Backbone.Model.extend({
        initialize:function(status,page){
            if(status && page){
                this.url = Saturn.cmsPath+'ipa/comment?status='+status+'&page='+page;
            }else{
                this.url = Saturn.cmsPath+'ipa/comment';
            }
        },
        defaults: {
            //name: "Harry Potter"
        },
        operate:function(type,id,callback){
            var data = [];
            if(id instanceof Array){
                data = id;
            }else{
                data.push(id);
            }
            $.ajax({
                url:Saturn.cmsPath+'ipa/comment/'+type,
                data:JSON.stringify({ids:data}),
                type:"put",
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('处理中...');
                },
                success:function(data){
                    callback && callback(data);
                    Saturn.afterLoading();
                }
            })
        },
    });
}

);