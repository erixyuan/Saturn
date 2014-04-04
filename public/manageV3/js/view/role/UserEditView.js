define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/role/userEdit.html',
    '../../model/role/userEdit',
    '../../model/role/roleList',
    '../PaginationView',
    'swfupload'
    ],

function($, template, Backbone, tpl,model,roleModel,PaginationView,swfupload){

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        roleModel:roleModel,
        template:tpl,
        status:'',
        initialize: function(obj){
            this.id = obj.id;
            this.roleModel = new this.roleModel();
            this.model = new this.model(obj.id);  // 3.初始化模型
            Saturn.defer(
                [
                    {
                        object: this.model,
                        method:'fetch',
                    },
                    {
                        object:this.roleModel,
                        method:'fetch',
                    }
                ],function(data){
                    this.render(data);
                }.bind(this)
            )
        },
        validate:function(){
            // 如果id不存在，代表是新建用户
            if (!this.id) {
                if (!this.model.get('password') || !this.model.get('password2')) {
                    alert('请输入密码');
                    return false;
                }else if(this.model.get('passwrod') != this.model.get('passwrod2')){
                    alert('两次输入密码不一致');
                    return false;
                }else if(!(this.model.get('email') && /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/.test(this.model.get('email')))){
                    alert("邮箱格式不对");
                    return;
                }
            };
            return true;
        },
        events:{
            'blur input[text-rest],textarea[text-rest]' : 'updateText',
            'click input[radio-rest]' : 'updateRadio',
            'click #js_userRole input' : 'updateCheckbox',
            'click #js_submit' : 'update',
        },
        render: function(obj) {
            var data = this.model.attributes;
            data.allRole = this.roleModel.attributes;

            var html = template.compile(this.template)(data);
            Saturn.renderToDom(html,'#js_mainContent');
            var roles = this.model.get('roles');
            _.each(roles,function(value,key,list){
                $('#js_userRole').find('input[value='+value.id+']').prop('checked',true);
            })
            this.renderAvatar();    //初始化上传头像按钮
        },
        renderAvatar:function(){
            var settings = {
                flash_url : Saturn.cmsPath+'resource/js/lib/swfupload/swfupload.swf',
                upload_url: Saturn.cmsPath + "ipa/attachment",
                file_post_name : "file",
                post_params: {
                    object_type: 'user',
                    object_id : this.model.get('id'),
                    object_relation:'avatar'
                },
                file_size_limit : "2000 MB" ,
                file_types : "*.jpg;*.png",
                custom_settings : {
                    progressTarget : "fsUploadProgress",
                    cancelButtonId : "btnCancel"
                },
                debug: false,

                // Button settings
                button_image_url: Saturn.cmsPath+'resource/js/lib/swfupload/upload-pic-btn.png',
                button_width: "90",
                button_height: "22",
                button_placeholder_id: 'js_uploadAvatar',
                file_dialog_complete_handler : function(){
                    this.startUpload();
                },
                upload_start_handler : function(file){
                    Saturn.beginLoading("上传中...");
                },
                upload_success_handler : function(file,attachment) {
                    var attachment = JSON.parse(attachment);
                    $('#js_avatar img').attr({
                            'src':attachment.url,
                            'avatarId':attachment.id
                        });
                },
                upload_complete_handler : function() {
                    Saturn.afterLoading();
                },
            };

            this.swf = new SWFUpload(settings);
        },
        // 双向绑定input[type=text]
        updateText:function(e){
            var name = $(e.target).attr('text-rest');
            var value = $(e.target).val();
            // model , 属性名字(a.b.c), 值
            Saturn.setRestValue(this.model.attributes, name, value);

        },
        // 双向绑定input[type=radio]
        updateRadio:function(e){
            var name = $(e.target).attr('radio-rest');
            var value = $("input[radio-rest][name="+name+"]:checked").val();
            Saturn.setRestValue(this.model.attributes, name, value);
            console.log(this.model.attributes);
        },
        updateCheckbox:function(e){
            var roles = [];
            $('#js_userRole input[type=checkbox]:checked').each(function(){
                var obj = {}
                obj.id = $(this).val();
                roles.push(obj);
            })
            this.model.set('roles',roles);
        },
        update:function(){
            // 校验数据返回true的时候，再更新;
            if (this.validate()) {
                // 获取头像的id
                if ($('#js_avatar img').attr('avatarId')) {
                    this.model.set('avatar_id',$('#js_avatar img').attr('avatarId'));
                };
                this.model.update(this.model.attributes,function(){
                    var html = [
                        '<p>(1) 5秒后或任意点击，返回编辑页面</p>',
                        '<a href="#userManage/user/list">(2) 跳转到用户列表</a>'
                    ].join('');
                    Saturn.createDialog('发布成功',html,true);
                });
            };
        }

    });
}

);