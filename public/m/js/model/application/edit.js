define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        submitUrl:Saturn.cmsPath+'ipa/application',
        initialize:function(id){
            // 如果有id，代表是编辑文章
            // 如果没有id，代表是新建文章
            if (id != undefined) {
                this.url = Saturn.cmsPath+'ipa/application/'+id;
            }else{
                this.url = Saturn.cmsPath+'ipa/application/create';
            }

        },
        defaults: {
            //name: "Harry Potter"
        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/application/',
                data:JSON.stringify(data),
                type:"post",
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('发布中...');
                },
                success:function(data){
                    callback && callback(data);
                    Saturn.afterLoading('发布中...');
                }
            })
        }
    });
}

);