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
                var status = 'publish';
                var page = '1';
                var keyword;
            }else{
                var status = obj.status == undefined ? 'publish' : obj.status;
                var page = obj.page == undefined ? '1' : obj.page;
                this.keyword = obj.keyword;
                this.category = obj.category ? obj.category : undefined;
                this.author = obj.author ? obj.author : undefined;
            }
            Saturn.appList = this.model = new this.model(status,page,obj.keyword,obj.category,obj.author);  // 3.初始化模型
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
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!Saturn.isCurrentView("application","list")){
                return false;
            }
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

            /******************************************************
             * 分页设置    开始
             ******************************************************/
            var paginationSetting = {
                                    url : this.model.get('keyword') ?
                                               '#application/list/'+this.status+'/'+this.model.get('keyword') :
                                               '#application/list/'+this.status,
                                    params: {},
                                    data : this.model.attributes
            };
            // 判断如果有分类id的话，就加入该属性
            if (this.model.get('cid') != undefined) {
                paginationSetting.params.category = this.model.get('cid')
            };
            // 判断如果有作者id的话，就加入该属性
            if (this.model.get('yid') != undefined) {
                paginationSetting.params.author = this.model.get('yid')
            };
            var pagination = new PaginationView(paginationSetting);
            /******************************************************
             * 分页设置     结束
             ******************************************************/

             /* 判断如果当前列表是搜索页面就显示清除按钮 */
            if(this.keyword){
                $('a[clearSearch]').css("display","inline");
                $('#js_secondNav span').html('');
                $('#searchKeyWord').val(this.keyword);
            }

        },
        batchOperate:function(){
            var type = $('#js_batchOperateSelect').val();
            var ids = [];
            if(!type) return false;
            $('#js_applicationListContent input[type=checkbox][operateId]:checked').each(function(){
                ids.push($(this).attr('operateId'));
            })
            if (confirm('确定？')) {
                this.model.batchOperate(type,ids,function(data){
                    window.location.reload();
                })
            };

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