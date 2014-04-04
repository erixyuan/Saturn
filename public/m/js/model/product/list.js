define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(status,page,keyword,category,author){
            var status = status == undefined ? 'all' : status;
            var page = page == undefined ? 'all' : page;
            this.url = Saturn.cmsPath+'ipa/product/?'+'status='+status+'&page='+page;
            this.url = keyword ? this.url+'&keyword='+keyword : this.url;
            this.url = category ? this.url+'&cid='+category : this.url;
            this.url = author ? this.url+'&uid='+author : this.url;
        },
        defaults: {
            //name: "Harry Potter"
        },
        batchOperate:function(type,data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/product/'+type,
                data:JSON.stringify({ids:data}),
                type:"put",
                contentType : 'product/json',
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
        delete:function(id,callback){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/product/'+id,
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