define([
    'jquery',
    'template',
    'backbone',
    'text!../../template/home.html',
    '../model/stat/pv',
    '../model/article/list'
    ],

function($, template, Backbone,tpl,pvModel){

    return Backbone.View.extend({
        el:"#js_mainContent",
        //model: ListModel,
        template:tpl,
        pvModel:pvModel,
        initialize: function(obj){
            // 获取今天的时间范围
            var nowTime = new Date();
            var nowYear = nowTime.getFullYear();
            var nowMonth = nowTime.getMonth()+1;
            var nowDate = nowTime.getDate();
            var nowDay = nowTime.getDay()-2;
            var timeFromMornong = new Date(nowYear+'-'+nowMonth+'-'+nowDate).getTime()/1000;
            this.pvModel = new this.pvModel()
            Saturn.defer([
                    {
                        object:this.pvModel,
                        method:'get',
                        params:{
                            from : timeFromMornong,
                            to : nowTime/1000,
                            group_by : 'day'
                        }
                    },
                    {
                        object:this.pvModel,
                        method:'get',
                        params:{
                            from : timeFromMornong,
                            to : nowTime/1000,
                            group_by : 'day'
                        }
                    }
                ],function(data){
                    this.render(data);
                }.bind(this))
            this.render()
        },
        events:{
            //'blur #js_mybook' : 'updateModel'//失去焦点事件
        },
        render: function(context) {
            var html = template.compile(this.template)({});
            Saturn.renderToDom(html,'#js_mainContent');
        }
    });
}

);