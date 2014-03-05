define([
    'jquery',
    'template',
    'backbone',
    'underscore',
    'text!../../../template/article/synLlist.html',
    '../PaginationView',
    '../../model/article/synList'
    ],

function($, template, Backbone,_, listTpl,PaginationView,ListModel){


    return Backbone.View.extend({
        el:"#js_mainContent",
        model: ListModel,
        template:listTpl,
        initialize: function(obj){
            Saturn.articleList = this.model = new this.model();
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this)
            });
        },
        events:{
            'click span[operate=sync]' : 'update',
        },
        render: function() {

            var html = template.compile(this.template)(this.model.get('data'));

            var pagination = new PaginationView({
                                    url:'#article/articleSyn/',
                                    data:this.model.attributes
                                });
            Saturn.renderToDom(html,this.el);
        },
        operateCheckBox:function(){
            var target = event.target || window.event.srcElement;
            var bool = $(target).prop('checked');
            $(target).parents('table').find('input[type=checkbox]').prop('checked',bool);

        },
        update:function(e){
            var id = $(e.target).attr('operateId');
            this.model.update(id);
        }
    });
}

);