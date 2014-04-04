define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/stat/appdown.html',
    '../../model/stat/appdown'
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainHeader",
        model: model,
        template:tpl,
        initialize: function(obj){
            var that = this;
            this.model = new this.model();  // 3.初始化模型
            this.model.fetch({
                success : function(model,response){
                    that.render()
                }
            });


        },
        events:{
            'blur #js_mybook' : 'updateModel'//失去焦点事件
        },
        render: function() {


            var ranges = this.model.get('ranges').map(function(obj){
                return {
                    begin: Saturn.formatTime(obj.begin).substr(0,10),
                    end:Saturn.formatTime(obj.end).substr(0,10)
                }
            });
            var data = this.model.get('data');

            var html = template.compile(this.template)({dates:ranges,data:data});
            Saturn.renderToDom(html,'#js_mainContent');

        },
        updateModel: function(){
            debugger;
        }
    });
}

);