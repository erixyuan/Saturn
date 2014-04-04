define([
    'jquery',
    'template',
    'backbone',
    'text!../../template/pagination.html',
    ],

function($, template, Backbone, paginationTpl){

    function getSeparatePage(max,current){
        var current = parseInt(current);      //获取当前页码
        var btnNum = 10;                                    //定义按钮的个数，包括省略号
        var max = parseInt(max);          //获取的分页数量
        if(max==1) return false;                            //如果只有一页返回
        btnNum = btnNum > max ? max : btnNum;

        // 上一页下一页
        var next = {},
            prev = {};

        // 如果为第一页，上一页按钮不要
        if(current == 1){
            prev = '';
        }else{
            prev.page =  current-1;
        }

        // 如果为最后一页，下一页按钮不要
        if(current == max){
            next = '';
        }else{
            next.page = current+1;
        }
        var numberBoxs = _.range(btnNum);       //创建N个空盒子
        numberBoxs[0] = {type:"num",num: 1};    //第一个盒子必须为第一页

        if(current == 1){
            numberBoxs[0].current = true;
        }else{
            numberBoxs[0].current = false;
        }

        // 最后一个盒子必须为最后一页
        numberBoxs[numberBoxs.length-1] = {type:"num",num: max};
        if(current == max){
            numberBoxs[numberBoxs.length-1].current = true;
        }else{
            numberBoxs[numberBoxs.length-1].current = false;
        }

        // 页数超出限制做省略处理
        if(max > btnNum ){
            var halfIndex = Math.floor(numberBoxs.length / 2) + 1;
            if(current < halfIndex){
                //在前半的时候
                for(var i = 1, l = numberBoxs.length -3; i <= l; i++ ){
                    numberBoxs[btnNum-2] = {type: "dot",num:'...'}; //最后一页后面跟着是点点点
                    numberBoxs[i] = {type:"num",num: i+1};
                    if(numberBoxs[i].num == current) {
                        numberBoxs[i].current = true;
                    }else{
                        numberBoxs[i].current = false;
                    }
                }
            }

            if( (max- (btnNum-3) ) <= current ){
                //在后半段
                var start = (max- (btnNum-3) );
                numberBoxs[1] = {type: "dot",num:'...'}; //第一页后面跟着是点点点
                for(var i = 2, add = 0, l = numberBoxs.length -1; i < l; i++, add++){
                        numberBoxs[i] = {type:"num",num:  start + add};
                        if(numberBoxs[i].num == current){
                            numberBoxs[i].current = true;
                        }else{
                            numberBoxs[i].current = false;
                        }
                }

            }

            if(current >=halfIndex && current < (max - (btnNum-3) )){
                //在中间部分
                numberBoxs[1] = {type: "dot",num:'...'}; //第一页后面跟着是点点点
                numberBoxs[btnNum-2] = {type: "dot",num:'...'}; //最后一页后面跟着是点点点
                numberBoxs[halfIndex-1] = {type:"num",num:  current, current: true}; //中间为当前那页
                //输出中间两边的页码

                // 左边
                for(var i = halfIndex -2, sopIndex = 1,sub = 1; i > sopIndex; i--,sub++){
                    numberBoxs[i] =  {type:"num",num:  current - sub ,current:false};
                }
                // 右边
                for(var i = halfIndex, stopIndex = numberBoxs.length - 2, add = 1; i < stopIndex; i++, add++){
                     numberBoxs[i] =  {type:"num",num:  current + add ,current:false};
                }
            }
        }
        // 页数不超出限制，直接显示
        else{
            for (var i = 1; i < numberBoxs.length; i++) {
                numberBoxs[i] = {type:"num",num:i+1};
                if(numberBoxs[i].num == current) {
                    numberBoxs[i].current = true;
                }else{
                    numberBoxs[i].current = false;
                }
            }
        }

        // 为页数num加上链接
        for (var i = 0; i < numberBoxs.length; i++) {
            numberBoxs[i].pageStatus =status;
        };

        // 返回视图的数据
        return {
            prev:prev,
            numberBoxs:numberBoxs,
            next:next,
        }
    }


    var PaginationView = Backbone.View.extend({
        el:"#js_pagination",
        template:paginationTpl,
        module:'',
        initialize: function(obj){
            this.render(obj)
        },
        events:{
            'click #js_jumpPageBtn': 'jumpPage',//失去焦点事件
            'keypress #js_jumpPageValue' : 'jumpPageKeyPress'
        },
        render: function(obj) {
            var context = obj.data;     // 分页数据,包括最后一页，当前页，当前状态状态
            if ($('#js_pageTpl').length == 0) {
                $('body').append(this.template);   //1. 把模板丢入body的底部
            };
            if(!context.last_page == 1)
                return false;

            var numberBoxs = getSeparatePage(context.last_page,context.current_page);

            // 应该如何设置按钮的跳转? 链接锚点路由跳转，还是局部刷新为每个按钮绑定事件
            // 第一种是，url模式，跳转的
            // 第二种是按钮触发事件模式,只是把page属性丢到触发dom上面，dom操作在view里面写
            if (obj.url) {
                numberBoxs.url = obj.url;
            }
            // 如果属性不为空
            if(!Saturn.isEmpty(obj.params)){
                var str = '?';
                _.each(obj.params,function(value,key,list){
                    str +=(key+"="+value+'&')
                })
                numberBoxs.params = str.substr(0,str.length-1);
            }else{
                numberBoxs.params='';
            }
            var html = template.render('js_pageTpl',numberBoxs);
            $('#js_pagination').html(html);
        },
        jumpPage: function(el){
            var v = $('#js_jumpPageValue').val()
            var url = $('#js_jumpPageBtn').attr('attr')
            var params = $('#js_jumpPageBtn').attr('params')
            window.location.hash = url+v+params;

        },
        jumpPageKeyPress:function(e){
            if(e.keyCode == 13){
                this.jumpPage();
            }
        }
    });
    // 模块现在返回实例化后的view
    // 有的时候你可能需要返回未实例化的view，可以写 return projectListView
    return PaginationView;
}

);