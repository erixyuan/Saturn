define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:'',
        initialize:function(id){
            if (id) {
                this.url = Saturn.cmsPath+'ipa/ad/'+id;
            }else{
                this.url = Saturn.cmsPath+'ipa/ad/create';
            }
        },
        defaults: {
            key: "",
            name: "",
            items: ""
        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/ad',
                data:JSON.stringify(data),
                type:"post",
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('发布中...');
                },
                success:function(data){
                    if(data.errCode == 0){
                        callback && callback(data);
                    }else{
                        alert(data.msg);
                    }

                    Saturn.afterLoading('发布中...');
                }
            })
        }
    });
}

);