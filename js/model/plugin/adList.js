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
        delete:function(id,status){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/id/'+id,
                    type:'DELETE',
                    beforeSend:function(){
                        Saturn.beginLoading('删除中...');
                    },
                    success:function(data){
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