define([
    'jquery',
    'template',
    'backbone',
    'text!../../template/home.html',
    //'../../model/article/list'
    ],

function($, template, Backbone, tpl){

    return Backbone.View.extend({
        el:"#js_mainContent",
        //model: ListModel,
        template:tpl,
        initialize: function(obj){
            this.render()
        },
        events:{
            //'blur #js_mybook' : 'updateModel'//失去焦点事件
        },
        render: function(context) {
            var html = template.compile(this.template)({});
            Saturn.renderToDom(html,'#js_mainContent');
        }
    });
}

);