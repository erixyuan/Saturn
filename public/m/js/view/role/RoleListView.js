define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/roleList.html',
    '../../model/role/roleList',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model();  // 3.初始化模型
            this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({
                success:function(model,response){
                    this.render();
                }.bind(this)
            });

        },
        events:{
            "click span[operate=delete]" : 'delete',
        },
        render: function() {
            var html = template.compile(this.template)({data:this.model.attributes});
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
        },
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id,this.status);
        }
    });
}

);