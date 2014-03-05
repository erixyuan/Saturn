define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/application/list.html',
    '../../model/application/list',
    '../PaginationView',
    ],

function($, template, Backbone, tpl,model,PaginationView){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            if (obj == undefined) {
                var status = 'all';
                var page = '1';
                var keyword;
            }else{
                var status = obj.status == undefined ? 'all' : obj.status;
                var page = obj.page == undefined ? '1' : obj.page;
                var keyword = obj.keyword
            }
            Saturn.appList = this.model = new this.model(status,page,keyword);  // 3.初始化模型
            this.model.fetch({
                success:function(model,response){
                    this.render();
                }.bind(this)
            });

        },
        events:{
            "click span[operate=delete]" : 'delete',
            'click #js_batchOperate': 'batchOperate',
            'click #js_operateCheckBox': 'operateCheckBox',
            'click #searchBtn' : 'search',
            'keypress #searchKeyWord' : 'keypressSearch',
        },
        render: function() {
            this.status = this.model.get('status');
            _.each(this.model.get('data'),function(value,key,list){
                if (value.created) {
                    value.formatCreated = Saturn.formatTimeToDate(value.created);
                }
            })
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_secondNav a').removeClass('active');
            $('#js_secondNav a[status='+this.status+']').addClass('active');
            var pagination = new PaginationView({
                                    url : this.model.get('keyword') ?
                                               '#application/list/'+this.status+'/'+this.model.get('keyword') :
                                               '#application/list/'+this.status,
                                    data:this.model.attributes
                                });
        },
        batchOperate:function(){
            var type = $('#js_batchOperateSelect').val();
            var ids = [];
            if(!type) return false;
            $('#js_applicationListContent input[type=checkbox][operateId]:checked').each(function(){
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
        delete:function(e){
            var id = $(e.target).attr('operateId');
            this.model.delete(id,function(data){
                window.location.reload();
            });
        },
        search:function(){
            var keyword = $('#searchKeyWord').val();
            if(!keyword){
                return false;
            }
            // 组装hash请求
            window.location.hash = '#application/list/'+this.status+'/'+keyword+"/1";
        },
        keypressSearch:function(e){
            if(e.keyCode == 13){
                this.search();
            }
        }
    });
}

);