define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/set/settingSystem.html',
    '../../model/set/system',
    ],

function($, template, Backbone, tpl,model){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.model = new this.model();
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this),
            })
        },
        events:{
            'blur input[type=text],textarea':'updateText',
            'change input[type=radio]':'updateRadio',
            'click #js_update':'update',
        },
        render: function() {
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');

            // 初始化radio
            $('input[name=subject_default_slug][value='+this.model.get('subject_default_slug')+']').prop('checked',true);
            $('input[name=comment_default__enable][value='+this.model.get('comment_default__enable')+']').prop('checked',true);
            $('input[name=comment_default__captcha][value='+this.model.get('comment_default__captcha')+']').prop('checked',true);
            $('input[name=comment_default__username][value='+this.model.get('comment_default__username')+']').prop('checked',true);
            $('input[name=Postsync__thumb_enable][value='+this.model.get('Postsync__thumb_enable')+']').prop('checked',true);
            $('input[name=attachment__path_rule][value='+this.model.get('attachment__path_rule')+']').prop('checked',true);
            $('input[name=manage__warn_avatar][value='+this.model.get('manage__warn_avatar')+']').prop('checked',true);
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