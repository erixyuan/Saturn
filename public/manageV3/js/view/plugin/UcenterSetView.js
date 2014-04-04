define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/ucenterSet.html',
    //'../../model/plugin/pluginList',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        //model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.render();
        },
        events:{
            "click span[operate=delete]" : 'delete',
        },
        render: function() {
            var html = template.compile(this.template)({});
            Saturn.renderToDom(html,'#js_mainContent');
        }
    });
}

);