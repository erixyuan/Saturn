define([
    'jquery',
    'template',
    'backbone',
    'underscore',
    'text!../../../template/article/list.html',
    '../PaginationView',
    '../../model/article/list'
    ],

function($, template, Backbone,_, listTpl,PaginationView,ListModel){


    return Backbone.View.extend({
        el:"#js_mainContent",
        model: ListModel,
        template:listTpl,
        initialize: function(obj){
            // 判断obj是否给出了状态和页

            if (obj == undefined) {
                var status = 'all';
                var page = '1';
                var keyword;
            }else{
                console.log(obj)
                var status = this.status = obj.status == undefined ? 'all' : obj.status;
                var page = obj.page == undefined ? '1' : obj.page;
                var keyword = obj.keyword;
            }
            Saturn.articleList = this.model = new this.model(status,page,keyword);  // 3.初始化模型
            this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this)
            });                                 // 5.从服务器拉取数据
        },
        events:{
            'click span[operate=delete]' : 'deleteList',
            'click #js_operateCheckBox': 'operateCheckBox',
            'click #js_batchOperate': 'batchOperate',
            'click #searchBtn' : 'search',
            'keypress #searchKeyWord' : 'keypressSearch',
        },
        render: function() {

            _.each(this.model.get('data'),function(value,key,list){
                if (value.published) {
                    value.formatPublished = Saturn.formatTimeToDate(value.published);
                }else{
                    value.formatPublished = '未发布'
                }
            })
            var html = template.compile(this.template)(this.model.attributes)
            Saturn.renderToDom(html,this.el);

            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');

            // 创建分页对象
            //判断有关键字的时候，特殊处理
            var pagination = new PaginationView({
                                    url : this.model.get('keyword') ?
                                               '#article/list/'+this.status+'/'+this.model.get('keyword') :
                                               '#article/list/'+this.status,
                                    data : this.model.attributes
                                });
        },
        batchOperate:function(e){
            var type = $('#js_batchOperateSelect').val();
            var ids = [];
            if(!type) return false;
            $('#js_articleListContent input[type=checkbox][operateId]:checked').each(function(){
                ids.push($(this).attr('operateId'));
            })
            this.model.batchOperate(type,ids,function(data){
                window.location.reload();
            })
        },
        operateCheckBox:function(e){
            var bool = $(e.target).prop('checked');
            $(e.target).parents('table').find('input[type=checkbox]').prop('checked',bool);
        },
        deleteList:function(e){
            var id = $(e.target).attr('operateid');
            this.model.delete(id,function(data){
                window.location.reload();
            })
        },
        search:function(){
            var keyword = $('#searchKeyWord').val();
            if(!keyword){
                return false;
            }
            // 组装hash请求
            window.location.hash = '#article/list/'+this.status+'/'+keyword+"/1";
        },
        keypressSearch:function(e){
            if(e.keyCode == 13){
                this.search();
            }
        }
    });
}

);