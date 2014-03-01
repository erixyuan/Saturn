define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/application/list.html',
    '../../model/application/list',
    '../PaginationView',
    ],

function($, template, Backbone, tpl,model,PaginationView){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            if (obj == undefined) {
                var status = 'all';
                var page = '1';
            }else{
                var status = obj.status == undefined ? 'all' : obj.status;
                var page = obj.page == undefined ? '1' : obj.page;
            }
            Saturn.appList = this.model = new this.model(status,page);  // 3.初始化模型
            this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({
                success:function(model,response){
                    this.render();
                }.bind(this)
            });

        },
        events:{
            "click span[operate=delete]" : 'delete',
            'click #js_operateCheckBox': 'operateCheckBox'
        },
        render: function() {
            this.status = this.model.get('status');
            _.each(this.model.get('data'),function(value,key,list){
                if (value.created) {
                    value.formatCreated = Saturn.formatTime(value.created);
                }
            })
            var html = template.compile(this.template)({data:this.model.get('data')});
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
            var pagination = new PaginationView({
                                    url:'#application/list/',
                                    data:this.model.attributes
                                });
        },
        operateCheckBox:function(){
            var target = event.target || window.event.srcElement;
            var bool = $(target).prop('checked');
            $(target).parents('table').find('input[type=checkbox]').prop('checked',bool);

        },
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id,this.status);
        }
    });
}

);