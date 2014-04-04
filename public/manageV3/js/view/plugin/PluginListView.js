define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/pluginList.html',
    '../../model/plugin/pluginList',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            Saturn.appList = this.model = new this.model();  // 3.初始化模型
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
            var data = {
                actived:[],     // 已经启用的
                disabled:[],    // 未启用的
                uninstall:[]    // 未安装的
            };
            _.each(this.model.attributes,function(value){
                if (!value.installed) {
                    data.uninstall.push(value);
                }else if(!value.activated){
                    data.disabled.push(value);
                }else{
                    data.actived.push(value);
                }

            })
            console.log(data);
            var html = template.compile(this.template)(data);
            Saturn.renderToDom(html,'#js_mainContent');
        },
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id,this.status);
        }
    });
}

);