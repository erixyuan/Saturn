define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/set/themesList.html',
    //'../../model/article/syncList',
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