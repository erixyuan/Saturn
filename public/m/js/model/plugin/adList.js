define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(){
            this.url = Saturn.cmsPath+'ipa/ad';
        },
        defaults: {
            //name: "Harry Potter"
        },
        delete:function(id,callback){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/ad/'+id,
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
        },
        batchOperate:function(type,data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/ad/'+type,
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