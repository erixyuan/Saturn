define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/appkeyCreate.html',
    '../../model/plugin/appkeyEdit',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            if (obj.id) {
                this.model = new model(obj.id);
                this.model.fetch({
                    success:function(){
                        this.render();
                    }.bind(this),
                })
            }else{
                this.model = new model();
                this.render();
            }
        },
        events:{
            "click #js_update":'update'
        },
        render: function() {
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');
        },
        update:function(){
            this.model.set({
                key:$('input[name=key]').val(),
                name:$('input[name=name]').val(),
                items:$('textarea[name=items]').val(),
            });
            this.model.update(this.model.attributes,function(data){
                if(data.errCode == 0){
                    var html = [
                        '<p>(1) 3秒后或任意点击，返回</p>',
                        '<a href="#plugin/appkeyList">(2) 跳转到appkey列表</a>'
                        ].join('');
                    Saturn.createDialog('提交成功',html,true);
                }else{
                    alert(data.msg);
                }
            });
        }
    });
}

);