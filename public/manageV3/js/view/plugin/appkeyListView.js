define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/appkeyList.html',
    '../../model/plugin/appkeyList',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model();
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this),
            })

        },
        events:{
            'click span[operate=delete]':'delete',
        },
        render: function() {
            var html = template.compile(this.template)({data:this.model.attributes});
            Saturn.renderToDom(html,'#js_mainContent');
        },
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id,function(data){
                $(this).parents('tr').remove();
            }.bind(target))
        },
    });
}

);
