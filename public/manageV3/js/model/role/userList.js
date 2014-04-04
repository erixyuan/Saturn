define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(keyword,page){
            var page = page == undefined ? 1 : page;
            if (keyword) {
                this.url = Saturn.cmsPath+'ipa/user?keyword='+keyword+'&page='+page;
            }else{
                this.url = Saturn.cmsPath+'ipa/user?page='+page;
            }
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        delete:function(id,status){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/user/'+id,
                    type:'DELETE',
                    beforeSend:function(){
                        Saturn.beginLoading('删除中...');
                    },
                    success:function(data){
                        // if(data.errCode == 0){
                        //     Saturn.afterLoading();
                        //     $('span[operateId='+id+']').parents('tr').remove();
                        // }else{
                        //     alert('删除失败')
                        // }

                        var target = $('span[operateId='+id+']').parents('tr')
                        if(data.errCode == 0){
                            if (status == 'all') {
                                if (target.find('#js_status').text() == "-99") {
                                    target.remove();
                                }else{
                                    target.find('#js_status').html('-99');
                                }
                            }else{
                                target.remove();
                            }
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