define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/set/clearCache.html',
    '../../model/set/cache',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model();
            this.render();
        },
        events:{
            'click #js_clearCacheBtn' : 'clearCache',
        },
        render: function() {
            var html = template.compile(this.template)({});
            Saturn.renderToDom(html,'#js_mainContent');
        },
        clearCache:function(){
            this.model.fetch({
                success:function(model,data){
                    if(data.errCode == 0){
                        var html = [
                        '<p> 3秒后或任意点击，返回</p>',
                        ].join('');
                        Saturn.createDialog('清除缓存成功',html,true);
                    }
                }
            })
        }
    });
}

);