define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/stat/pv.html',
    '../../model/stat/pv'
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
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
            'click #js_update': 'update',
        },
        render: function() {

            //debugger;

            var ranges = this.model.get('ranges').map(function(obj){
                return {
                    begin: Saturn.formatTime(obj.begin).substr(0,10),
                    end:Saturn.formatTime(obj.end).substr(0,10)
                }
            });
            var data = this.model.get('data');

            for (var i = 0; i < data.length; i++) {
                data[i].begin = ranges[i].begin;
                data[i].end = ranges[i].end;
            };
            console.log(data);
            var html = template.compile(this.template)(data);
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