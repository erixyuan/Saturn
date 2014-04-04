define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/application/category.html',
    '../../../js/model/common/category'
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        initialize: function(obj){
            this.model = Saturn.appModel = new this.model('application');
            this.model.fetch({
                success:function(model,response){
                    this.render();
                }.bind(this)
            })
        },
        events:{
            'click #js_addTag':'addTag',
            'click #js_tagsListContent': 'deleteTag',
        },
        render: function(context) {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!Saturn.isCurrentView("application","category")){
                return false;
            }
            var categories = this.model.get('data');
            var categoriesArr = [];
            var str = '└─';
            var layerNum = 0 ;
            categoriesArr = this.categoriesTraversal(categories,categoriesArr,str,layerNum);

            for (var i = 0; i < categoriesArr.length; i++) {
                for (var j = 0; j < categoriesArr[i].layerNum; j++) {
                    categoriesArr[i].otherName = '&nbsp;&nbsp;&nbsp;&nbsp;'+categoriesArr[i].otherName;
                };
            };

            var html = template.compile(this.template)(categoriesArr);
            Saturn.renderToDom(html,'#js_mainContent');

        },
        categoriesTraversal:function(arr,categoriesArr,str,layerNum,parent){

            for (var i = 0; i < arr.length; i++) {
                if(arr[i].parent_id == '0'){
                    layerNum = 0;
                    arr[i].layerNum = layerNum;
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
    });
}

);