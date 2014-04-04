define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/set/setSynchronous.html',
     '../../model/set/sync',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new model();
            this.model.fetch({
                success:function(model,data){
                    this.render(data)
                }.bind(this)
            })
        },
        events:{
            "click #js_update" : "update",
        },
        render: function(data) {
            var html = template.compile(this.template)({data:data});
            Saturn.renderToDom(html,'#js_mainContent');
        },
        update:function(){
            this.model.update($('#js_syncContent').val(),function(data){
                if(data.errCode == 0){
                    var html = [
                        '<p>(1) 5秒后或任意点击，返回</p>',
                        '<a href="#article/articleSyn">(2) 跳转到文章同步列表</a>'
                        ].join('');
                    Saturn.createDialog('同步设置成功',html,true);
                }else{
                    alert(data.msg);
                }
            });
        }
    });
}

);