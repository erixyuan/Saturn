define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/userEdit.html',
    '../../model/role/userEdit',
    '../../model/role/roleList',
    '../PaginationView',
    ],

function($, template, Backbone, tpl,model,roleModel,PaginationView){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        roleModel:roleModel,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model(obj.id);  // 3.初始化模型
            this.roleModel = new this.roleModel();
            this.roleModel.fetch({
                success:function(){
                    // 列表加载回来之后，再加载主题
                    this.model.fetch({
                        success:function(model,response){
                            this.render();
                        }.bind(this)
                    });
                }.bind(this)
            })
            this.model.bind('change',this.render,this);              // 4.绑定

        },
        events:{
            "click span[operate=delete]" : 'delete',
        },
        render: function(obj) {

            var html = template.compile(this.template)({data:this.model.attributes,allRole:this.roleModel.attributes});
            Saturn.renderToDom(html,'#js_mainContent');
            var role_ids = this.model.get('role_ids');
            if (role_ids) {
                for (var i = 0; i < role_ids.length; i++) {
                    $('#js_userRole').find('input[value='+role_ids[i]+']').prop('checked',true);
                };
            };

            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
        }
    });
}

);