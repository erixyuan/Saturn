define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        submitUrl:Saturn.cmsPath+'ipa/article',
        initialize:function(id){
            // 如果有id，代表是编辑文章
            // 如果没有id，代表是新建文章
            if (id != undefined) {
                this.url = Saturn.cmsPath+'ipa/article/'+id;
            }else{
                this.url = Saturn.cmsPath+'ipa/article/create';
            }

        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        sync:function(method, model, options){
            console.log(method+model+options);
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
                options.url = this.url;
                break;
             }
            return Backbone.sync(method, model, options);
        }
    });
}

);