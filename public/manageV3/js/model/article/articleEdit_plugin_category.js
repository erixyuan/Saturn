define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(type){
            this.url = Saturn.cmsPath+'ipa/category?type='+type;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        delete:function(id,func){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/category/'+id,
                    type:'DELETE',
                    beforeSend:function(){
                        Saturn.beginLoading('删除中...');
                    },
                    success:function(data){
                        if(data.errCode == 0){
                            Saturn.afterLoading();
                            $('span[operateId='+id+']').parents('tr').remove();
                        }else{
                            alert('删除失败')
                        }
                    }
                })
            }
        }
    });
}

);