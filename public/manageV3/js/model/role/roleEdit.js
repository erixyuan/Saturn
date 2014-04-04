define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(id){
            if(id){
                this.url = Saturn.cmsPath+'ipa/role/'+id;
            }else{
                this.url = Saturn.cmsPath+'ipa/role/create';
            }

        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/role',
                data:JSON.stringify(data),
                type:"post",
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('更新中...');
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
        }

    });
}

);