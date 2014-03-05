
define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/roleEdit.html',
    '../../model/role/roleEdit',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        template : tpl,
        model: model,
        initialize: function(obj){
            // id存在代表是编辑，不存在代表是新建
            if(obj.id){
                this.id = obj.id;
                this.model = new this.model(obj.id);  // 3.初始化模型
                this.model.fetch({
                    success:function(model,data){
                        this.render(data);
                    }.bind(this)
                })
            }else{
                this.render();
            }

        },
        events:{
            "click input[child-checkbox]" : 'updateCheckbox',
            "click #js_submit" : 'update',
        },
        render: function(data) {
            var html = template.compile(this.template)(data);
            Saturn.renderToDom(html,'#js_mainContent');
        },
        update:function(){
            var obj = {};
            // id是用于判断是否是新建的用户
            if(this.id){
                obj.id = this.id;
            }
            obj.display_name = $('#js_display_name').val();
            obj.name = $('#js_name').val();
            $('#js_auth').find('input[type=checkbox]:checked').each(function(){
                var name  = $(this).attr('name');
                obj[name] = true;
            })
            console.log(obj);
            this.model.update(obj);
        },
        updateCheckbox:function(e){
            if($(e.target).prop('checked')){
                $(e.target).parent('div').find('input').eq(0).prop('checked',true);
            }
        }
    });
}

);