define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/userList.html',
    '../../model/role/userList',
    '../PaginationView',
    ],

function($, template, Backbone, tpl,model,PaginationView){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model(obj.keyword,obj.page);  // 3.初始化模型
            this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({
                success:function(model,response){
                    this.render();
                }.bind(this)
            });
        },
        events:{
            "click span[operate=delete]" : 'delete',
            'click #searchBtn' : 'search',
            'keypress #searchKeyWord' : 'keypressSearch',
        },
        render: function(obj) {
            _.each(this.model.get('data'),function(value,key,list){
                value.formatRegistered = Saturn.formatTime(value.registered);
                value.formatLogined = Saturn.formatTime(value.logined);
            })
            var html = template.compile(this.template)({data:this.model.get('data')});
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
            var pagination = new PaginationView({
                                    url : this.model.get('keyword') ?
                                               '#userManage/user/list/'+this.model.get('keyword') :
                                               '#userManage/user/list',
                                    data : this.model.attributes
                                });
        },
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id,this.status);
        },
        search:function(){
            var keyword = $('#searchKeyWord').val();
            if(!keyword){
                return false;
            }
            // 组装hash请求
            window.location.hash = '#userManage/user/list/'+keyword+"/1";
        },
        keypressSearch:function(e){
            if(e.keyCode == 13){
                this.search();
            }
        }
    });
}

);