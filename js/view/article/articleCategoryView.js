define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/article/categoryList.html',
    '../../model/article/articleEdit_plugin_category',
    ],

function($, template, Backbone, tpl,modelData){


    return Backbone.View.extend({
        el:"#js_mainContent",
        model: modelData,
        template:tpl,
        initialize: function(obj){
            var that = this;
            //$(this.el).append(this.template);   //1. 把模板丢入body的底部

            this.model = new this.model('subject');  // 3.初始化模型
            //this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({
                success:function(model,response){
                    that.render(model);
                }
            });
        },
        events:{
            "click span[operate=delete]" : 'delete',
        },
        render: function(model) {
            //***** 扁平化处理 把树状结构的转化为一维数组输出 START
            var categories = model.get('data');
            var categoriesArr = [];
            var str = '└─';
            var layerNum = 0 ;
            categoriesArr = this.categoriesTraversal(categories,categoriesArr,str,layerNum);

            for (var i = 0; i < categoriesArr.length; i++) {
                for (var j = 0; j < categoriesArr[i].layerNum; j++) {
                    categoriesArr[i].otherName = '&nbsp;&nbsp;&nbsp;&nbsp;'+categoriesArr[i].otherName;
                };
            };
            //***** 扁平化处理 END
            var html = template.compile(this.template)(categoriesArr);
            //$(this.el).html(html);
            Saturn.renderToDom(html,this.el);
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
        delete:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.model.delete(id)
        }
    });
}

);