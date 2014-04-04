define([
    'jquery',
    'template',
    'backbone',
    'underscore',
    'text!../../../template/article/synLlist.html',
    '../PaginationView',
    '../../model/article/synList',
    '../../model/set/sync',
    ],

function($, template, Backbone,_, listTpl,PaginationView,ListModel,syncModel){


    return Backbone.View.extend({
        el:"#js_mainContent",
        model: ListModel,
        syncModel:syncModel,
        template:listTpl,
        initialize: function(obj){
            var status = this.status = obj.status == undefined ? 1 : obj.status;
            var page =  obj.page == undefined ? 1 : obj.page;
            this.model = new this.model(status,page);
            this.syncModel = new this.syncModel();
            Saturn.defer(
                [
                    {
                        object: this.model,
                        method:'fetch',
                    },
                    {
                        object:this.syncModel,
                        method:'fetch',
                    }
                ],function(data){
                    this.render(data);
                }.bind(this)
            )
        },
        events:{
            'click span[operate=sync]' : 'update',
            'click #js_operateCheckBox': 'operateCheckBox',
            'click #js_batchOperate' : 'batchOperate',
        },
        render: function(data) {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!Saturn.isCurrentView("article","articleSyn")){
                return false;
            }
            this.model.set('sites',data[1].attributes);
            var html = template.compile(this.template)(this.model.attributes);

            Saturn.renderToDom(html,this.el);
            // 必须在渲染全局页面之后，才能渲染分页器
            var pagination = new PaginationView({
                                    url : '#article/articleSyn/'+this.status,
                                    data : this.model.attributes.data
                                });
            $('#js_secondNav').find('a').removeClass('active')
            $('#js_secondNav').find('a').eq(this.status).addClass('active');
        },
        operateCheckBox:function(){
            var target = event.target || window.event.srcElement;
            var bool = $(target).prop('checked');
            $(target).parents('table').find('input[type=checkbox]').prop('checked',bool);

        },
        update:function(e){
            var id = $(e.target).attr('operateId');
            this.model.update(this.status,id);
        },
        batchOperate:function(){
            var ids = [];
            if(!type) return false;
            $('#js_articleListContent input[type=checkbox][operateId]:checked').each(function(){
                ids.push($(this).attr('operateId'));
            })
            this.model.update(this.status,ids,function(data){
                window.location.reload();
            })
        },
        operateCheckBox:function(e){
            var bool = $(e.target).prop('checked');
            $(e.target).parents('table').find('input[type=checkbox]').prop('checked',bool);
        },
    });
}

);