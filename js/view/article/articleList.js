define([
    'jquery',
    'template',
    'backbone',
    'underscore',
    'text!../../../template/article/list.html',
    'text!../../../template/article/sidebar.html',
    '../PaginationView',
    '../../model/article/list'
    ],

function($, template, Backbone,_, listTpl,sidebarTpl,PaginationView,ListModel){


    return Backbone.View.extend({
        el:"#js_mainContent",
        model: ListModel,
        template:listTpl,
        initialize: function(obj){
            if($('#js_articleList').length == 0){
                $('body').append(this.template);   //1. 如果模板不存在,把模板丢入body的底部
            }
            //2.判断obj是否给出了状态和页
            if (obj == undefined) {
                var status = 'all';
                var page = '1';
            }else{
                var status = obj.status == undefined ? 'all' : obj.status;
                var page = obj.page == undefined ? '1' : obj.page;
            }
            this.status = status;
            Saturn.articleList = this.model = new this.model(status,page);  // 3.初始化模型
            this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this)
            });                                 // 5.从服务器拉取数据
        },
        events:{
            'click span[operate=delete]' : 'deleteList',
            'click #js_operateCheckBox': 'operateCheckBox'
        },
        render: function() {

            $('body').removeClass().addClass('m-atricle-list');
            _.each(this.model.get('data'),function(value,key,list){
                if (value.published) {
                    value.formatPublished = Saturn.formatTime(value.published);
                }else{
                    value.formatPublished = '未发布'
                }
            })
            var html = template.render('js_articleList', this.model.attributes);
            //加载模板到对应的el属性中
            Saturn.renderToDom(html,this.el);
            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
            var pagination = new PaginationView({
                                    url:'#article/list/',
                                    data:this.model.attributes
                                });     // 创建分页对象
        },
        operateCheckBox:function(){
            var target = event.target || window.event.srcElement;
            var bool = $(target).prop('checked');
            $(target).parents('table').find('input[type=checkbox]').prop('checked',bool);

        },
        deleteList:function(){
            var target = event.target || window.event.srcElement;
            if (confirm("确定删除？")){
            var id = $(target).attr('operateId');    //获取删除的id
            if (id == undefined ) return false;
            $.ajax({
                url:Saturn.cmsPath+'ipa/article/'+id,
                type:"DELETE",
                //data:{ids:[id]},
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading("删除中...");
                },
                success:function(data){
                    //删除成功，如果是all子模块，就改变状态为-99，如果已经是-99，清除dom
                    if(data.errCode == 0){
                        if (this.status == 'all') {
                            if ($(target).parents('tr').find('#js_status').text() == "-99") {
                                $(target).parents('tr').remove();
                            }else{
                                $(target).parents('tr').find('#js_status').html('-99');
                            }
                        }else{
                            $(target).parents('tr').remove();
                        }
                    }else{
                        alert(data.msg)
                    }
                    Saturn.afterLoading();
                }.bind(this)
            })
        }

        }
    });
}

);