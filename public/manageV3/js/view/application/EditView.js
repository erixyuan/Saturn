define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/application/edit.html',
    '../../model/application/edit',
    'swfuploadQueue',
    '../../model/common/attachment',
    '../../model/set/system',
    ],

function($, template, Backbone, tpl,model,swfupload,attachment,platformModel){

    var iconListTpl = [
                '{{each}}',
                '<li>',
                '<img src="{{$value.thumb_url}}" alt="">',
                '<span class="bottom">',
                '<span class="filename">{{$value.filename}}</span>',
                '<span class="actions">',
                '<span class="g-btn g-btn-mini" operateId="{{$value.id}}" operate="deleteIcon">删除</span> ',
                '| <span class="g-btn g-btn-mini" operateId="{{$value.id}}" operate="selectIcon">确定</span>',
                '</span>',
                '</span>',
                '</li>',
                '{{/each}}'
              ].join('');

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        attachment: new attachment(),
        platformModel: platformModel,
        iconListTpl:iconListTpl,
        initialize: function(obj){
            this.model = Saturn.appModel = new this.model(obj.id);
            this.platformModel = new this.platformModel('application__platform')
            Saturn.defer(
                [
                    {
                        object: this.model,
                        method:'fetch',
                    },
                    {
                        object:this.attachment,
                        method:'get',
                        params:{
                            type : 'application',
                            id : obj.id,
                            relation : 'screenshot'
                        }
                    },
                    {
                        object:this.platformModel,
                        method:'fetch',
                    }
                ],function(data){
                    this.render(data);
                }.bind(this)
            )
            //=================
        },
        defer:function(i,data){
            // 延迟加载，为了等待2个数据都加载完成才开始渲染页面
            this.data[i] = data;
            if(!(--this.remain)){
                this.render(this.data);
            }
        },
        events:{
            'click #js_addTag':'addTag',
            'click #js_tagsListContent li': 'deleteTag',
            'click #js_publicBtn': 'submit',

            // categorylist
            'click #js_categoryBtn': 'showCategory',
            'click #js_categoryListClose': 'categoryListClose',
            'click #js_categorySubmit': 'categorySubmit',

            'click a[operate=deleteSreenShot]': 'deleteSreenShot',
            'click span[operate=deleteIcon]': 'deleteIcon',
            'click span[operate=selectIcon]' : 'selectIcon',
            'click #js_showIconBtn': 'showIconBtn',
            'click #js_iconListClose': 'iconListClose',

            'click #js_catch-app-info': 'updateApk',

            'click #js_publishBtn,#js_draftBtn': 'submit',

        },
        render: function(data) {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!(Saturn.isCurrentView("application","create") || Saturn.isCurrentView("application","edit"))){
                return false;
            }
            this.model.set('screenshots',data[1].data);
            this.model.set('downloads',data[2].get('data'));
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');

            /**
             *  初始化模板的数据
             */
             $('#js_language').val(this.model.get('language'));


            this.iconImgLoadInit();     //应用图标
            this.screenShotLoadInit();  //应用截图
        },

        addTag:function(){
            var newTag = $('#js_newTag').val();
            if (newTag !='') {
                if($('#js_tagsListContent li a').text().indexOf(newTag) == -1){
                    $('#js_tagsListContent').append('<span class="tag">'+newTag+'</span>');
                    $('#js_newTag').val('');
                }
            };
        },
        deleteTag:function(e){
            debugger;
            $(e.target).remove();
        },

        submit:function(){
            var target = event.target || window.event.srcElement;
            var type = $(target).attr('type');  //确定是发布还是草稿
            var submitObject = {};

            for(var i in this.model.attributes){
                submitObject[i] = this.model.attributes[i];
            }


            var categories = [];
            var applications = [];
            var tags = [];
            $('#js_applicationListContent a[applicationid]').each(function(e){
                applications.push($(this).attr('applicationid'));
            });
            $('#js_categoryListContent span').each(function(e){
                categories.push($(this).attr('value'));
            });
            $('#js_tagsListContent span').each(function(e){
                tags.push($(this).html());
            });


            submitObject.title = $('#js_title').val();                                 //应用标题
            submitObject.icon_id = $('#js_icon_id').attr('iconid');                                 //应用标题
            submitObject.categories = categories;                                   //应用分类,只保存id
            submitObject.tags = tags;                                               //标签
            submitObject.description = $('#js_description').val();                     //简介内容

            submitObject.order = $('#js_order').val();
            submitObject.name_cn = $('#js_name_cn').val();
            submitObject.name_en = $('#js_name_en').val();
            submitObject.name_package = $('#js_name_package').val();
            submitObject.version = $('#js_version').val();
            submitObject.size = $('#js_size').val();
            submitObject.language = $('#js_language').val();


            submitObject.apps = applications;


            submitObject.public = 0;
            submitObject.draft = 0;
            submitObject[type] = 1;

            this.model.update(submitObject,function(){
                var html = [
                    '<p>(1) 5秒后或任意点击，返回编辑页面</p>',
                    '<a href="#application/list">(2) 跳转到应用列表</a>'
                ].join('');
                Saturn.createDialog('发布成功',html,true);
            });
        },


        /**
         * 分类
         */
        showCategory:function(){
            Saturn.beginLoading();
            require(['view/application/applicationEdit_plugin_categoryListView'],function(applicationEdit_plugin_categoryListView){
                new applicationEdit_plugin_categoryListView();
            })
            Saturn.afterLoading();
        },
        categoryListClose:function(){
            $('#js_categoryListSelect').removeClass('show');
        },
        categorySubmit:function(){
            var categoryListSelectArr =  $('#js_categoryListSelectContent').val();
            var tmpHtml ='';
            // 组装成对象
            for (var i = 0; i < categoryListSelectArr.length; i++) {
                tmpHtml += '<span value="'+categoryListSelectArr[i]+'" class="g-btn">'+$("#js_categoryListSelectContent").find('option[value='+categoryListSelectArr[i]+']').attr('name')+'</span>';
            };
            if (tmpHtml != '') {
                $('#js_categoryListContent').html(tmpHtml);
            };
            $('#js_categoryListSelect').removeClass('show');
        },
        categoryDelete:function(){
            var target = event.target || window.event.srcElement;
            $(target).remove();
        },

        iconListClose:function(){
            $('#js_iconListContent').removeClass('show')
        },
        selectIcon:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateid');
            var url = $(target).parents('li').find('img').attr('src');
            $('#js_icon_id').attr({iconid:id,src:url});
        },
        deleteIcon:function(e){
            var id = $(e.target).attr('operateId');
            this.attachment.delete(id,function(){
                $(this).parents('li').remove();
            }.bind(e.target))
        },
        showIconBtn:function(){
            this.attachment.get(
                {
                    type : 'application',
                    id : this.model.get('id'),
                    relation : 'icon'
                },
                function(data){
                    var html = template.compile(this.iconListTpl)(data.data);
                    $('#js_iconList').html(html);
                    $('#js_iconListContent').addClass('show');
                }.bind(this)
            )
        },
        screenShotLoadInit:function(){
            var settings = {
                flash_url : Saturn.cmsPath+'resource/js/lib/swfupload/swfupload.swf',
                upload_url: Saturn.cmsPath + "ipa/attachment",
                file_post_name : "file",
                post_params: {
                    object_type: 'application',
                    object_id : this.model.get('id'),
                    object_relation:'screenshot'
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
                button_placeholder_id: 'js_uploadImgBtn',
                file_dialog_complete_handler : function(){
                    this.startUpload();
                },
                upload_start_handler : function(file){
                    Saturn.beginLoading("上传中...");
                },
                upload_success_handler : function(file,attachment) {
                    var attachment = JSON.parse(attachment);
                    debugger;
                    var html = [
                                '<li screeenshotId="'+attachment.id+'" class="active">',
                                '<img src="'+attachment.url+'" alt="">',
                                '<span class="bottom">',
                                '<span class="filename">'+attachment.original+'</span>',
                                '<span class="actions">',
                                '<a class="delete" href="javascript:void(0);" operate="deleteSreenShot" operateId="'+attachment.id+'">删除</a>'+
                                '</span>',
                                '</span>',
                                '</li>'
                                ];
                    $('#js_applicationScreenshotList').append(html.join(''));
                },
                upload_complete_handler : function() {
                    Saturn.afterLoading();
                },
            };

            this.screenShotSwf = new SWFUpload(settings);
        },
        deleteSreenShot:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.attachment.delete(id,function(data){
                if(data.errCode == 0){
                    $(target).parents('li').remove();
                }else{
                    alert(data.msg);
                }
            }.bind(this));
        },
        iconImgLoadInit:function(){
            var settings = {
                flash_url : Saturn.cmsPath+'resource/js/lib/swfupload/swfupload.swf',
                upload_url: Saturn.cmsPath + "ipa/attachment",
                file_post_name : "file",
                post_params: {
                    object_type: 'application',
                    object_id : this.model.get('id'),
                    object_relation:'icon'
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
                button_placeholder_id: 'js_iconUploadBtn',
                file_dialog_complete_handler : function(){
                    this.startUpload();
                },
                // upload_start_handler : function(file){
                //     Saturn.beginLoading("上传中...");
                // },
                upload_success_handler : function(file,attachment) {
                    var attachment = JSON.parse(attachment);
                    $('#js_icon_id').attr('src',attachment.url);
                    $('#js_icon_id').attr('iconId',attachment.id);
                },
                upload_complete_handler : function() {
                    Saturn.afterLoading();
                },
            };
            this.iconImgSwf = new SWFUpload(settings);
        },
        updateApk:function(){
            Saturn.beginLoading('获取中...')
            // 实现跨域的回调函数
            window.callback = function(data){
                Saturn.afterLoading();
                if(data.errCode != 0 ){
                    alert(data.msg);
                    return false
                }
                var data = data.data;
                $('#js_icon_id').attr('src',data.icon_url);
                $('#js_icon_id').attr('iconId',data.icon_id);
                $('#js_name_package').val(data.packageName[0]);
                $('#js_size').val(data.filesize);
                $('#js_version').val(data.versionName);
            }
            $('#apkForm').attr('action',Saturn.cmsPath+'ipa/unpack  ')
            $('#apkForm').submit();
        }
    });
}

);