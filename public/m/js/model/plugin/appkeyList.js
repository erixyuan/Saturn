define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(status,page){
            this.url = Saturn.cmsPath+'ipa/appkey';
        },
        defaults: {
            //name: "Harry Potter"
        },
        delete:function(id,callback){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/appkey/'+id,
                    type:'DELETE',
                    beforeSend:function(){
                        Saturn.beginLoading('删除中...');
                    },
                    success:function(data){
                        if(data.errCode == 0){
                            callback && callback(data);
                        }else{
                            alert(data.msg)
                        }
                        Saturn.afterLoading();
                    }
                })
            }
        }
    });
}

);