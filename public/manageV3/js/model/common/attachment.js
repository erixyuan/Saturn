define([
    'underscore',
    'backbone',
    'jquery'
    ],

function(_, Backbone,$){
    return Backbone.Model.extend({
        initialize:function(type,id){
            if(type && id){
                this.url = Saturn.cmsPath+'ipa/attachment?type='+type+'&id='+id;
            }
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes,func){

        },
        sync:function(method, model, options){
            switch(method){
                case "create":
                    options.url =this.url;
                    break;
                case "update":
                    //当使用model.save()的方法，直接变成create，就是post方法
                    options.url = this.submitUrl;
                    method = 'create';
                    break;
                case "delete":
                    options.url = Saturn.cmsPath+'ipa/attachment/'+id;
                    break;
             }
            return Backbone.sync(method, model, options);
        },
        delete:function(id,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/attachment/'+id,
                type:'DELETE',
                beforeSend:function(){
                    Saturn.beginLoading('删除中...');
                },
                success:function(data){
                    callback && callback(data);
                    Saturn.afterLoading();
                }
            })
        },
        get:function(obj,callback){
            var url='';
            for(var i in obj){
                url += i+'='+obj[i]+'&';
            }
            var url = url.substr(0,url.length-1);
            $.ajax({
                url:Saturn.cmsPath+'ipa/attachment?'+url,
                type:'GET',
                success:function(data){
                    callback(data)
                }
            })
        }
    });
}

);