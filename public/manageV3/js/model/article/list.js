define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(status,page,keyword,category){
            var status = status == undefined ? 'all' : status;
            var page = page == undefined ? '1' : page;
            this.url = Saturn.cmsPath+'ipa/article/?'+'status='+status+'&page='+page;
            this.url = keyword ? this.url+'&keyword='+keyword : this.url;
            this.url = category ? this.url+'&cid='+category : this.url;
        },
        defaults: {
            //name: "Harry Potter"
        },
        batchOperate:function(type,data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/article/'+type,
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
        delete:function(id,callback){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/article/'+id,
                    type:"DELETE",
                    contentType : 'application/json',
                    dataType: 'json',
                    beforeSend:function(){
                        Saturn.beginLoading("删除中...");
                    },
                    success:function(data){
                        //删除成功，如果是all子模块，就改变状态为-99，如果已经是-99，清除dom
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