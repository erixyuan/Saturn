define([
    'jquery',
    'template',
    'backbone',
    '../model/nav',
    '../model/logout'
    ],

function($, template, Backbone, model,logoutModel){

    var headerTpl = '{{each data as value index}}'+
                    '<li class="{{value.module}}">'+
                        '<a href="#{{value.module}}" module="{{value.module}}" title="{{value.name}}">'+
                            '{{value.name}}'+
                        '</a>'+
                    '</li>'+
                    '{{/each}}';

    var sideTpl = '{{each data as value index}}'+
                  '<li><a href="#{{value.parent}}/{{value.module}}" class="" module="{{value.module}}">{{value.name}}</a></li>'+
                  '{{/each}}';

    return Backbone.View.extend({
        el:"#js_mainHeader",
        model: model,
        logoutModel : logoutModel,
        headerTpl : headerTpl,
        sideTpl : sideTpl,
        initialize: function(obj){
            Saturn.navModel = this.model  = new this.model();
            this.model.fetch({
                success:function(model,data){
                    this.render();
                }.bind(this)
            })

            this.model.bind('change',this.sideRender,this);
        },
        events:{
            'click #js_logout' : 'logout',
        },
        render: function(context) {
            var html = template.compile(this.headerTpl)({data:this.model.get('data')});
            $('#js_topNav').html(html);
        },
        sideRender:function(){
            var module = Saturn.navModel.get('currentModule');
            var seconMmodule= Saturn.navModel.get('secondModule');
            if(module == undefined){
                // var html = template.compile(this.sideTpl)({data:this.model.get('data')[module].child});
                // $('#js_sidebar').html(html);
            }else{
                var html = template.compile(this.sideTpl)({data:this.model.get('data')[module].child});
                $('#js_sidebar').html(html);
            }
            $('#js_topNav a').removeClass('active');
            $('#js_topNav a[module="'+module+'"]').addClass('active');

            $('#js_sidebar a').removeClass('active');
            $('#js_sidebar a[module="'+seconMmodule+'"]').addClass('active')
        },
        logout: function(){
            this.logoutModel = new this.logoutModel();
            this.logoutModel.fetch({
                success:function(model,data){
                    if(data.errCode == 0){
                        window.location.reload();
                    }else{
                        alert(msg);
                    }
                }
            })
        },
    });
}

);