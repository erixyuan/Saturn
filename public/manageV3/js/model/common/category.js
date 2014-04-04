define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(type){

            this.url = type == undefined ? Saturn.cmsPath+'ipa/category' : Saturn.cmsPath+'ipa/category?type='+type;
        },
        defaults: {
            //name: "Harry Potter"
        },
        getOne:function(id,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/category/'+id,
                beforeSend:function(){
                    Saturn.beginLoading('提交中...');
                },
                success:function(data){
                    callback && callback(data)

                    // if(data.errCode == 0){
                    //     callback && callback(data)
                    // }else{
                    //     alert(data.msg);
                    // }

                    Saturn.afterLoading();
                }
            })
        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/category',
                type:'post',
                data:JSON.stringify(data),
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('提交中...');
                },
                success:function(data){
                    if(data.errCode == 0){
                        callback && callback(data)
                    }else{
                        alert(data.msg);
                    }
                    Saturn.afterLoading();
                }
            })
        }
    });
}

);