define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/userList.html',
    '../../model/role/userList',
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
            this.model = new this.model(status,page);  // 3.初始化模型
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
        render: function(obj) {

            var html = template.compile(this.template)({data:this.model.get('data')});
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
            var pagination = new PaginationView({
                                    url:'#userManage/user/list/',
                                    data:this.model.attributes
                                });
        },
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id,this.status);
        }
    });
}

);