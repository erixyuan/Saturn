define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/apkCreate.html',
    '../../model/plugin/apkEdit',
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
            this.model.update(this.model.attributes);
        }
    });
}

);