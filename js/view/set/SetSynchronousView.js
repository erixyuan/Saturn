define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/set/setSynchronous.html',
    '../../model/article/syncList',
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
            $('body').removeClass().addClass('m-list-plugin');
            var html = template.compile(this.template)({});
            Saturn.renderToDom(html,'#js_mainContent');
        }
    });
}

);