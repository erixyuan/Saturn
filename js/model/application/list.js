define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(status,page,keyword){
            var status = status == undefined ? 'all' : status;
            var page = page == undefined ? 'all' : page;
            this.url = Saturn.cmsPath+'ipa/application/?'+'status='+status+'&page='+page;
            this.url = keyword ? this.url+'&keyword='+keyword : this.url;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        },
        delete:function(id,status){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/application/'+id,
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