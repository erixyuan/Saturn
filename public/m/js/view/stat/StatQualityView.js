define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/stat/quality.html',
    //'../../model/stat/api'
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainHeader",
        model: model,
        template:tpl,
        initialize: function(obj){
            /*
            var that = this;
            this.model = new this.model();  // 3.初始化模型
            this.model.fetch({
                success : function(model,response){
                    that.render()
                }
            });
            */
            this.render();


        },
        events:{
            'blur #js_mybook' : 'updateModel'//失去焦点事件
        },
        render: function() {

            var data = [];
            // for(var i in this.model.attributes){
            //     var temp = this.model.attributes[i];
            //     temp.date = Saturn.formatTime(i).substr(0,10)
            //     data.push(temp);
            // }
            var html = template.compile(this.template)(data);
            Saturn.renderToDom(html,'#js_mainContent');
        },
        updateModel: function(){
            debugger;
        }
    });
}

);