define([
    'jquery',
    'template',
    'backbone',
    //'../../model/article/articleEdit_plugin_applicationList'
    '../../model/product/list'
    ],




function($, template, Backbone, ListModel){
    var tpl ='{{each products as product index}}'+
                '<a href="javascript:void(0)" class="btn-app" productId="{{product.id}}">'+
                    '{{if product.cover=="" || product.cover==null}}'+
                        '<img src="img/DefaultApplicationIcon.png" alt="{{product.name}}" title="{{product.name}}">'+
                    '{{else}}'+
                        '<img src="{{product.cover.thumb_url}}" alt="{{product.name}}" title="{{product.name}}">'+
                    '{{/if}}'+
                '</a>'+
            '{{/each}}';

    return Backbone.View.extend({
        el:"#js_widgetProductList",
        modelSource: ListModel,
        template:tpl,
        initialize: function(obj){
            obj = obj ? obj : {};
            this.model = new this.modelSource('all','1',obj.keyword);  // 3.初始化模型
            this.model.fetch({
                success:function(model,respones){
                    this.render(model);

                }.bind(this)
            });                                 // 5.从服务器拉取数据
        },
        events:{
            'click #js_widgetProductListClose':"closeList",
            'click #js_widgetProductListContent a': 'add',
            'click #js_searchProductBtn' : 'search',

        },
        render: function(model) {
            //加载模板到对应的el属性中
            var html = template.compile(this.template)({products:model.get('data') || []});
            $("#js_widgetProductListContent").html(html);
            $('#js_widgetProductList').css('display','block');
        },
        closeList: function(){
            $('#js_widgetProductList').css('display',"none");
        },
        add:function(e){
            // BAD:检查是否已经加入了该应用
            var target = $(e.target).parent();
            var targetId = target.attr('productId');
            var exist = 0;
            $('#js_productListContent a').each(function(){
                if($(this).attr('productId') == targetId){
                    exist =1;
                }
            })
            if (exist == 0 ) {
                var html = target.clone().append('<i class="fa fa-times" operate="delete"></i>')
                $('#js_productListContent').prepend(html);
                target.css('background','#js_A34B4B');
            };
        },
        delete:function(e){
            $(e.target).parent('a').remove();
        },
        search:function(){
            var keyword = $('#js_searchProductText').val();
            this.initialize({keyword:keyword})
        }
    });
}

);