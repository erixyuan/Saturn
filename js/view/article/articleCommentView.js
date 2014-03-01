define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/article/comment.html',
    '../../model/article/comment',
    ],

function($, template, Backbone, tpl,modelData){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: modelData,
        template:tpl,
        initialize: function(obj){
            var that = this;


            this.model = new this.model();
            this.render();
        },
        events:{
            'click span[operate=delete]' : 'deleteComment',
            'click span[operate=refuse]' : 'refuseComment',
            'click span[operate=pass]' : 'passComment',
        },
        render: function() {
            var that = this;
            this.model.fetch({
                success:function(model,response){
                    var html = template.compile(that.template)(that.model.attributes);
                    Saturn.renderToDom(html,this.el);
                }
            });

        },
        refuseComment: function(){
            var target = event.target || window.event.srcElement;
            this.model.refuse($(target).attr('operateid'));
            this.render();
        },
        deleteComment:function(){
            var target = event.target || window.event.srcElement;
            this.model.delete($(target).attr('operateid'));
            this.render();
        },
        passComment:function(){
            var target = event.target || window.event.srcElement;
            this.model.pass($(target).attr('operateid'));
            this.render();
        }
    });
}

);