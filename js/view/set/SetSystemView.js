define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/set/settingSystem.html',
    '../../model/set/system',
    '../../model/set/theme',
    ],

function($, template, Backbone, tpl,model,themeModel){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        themeModel : themeModel,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model();
            this.themeModel = new this.themeModel();
            Saturn.defer(
                [
                    {
                        object: this.model,
                        method:'fetch',
                    },
                    {
                        object:this.themeModel,
                        method:'fetch',
                    }
                ],function(data){
                    this.render(data);
                }.bind(this)
            );
        },
        events:{
            'blur input[type=text],textarea':'updateText',
            'change input[type=radio]':'updateRadio',
            'click #js_update':'update',
        },
        render: function(data) {
            this.model.set('themeList',data[1].attributes);
            var html = template.compile(this.template)(this.model.attributes);
            console.log(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_theme').val(this.model.get('theme'))
            // 初始化radio
            $('input[name=subject_default_slug][value='+this.model.get('subject_default_slug')+']').prop('checked',true);
            $('input[name=comment_default__enable][value='+this.model.get('comment_default__enable')+']').prop('checked',true);
            $('input[name=comment_default__captcha][value='+this.model.get('comment_default__captcha')+']').prop('checked',true);
            $('input[name=comment_default__username][value='+this.model.get('comment_default__username')+']').prop('checked',true);
            $('input[name=Postsync__thumb_enable][value='+this.model.get('Postsync__thumb_enable')+']').prop('checked',true);
            $('input[name=attachment__path_rule][value='+this.model.get('attachment__path_rule')+']').prop('checked',true);
            $('input[name=manage__warn_avatar][value='+this.model.get('manage__warn_avatar')+']').prop('checked',true);
            $('#js_theme').change(function(){
                this.model.set('theme',$('#js_theme').val())
            }.bind(this))
        },
        updateText:function(){
            var target = event.target || window.event.srcElement;
            if (target.nodeName == 'INPUT' || target.nodeName == 'TEXTAREA') {
                var key = $(target).attr('name');
                var value = $(target).val();
                this.model.attributes[key]=value;
            }
        },
        updateRadio:function(){
            var target = event.target || window.event.srcElement;
            if (target.nodeName == 'INPUT') {
                var key = $(target).attr('name');
                var value = $('input[name='+key+']:checked').val();
                this.model.attributes[key]=value;
            }
        },
        update:function(){
            this.model.update(this.model.attributes,function(){

            })
        }
    });
}

);