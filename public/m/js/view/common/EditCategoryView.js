define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/common/editCategory.html',
    '../../model/common/category',
    '../../model/common/templateModel'
    ],

function($, template, Backbone, tpl,model,templateModel){

    return Backbone.View.extend({
        el:'#js_mainContent',
        model: model,
        template:tpl,
        templateModel : templateModel,
        initialize: function(obj){
            this.model = new this.model();
            if (obj.module) {
                this.module = obj.module;
            };

            this.templateModel = new this.templateModel('category');
            Saturn.defer([
                    {
                        object:this.model,
                        method:'fetch'
                    },
                    {
                        object:this.model,
                        params:{
                            id : obj ? obj.id : undefined,
                        },
                        method:'getOne'
                    },
                    {
                        object:this.templateModel,
                        method:'fetch'
                    }
                ],function(data){
                    this.render(data);
                }.bind(this)
            )
        },
        events:{
            'click #js_updateBtn': 'update',
        },
        render: function(data) {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            // if(!(Saturn.isCurrentView("application","category") || Saturn.isCurrentView("article","category"))){
            //     return false;
            // }
            var categories         = data[0].get('data');
            var categoriesArr      = [];
            var str                = '└─';
            var layerNum           = 0 ;
            categoriesArr          = this.categoriesTraversal(categories,categoriesArr,str,layerNum);


            this.cateinfo          = data[1] ? data[1] : {};     //因为创建的时候，没有data[1], 要做状态区别
            this.cateinfo.cateList = categoriesArr;

            /* 把模板的数据放入分类数据中 */
            this.cateinfo.templates = data[2].get('data');


            var html               = template.compile(this.template)(this.cateinfo);
            Saturn.renderToDom(html,'#js_mainContent');

            $('#js_type').val(this.cateinfo.type);
            $('#js_parent_id').val(this.cateinfo.parent_id ? this.cateinfo.parent_id : 0);
            $('#js_template').val(this.cateinfo.template);
            this.cateinfo.status ==1 ? $('#js_status').prop('checked',true) : $('#js_status').prop('checked',false);

            if(this.module){
                switch(this.module){
                    case 'article':
                        $('#js_type').val('subject');
                        break;
                    case 'application':
                        $('#js_type').val('application');
                        break;
                    case 'product':
                        $('#js_type').val('product');
                        break;
                }

            }

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
            submitObject.status      = $('#js_status').prop('checked') ? 1 : 0;
            submitObject.template    = $('#js_template').val();
            this.model.update(submitObject,function(data){
                if(data.errCode == 0){
                    var html = [
                        '<p>3秒后或任意点击，返回编辑页面</p>',
                    ].join('');
                    Saturn.createDialog('发布分类成功',html,true);
                }else{
                    alser(data.msg);
                }
            });
        },

    });
}

);