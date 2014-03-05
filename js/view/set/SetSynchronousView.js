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
            this.model.update($('#js_syncContent').val());
        }
    });
}

);