define([
    'jquery',
    'template',
    'backbone',
    '../model/nav'
    ],

function($, template, Backbone, model){

    var headerTpl = '{{each data as value index}}'+
                    '<li>'+
                        '<a href="#{{value.module}}" module="{{value.module}}" title="{{value.name}}">'+
                            '<span class="{{value.css}}"></span>'+
                            '<strong>{{value.name}}</strong>'+
                        '</a>'+
                    '</li>'+
                    '{{/each}}';

    var sideTpl = '{{each data as value index}}'+
                  '<li><a href="#{{value.parent}}/{{value.module}}" class="" module="{{value.module}}">{{value.name}}</a></li>'+
                  '{{/each}}';

    var navView = Backbone.View.extend({
        el:"#js_topNav",
        model: model,
        headerTpl:headerTpl,
        sideTpl : sideTpl,
        initialize: function(obj){
            Saturn.navModel = this.model  = new this.model();

            this.render();
            this.model.bind('change',this.sideRender,this);
        },
        events:{
            //'blur #js_mybook' : 'updateModel'//失去焦点事件
        },
        render: function(context) {
            var html = template.compile(this.headerTpl)({data:this.model.get('data')});
            $(this.el).html(html);
        },
        sideRender:function(){
            var module = Saturn.navModel.get('currentModule');
            var seconMmodule= Saturn.navModel.get('secondModule');
            if(module !== undefined){
                var html = template.compile(this.sideTpl)({data:this.model.get('data')[module].child});
                $('#js_sidebar').html(html);
                //$('#js_sidebar a').removeClass('active');
            }else{
                var html = template.compile(this.sideTpl)({data:this.model.get('data')[module].child});
                $('#js_sidebar').html(html);
                //$('#js_sidebar a').removeClass('active');
            };

            $('#js_topNav a').removeClass('active');
            $('#js_topNav a[module="'+module+'"]').addClass('active');

            $('#js_sidebar a').removeClass('active');
            $('#js_sidebar a[module="'+seconMmodule+'"]').addClass('active')
        },
        updateModel: function(){
            debugger;
        }
    });
    // 模块现在返回实例化后的view
    // 有的时候你可能需要返回未实例化的view，可以写 return projectListView
    return new navView();
}

);