define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/stat/platform.html',
    '../../model/stat/platform',
    '../../model/set/system'
    ],

function($, template, Backbone, tpl,model,systemModel){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        systemModel:systemModel,
        template:tpl,
        initialize: function(obj){
            var that = this;
            this.model = new this.model();  // 3.初始化模型
            this.systemModel = new this.systemModel('')
            this.model.fetch({
                success : function(model,response){
                    that.render()
                }
            })
        },
        events:{
            'blur #js_mybook' : 'updateModel',//失去焦点事件
            'click #js_update': 'update',
        },
        render: function() {


            var ranges = this.model.get('ranges').map(function(obj){
                return {
                    begin: Saturn.formatTime(obj.begin).substr(0,10),
                    end:Saturn.formatTime(obj.end).substr(0,10)
                }
            });

            var data = {};
            var count ={};
            _.each(this.model.get('data'),function(value, key, list){
                _.each(value,function(value, key, list){
                    if (data[key] == undefined) {
                        data[key] = [];
                        count[key] = 0;
                        data[key].push(key);
                    }
                    data[key].push(value);
                    count[key] += value;
                })
            });
            var html = template.compile(this.template)({
                dates:ranges,
                data:data,
                count:count
            });
            Saturn.renderToDom(html,'#js_mainContent');
        },
        update: function(){
            var from = new Date($('#js_from').val()).getTime()/1000;
            var to = new Date($('#js_to').val()).getTime()/1000;
            var group_by = $('#js_group_by').val();
            this.model.update({
                from : from,
                to : to,
                group_by : group_by
            },function(data){
                this.model.set(data);
                this.render();
            }.bind(this))
        }
    });
}

);