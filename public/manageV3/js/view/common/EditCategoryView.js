define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/common/editCategory.html',
    '../../model/common/category'
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:'#js_mainContent',
        model: model,
        template:tpl,
        initialize: function(obj){
            var that    = this;
            this.remain = obj ? 2 : 1;
            this.data   = [];

            this.model  = new this.model();
            this.model.fetch({
                success:function(model,response){
                    that.defer(0,response);
                }
            });
            if (obj) {
                this.model.getOne(obj.id,function(data){
                    that.defer(1,data);
                })
            };

        },
        events:{
            'click #js_updateBtn': 'update',
        },
        defer:function(i,data){
            // 延迟加载，为了等待2个数据都加载完成才开始渲染页面
            this.data[i] = data;
            if(!(--this.remain)){
                this.render(this.data);
            }
        },
        render: function(data) {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!(Saturn.isCurrentView("application","category") || Saturn.isCurrentView("article","category"))){
                return false;
            }
            var categories         = data[0].data;
            var categoriesArr      = [];
            var str                = '└─';
            var layerNum           = 0 ;
            categoriesArr          = this.categoriesTraversal(categories,categoriesArr,str,layerNum);


            this.cateinfo          = data[1] ? data[1] : {};     //因为创建的时候，没有data[1], 要做状态区别
            this.cateinfo.cateList = categoriesArr;

            var html               = template.compile(this.template)(this.cateinfo);
            Saturn.renderToDom(html,'#js_mainContent');

            $('#js_type').val(this.cateinfo.type);
            $('#js_parent_id').val(this.cateinfo.parent_id ? this.cateinfo.parent_id : 0);
            this.cateinfo.status ==1 ? $('#js_status').prop('checked',true) : $('#js_status').prop('checked',false);
        },
        categoriesTraversal:function(arr,categoriesArr,str,layerNum,parent){

            for (var i = 0; i < arr.length; i++) {
                if(arr[i].parent_id == '0'){
                    layerNum         = 0;
                    arr[i].layerNum  = layerNum;
                    arr[i].otherName = arr[i].name
                    categoriesArr.push(arr[i]);
                }else{
                    var tempStr = '';
                    arr[i].layerNum = parent.layerNum+1;
                    arr[i].otherName = str+arr[i].name
                    categoriesArr.push(arr[i]);
                }

                if(arr[i].childs.length != 0){
                    arguments.callee(arr[i].childs,categoriesArr,str,layerNum,arr[i]);
                }
            };
            return categoriesArr;
        },
        update:function(){
            var submitObject = {};
            for(var i in this.cateinfo){
                submitObject[i] = this.cateinfo[i];
            }
            submitObject.type        = $('#js_type').val();
            submitObject.parent_id   = parseInt($('#js_parent_id').val());
            submitObject.name        = $('#js_name').val();
            submitObject.slug        = $('#js_slug').val();
            submitObject.description = $('#js_description').val();
            submitObject.keywords    = $('#js_keywords').val() ? $('#js_keywords').val() : '';
            submitObject.order       = $('#js_order').val() ? $('#js_order').val() : 0;
            this.model.update(submitObject);
        },

    });
}

);