define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        submitUrl:Saturn.cmsPath+'ipa/product',
        initialize:function(id){
            // 如果有id，代表是编辑文章
            // 如果没有id，代表是新建文章
            if (id != undefined) {
                this.url = Saturn.cmsPath+'ipa/product/'+id;
            }else{
                this.url = Saturn.cmsPath+'ipa/product/create';
            }

        },
        defaults: {
            //name: "Harry Potter"
        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/product/',
                data:JSON.stringify(data),
                type:"post",
                contentType : 'product/json',
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