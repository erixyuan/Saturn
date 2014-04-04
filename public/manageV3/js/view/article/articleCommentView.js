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
            if(obj){
                this.model = new this.model(obj.status,obj.page);
            }else{
                this.model = new this.model();
            }
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this)
            })
        },
        events:{
            'click span[operate=delete],span[operate=refuse],span[operate=publish],#js_batchOperate' : 'operate',
            'click ': 'operateCheckBox'
        },
        render: function() {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!Saturn.isCurrentView("article","comment")){
                return false;
            }
            _.each(this.model.get('data'),function(value,key,list){
                if (value.created) {
                    value.formatCreated = Saturn.formatTimeToDate(value.created);
                }
            })
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,this.el);
        },
        operateCheckBox:function(e){
            var bool = $(e.target).prop('checked');
            $(e.target).parents('table').find('input[type=checkbox]').prop('checked',bool);
        },
        operate:function(e){
            var type;
            if($(e.target).attr('operate')){
                var id = $(e.target).attr('operateid')
                type = $(e.target).attr('operate');
                this.model.operate(type,id,function(){
                    window.location.reload();
                })
            }else{
                type = $('#js_batchOperateSelect').val();
                var ids = [];
                if(!type) return false;
                $('#js_commentListContent input[type=checkbox][operateId]:checked').each(function(){
                    ids.push($(this).attr('operateId'));
                })
                this.model.operate(type,ids,function(data){
                    window.location.reload();
                })
            }
        }
    });
}

);