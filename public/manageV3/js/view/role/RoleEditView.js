
define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/roleEdit.html',
    '../../model/role/roleEdit',
    ],

function($, template, Backbone, tpl,model,roleList){

    return Backbone.View.extend({
        el:"#js_mainContent",
        template : tpl,
        model: model,
        initialize: function(obj){
            // id存在代表是编辑，不存在代表是新建
            this.id = obj.id;
            this.model = new this.model(obj.id);
            this.model.fetch({
                success:function(model,data){
                    this.render(data);
                }.bind(this)
            })
        },
        events:{
            "click input[child-checkbox]" : 'updateCheckbox',
            "click #js_submit" : 'update',
        },
        render: function(data) {
            var data = data == undefined ? {} : data;
            var html = template.compile(this.template)(data);

            Saturn.renderToDom(html,'#js_mainContent');
        },
        update:function(){
            var obj = {};
            // id是用于判断是否是新建的用户
            if(this.id){
                obj.id = this.id;
            }
            obj.perms = {};
            obj.display_name = $('#js_display_name').val();
            obj.name = $('#js_name').val();
            $('#js_auth').find('input[type=checkbox]:checked').each(function(){
                var name  = $(this).attr('name');
                obj.perms[name] = true;
            })
            this.model.update(obj,function(){
                if (this.id) {
                    var html = [
                        '<p> 3秒后自动刷新页面，或者手动刷新</p>',
                    ].join('');
                    Saturn.createDialog('发布成功',html,true);
                    setTimeout(function(){
                        window.location.reload();
                    }, 3000);
                }else{
                    window.location.hash="#userManage/role/list";
                }
            });
        },
        updateCheckbox:function(e){
            if($(e.target).prop('checked')){
                $(e.target).parent('div').find('input').eq(0).prop('checked',true);
            }
        }
    });
}

);