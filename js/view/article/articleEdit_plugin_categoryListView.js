define([
    'jquery',
    'template',
    'backbone',
    '../../model/article/articleEdit_plugin_category'
    ],




function($, template, Backbone, ListModel){
    var tpl ='{{each}}'+
                '<option value="{{$value.id}}" name="{{$value.name}}">{{$value.otherName}}</option>'+
             '{{/each}}';

    return Backbone.View.extend({
        el:"#js_categoryListSelectContent",
        model: ListModel,
        template:tpl,
        initialize: function(obj){
            var that = this;
            $(this.el).append(this.template);   //1. 把模板丢入body的底部

            this.model = new this.model('subject');  // 3.初始化模型
            //this.model.bind('change',this.render,this);              // 4.绑定
            this.model.fetch({success:function(model,respones){
                that.render(model)
            }});                                 // 5.从服务器拉取数据

        },
        events:{


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
            debugger;
            var html = template.compile(this.template)(categoriesArr);
            $(this.el).html(html);
            $('#js_categoryListSelect').addClass('show');
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
        updateModel: function(){
            debugger;
        }
    });
    // 模块现在返回实例化后的view
    // 有的时候你可能需要返回未实例化的view，可以写 return projectListView
}

);