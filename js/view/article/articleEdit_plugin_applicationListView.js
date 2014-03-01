define([
    'jquery',
    'template',
    'backbone',
    //'../../model/article/articleEdit_plugin_applicationList'
    '../../model/application/list'
    ],




function($, template, Backbone, ListModel){
    var tpl ='{{each applications as app index}}'+
                '<a href="javascript:void(0)" class="btn-app" applicationId="{{app.id}}">'+
                    '{{if app.icon=="" || app.icon==null}}'+
                        '<img src="img/DefaultApplicationIcon.png" alt="{{app.name}}" title="{{app.name}}">'+
                    '{{else}}'+
                        '<img src="{{app.icon.thumb_url}}" alt="{{app.name}}" title="{{app.name}}">'+
                    '{{/if}}'+
                '</a>'+
            '{{/each}}';

    return Backbone.View.extend({
        el:"#js_widgetApplicationListContent",
        model: ListModel,
        template:tpl,
        initialize: function(obj){
            obj = obj ? obj : {};
            this.model = new this.model('all','1',obj.keyword);  // 3.初始化模型
            this.model.fetch({
                success:function(model,respones){
                    this.render(model)
                }.bind(this)
            });                                 // 5.从服务器拉取数据
        },
        events:{


        },
        render: function(model) {
            //加载模板到对应的el属性中
            var html = template.compile(this.template)({applications:model.get('data') || []});
            $(this.el).html(html);
            $('#js_widgetApplicationList').css('display','block');
        },
        updateModel: function(){
            debugger;
        }
    });
    // 模块现在返回实例化后的view
    // 有的时候你可能需要返回未实例化的view，可以写 return projectListView
}

);