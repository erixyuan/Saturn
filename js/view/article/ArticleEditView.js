define([
    'jquery',
    'template',
    'underscore',
    'backbone',
    'text!../../../template/article/edit.html',
    '../../model/article/edit',
    'ace',
    'KindEditor',
    'lang',
    'swfupload',
    '../../model/common/attachment',
    ],

function($, template, _, Backbone, editTpl,EditModel,ace,KindEditor,lang,swfupload,attachment){

    var ArticleEditView = Backbone.View.extend({
        el:"#js_mainContent",
        model: EditModel,
        template:editTpl,
        attachment: new attachment(),   //附件表，用在banner图列表的删除
        initialize: function(obj){
            var that = this;
            //$('#js_mainContent').html(this.template);   //1. 如果模板不存在,把模板丢入body的底部
            if (obj == undefined || obj.id == undefined) {
                Saturn.articleModel = this.model = new this.model();  // 3.初始化模型
            }else{
                Saturn.articleModel = this.model = new this.model(obj.id);  // 3.初始化模型
            }

            // 4.绑定id变化，就会刷新页面，注意：要避免什么改变都全局刷新，会闪屏
            this.model.fetch({
                success:function(){
                    that.render(this.model);                            // 6.模板和数据都准备好了，开始渲染
                }
            });

        },
        events:{
            'click #js_publicBtn,#js_draftBtn,#js_pendingBtn,#js_previewBtn': 'submit',
            // tag
            'click #js_addTag':'addTag',
            'click #js_tagsListContent': 'deleteTag',
            // applist
            'click #js_addApplicationBtn': 'addApplicationBtn',
            'click #js_widgetApplicationListClose,#js_widgetApplicationListSubmit': 'closeAppWidget',
            'click #js_widgetApplicationListContent a': 'addApp',
            'click #js_searchApplicationBtn': 'searchApp',
            // categorylist
            'click #js_categoryBtn': 'showCategory',
            'click #js_categoryListClose': 'categoryListClose',
            'click #js_categorySubmit': 'categorySubmit',
            'click #js_categoryListContent': 'categoryDelete',

            // 显示更多选项
            'click #js_moreContentBtn': 'showMoreContent',

            // 图片上传
            'click #js_selectImgBtn': 'showImgList',
            'click #js_uploadImgListClose': 'closeImgList',
            'click #js_uploadImgListSubmit': 'confirmImg',
            'click #js_uploadImgList span[operate=selectImg]': 'selectImg',
            'click #js_uploadImgList span[operate=deleteImg]': 'deleteImg',

            'keyup #js_description': 'changeDescription',
            'blur #js_title' : 'updateInput',
        },
        render: function(context) {
            $('body').removeClass().addClass('m-article-create');
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent')

            this.edittorInit();         // 初始化编辑器
            this.changeDescription();   // 微博字数初始化事件
            this.imgLoadInit();         // 图片上传控件初始化

            this.model.attributes.disable_comment == 1 ? $('#js_disable_comment').prop("checked", true) : null;     //禁止评论
            this.model.attributes.ontop == 1 ? $('#js_ontop').prop("checked", true) : null;                         //置顶
            this.model.attributes.url_filter == 1 ? $('#js_url_filter').prop("checked", true) : null;               //过滤链接
            this.model.attributes.status == 2 ? $('#js_page').prop("checked", true) : null;                           //页面
            this.model.attributes.cleanthumbs == 1 ? $('#js_cleanthumbs').prop("checked", true) : null;             //页面
            // 处理发布时间
            if (this.model.attributes.published != '0' && this.model.attributes.published!==undefined) {
                $('#js_postTime').val(new Date(this.model.attributes.published*1000).toISOString().substr(0,16));
                $('#js_postDate').html(new Date(this.model.attributes.created*1000).toISOString().substr(0,16));    // 评级中的发布时间
            }
        },
        showMoreContent:function(){
            //debugger;
            $('#js_moreContent').slideToggle('fast');
        },
        showCategory:function(){
            Saturn.beginLoading();
            require(['view/article/articleEdit_plugin_categoryListView'],function(articleEdit_plugin_categoryListView){
                new articleEdit_plugin_categoryListView();
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
                tmpHtml += '<li><a href="javascript:void(0)" value="'+categoryListSelectArr[i]+'">'+$("#js_categoryListSelectContent").find('option[value='+categoryListSelectArr[i]+']').attr('name')+'</a></li>';
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
        closeAppWidget:function(){
            $('#js_widgetApplicationList').css('display',"none");
        },
        addApplicationBtn:function(){
            Saturn.beginLoading();
            if(this.appListView){
                new this.appListView();
            }else{
                require(['view/article/articleEdit_plugin_applicationListView'],function(articleEdit_plugin_applicationListView){
                    this.appListView = articleEdit_plugin_applicationListView;
                    new this.appListView();
                }.bind(this));
            }
            Saturn.afterLoading();
        },
        addApp:function(){
            // BAD:检查是否已经加入了该应用
            var target = event.target || window.event.srcElement;
            var target = $(target).parent();
            var targetId = target.attr('applicationid');
            var exist = 0;
            $('#js_applicationListContent a').each(function(){
                if($(this).attr('applicationid') == targetId){
                    exist =1;
                }
            })
            if (exist == 0 ) {
                $('#js_applicationListContent').prepend(target.clone());
                target.css('background','#js_A34B4B');
            };
        },
        searchApp:function(){
            var keyword = $('#js_searchApplicationText').val();
            new this.appListView({keyword:keyword})
        },
        /*****************************************************************************************************
         * 图片
         ******************************************************************************************************/
        imgLoadInit:function(){
            var settings = {
                flash_url : Saturn.cmsPath+'manageV2/js/lib/swfupload/swfupload.swf',
                upload_url: Saturn.cmsPath + "ipa/attachment",
                file_post_name : "file",
                post_params: {
                    object_type: 'subject',
                    object_id : this.model.get('id'),
                    object_relation:'thumb'
                },
                file_size_limit : "2000 MB" ,
                file_types : "*.jpg;*.png",
                custom_settings : {
                    progressTarget : "fsUploadProgress",
                    cancelButtonId : "btnCancel"
                },
                debug: false,

                // Button settings
                button_image_url: Saturn.cmsPath+'manageV2/js/lib/swfupload/upload-pic-btn.png',
                button_width: "90",
                button_height: "22",
                button_placeholder_id: 'js_subject-thumb-upload-button',
                file_dialog_complete_handler : function(){
                    this.startUpload();
                },
                upload_start_handler : function(file){
                    Saturn.beginLoading("上传中...");
                },
                upload_success_handler : function(file,attachment) {
                    var attachment = JSON.parse(attachment);
                    $('#js_uploadImgList').append('<li><img src="'+attachment.url+'" alt=""><span class="bottom">'+
                        '<span class="filename">'+attachment.original+'</span>'+
                        '<span class="actions"><a class="delete" href="javascript:void(0);" bannerimgid ="'+attachment.id+'">删除</a></span></span></li>');
                    $('#js_bannerImgShow').attr('src',attachment.url).attr('bannerid',attachment.id);
                },
                upload_complete_handler : function() {
                    Saturn.afterLoading();
                },
            };

            this.swf = new SWFUpload(settings);
        },
        showImgList:function(){
            var id = this.model.get('id');
            require(['view/article/articleEdit_plugin_loadImgView'],function(articleEdit_plugin_loadImgView){
                new articleEdit_plugin_loadImgView({type:'subject',id:id})
            })
        },
        selectImg:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            $('#js_bannerImgShow').attr('bannerid',id);
            var src = $(target).parents('li').find('img').attr('src');
            $('#js_bannerImgShow').attr('src',src);
        },
        deleteImg:function(){
            var target = event.target || window.event.srcElement;
            var id = $(target).attr('operateId');
            this.attachment.delete(id,function(data){
                if(data.errCode == 0){
                    $(target).parents('li').remove();
                }
            }.bind(this));
        },
        closeImgList:function(){
            $('#js_subject-thumb-upload-list').removeClass('show');
        },

        /*****************************************************************************************************
         * 标签
         ******************************************************************************************************/
        deleteTag:function(){
            var target = event.target || window.event.srcElement;
            $(target).parent().remove();
            var tags = [];
        },

        addTag:function(){
            var newTag = $('#js_newTag').val();
            if (newTag !='') {
                if($('#js_tagsListContent li a').text().indexOf(newTag) == -1){
                    $('#js_tagsListContent').append('<li><a href="javascript:void(0)">'+newTag+'</a></li>');
                    $('#js_newTag').val('');
                }
            };
        },
        updateInput:function(){
            var target = event.target || window.event.srcElement;
            this.model.set($(target).attr('id'),$(target).val());
        },
        updateAll:function(){
            //更新哪些不同实现绑定的
            var submitObject = {};
            var categories = [];
            var applications = [];
            var tags = [];
            $('#js_applicationListContent a[applicationid]').each(function(e){
                applications.push($(this).attr('applicationid'));
            });
            $('#js_categoryListContent li a').each(function(e){
                categories.push($(this).attr('value'));
            });
            $('#js_tagsListContent li a').each(function(e){
                tags.push($(this).html());
            });

            submitObject.title = $('#js_title').val();                                 //文章标题
            submitObject.description = $('#js_description').val();                     //微博内容
            submitObject.content = $('#js_editor_textarea').val();                     //文章内容
            submitObject.content_wmp = $('#js_content_wmp').val();                     //文章水印位置
            submitObject.cleanthumbs = $('#js_cleanthumbs').prop('checked');           //生成缩略图

            submitObject.apps = applications;
            submitObject.categories = categories;                                   //文章分类,只保存id
            submitObject.tags = tags;                                               //标签

            submitObject.banner_id = $('#js_bannerImgShow').attr('bannerId');           //banner图的ID
            submitObject.banner_wmp = $('#js_banner_wmp').val();                     //banner图水印位置
            submitObject.banner_index = $('#js_banner_index').val();                   //编辑栏中选择第几张为banner图

            submitObject.published = new Date($('#js_postTime').val()).getTime()/1000; //发布时间

            submitObject.source_name = $('#js_source_name').val();                     //来源站点
            submitObject.source_url = $('#js_source_url').val();                       //来源链接
            submitObject.author = $('#js_author').val();                               //来源作者

            submitObject.template = $('#js_templateContent').find("option:selected").text();//模板
            submitObject.goto_link = $('#js_goto_link').val();                         //跳转链接
            submitObject.slug = $('#js_slug').val();                                   //自定义连接

            submitObject.ontop = $('#js_ontop').prop('checked');                       //是否置顶
            submitObject.url_filter = $('#js_url_filter').prop('checked');             //过滤外站连接
            submitObject.page = $('#js_page').prop('checked');                         //过滤外站连接
            submitObject.disable_comment = $('#js_disable_comment').prop('checked');   //过滤外站连接

            this.model.set(submitObject);
        },
        submit : function(){

            this.updateAll();
            var target = event.target || window.event.srcElement;
            var type = $(target).attr('type');
            var sendData = {
                public:0,
                draft:0,
                pending:0,
                autosave:0
            };
            sendData[type] = 1;
            Saturn.beginLoading('发布中...');
            Saturn.articleModel.save(sendData,{
                success:function(model, response){
                    if(response.errCode !== 0){
                        alert(response.msg)
                    }
                    Saturn.afterLoading();
                }
            });
        },
        changeDescription:function(){
            var num = 90;
            var strLength = $('#js_description').val().length;
            if(strLength > num){
                $('#js_residue-counter').parent().css('display','none');
                $('#js_exceed-counter').parent().css('display','inline-block');
                $('#js_exceed-counter').text(strLength-num)
            }else{
                $('#js_exceed-counter').parent().css('display','none');
                $('#js_residue-counter').parent().css('display','inline-block');
                $('#js_residue-counter').text(num-strLength);
            }
            this.model.set('description',$('#js_description').val());
        },
        edittorInit:function(){
            createEditor({
                KE_id: "#js_editor_textarea",
                KE_setting:{
                    uploadJson: Saturn.cmsPath+'ipa/attachment',       //指定上传文件的服务器端程序
                    fileManagerJson: '',    //指定浏览远程图片的服务器端程序
                    designMode: true,                                  //可视化模式或代码模式
                    width: '100%',
                    // 暂时不用typo.css
                    //cssPath: [window.typoPath],   //指定编辑器iframe document的CSS文件，用于设置可视化区域的样式
                    bodyClass: 'typo typo_manage pc',   //指定编辑器iframe document body的className,默认值: “ke-content”
                    minHeight: 500,
                    imageTabIndex: 1,   //图片弹出层的默认显示标签索引
                    allowFileManager: true,     //true时显示浏览远程服务器按钮
                    allowMediaUpload: false,    //true时显示视音频上传按钮
                    //附加属性
                    attachmentParams: {
                        object_type: 'subject',
                        object_id : this.model.get('id'),
                        object_relation:'attachment_image'
                    },
                    //额外的文件上传属性
                    extraFileUploadParams: {
                        object_id: this.model.get('id'),
                        object_type: 'subject',
                        object_relation: 'attachment_image',
                        PHPSESSID: ''
                    },
                    //配置编辑器的工具栏
                    items: [
                        //'aceEditor',           //自定义：切换为ace编辑框
                        //'viewMode',
                        'source',           //HTML代码
                        '|',                //分割符
                        'undo',             //后退
                        'redo',             //前进
                        'fullscreen',       //全屏
                        '/',                //换行
                         'formatblock',     //段落
                        '|',
                        'bold',             //粗体
                        'italic',           //斜体
                        'underline',        //下划线
                         'strikethrough',   //删除线
                         '|',
                        'justifyleft',      //左对齐
                        'justifycenter',    //居中
                        'justifyright',     //右对齐
                        '|',
                        'insertorderedlist',//编号
                        'insertunorderedlist',//项目符号
                        '|',
                        'indent',           //增加缩进
                        'outdent',          //减少缩进
                        '|',
                        'hr',               //插入横线
                        'link',             //超级链接
                        'removeformat',     //删除格式
                        'media',            //视音频
                        'table',            //表格
                        'code',             //插入程序代码
                        'multiimage',       //批量照片上传
                        '|',
                        'image',            //单张图片上传
                        'insertfile',       //加入文件
                        'template',         //模板
                        'pagebreak'          //分页符
                    ]
                },
                ACE_id:"js_aceEditor",
                ACE_setting:{
                    theme: 'ace/theme/chrome',
                    mode: 'ace/mode/html',
                    fontSize:12,
                    tabSize:4,
                    softWrap:'off',
                    VScroll:true
                }
            });

            //方法定义
            function createEditor (object) {
                var option = {
                    KE_id : '',         //插件注入的DOM的id
                    KE_setting:'',      //KE的配置
                    ACE_id:'',          //ACE的id
                    ACE_setting:''      //ACE的配置
                }

                for(var i in object){
                    option[i] = object[i];
                }
                var ace = require('ace/ace');
                // 初始化ACEditor
                //ace.require("ace/ext/emmet");
                // 返回对象给全局变量aceEditor
                window.aceEditor = ace.edit(option.ACE_id);
                // 設置默認高亮語言 Setting the Programming Language Mode
                option.ACE_setting.mode == undefined ? aceEditor.getSession().setMode("ace/mode/html") : aceEditor.getSession().setMode(option.ACE_setting.mode);
                // 選擇主題，Setting Themes，預覽效果可以前往 http://ace.c9.io/build/kitchen-sink.html
                option.ACE_setting.theme == undefined ? aceEditor.setTheme("ace/theme/chrome") : aceEditor.setTheme(option.ACE_setting.theme);
                // 設定默認tab爲幾個空格 Set the default tab size:
                option.ACE_setting.tabSize == undefined ? aceEditor.getSession().setTabSize(4) : aceEditor.getSession().setTabSize(option.ACE_setting.tabSize);
                // 這個應該是設置字體大小，但是語法不是這樣寫的，瞭解的可以改一下。 :TODO:
                option.ACE_setting.fontSize == undefined ? aceEditor.setFontSize(12) : aceEditor.setFontSize(option.ACE_setting.fontSize);
                // 设置换行线
                option.ACE_setting.softWrap == undefined ? setSoftWrap('off') : setSoftWrap(option.ACE_setting.softWrap);
                // 设置是否显示滚动条
                option.ACE_setting.VScroll == undefined ? aceEditor.env.editor.setOption("vScrollBarAlwaysVisible", true) : aceEditor.env.editor.setOption("vScrollBarAlwaysVisible", option.ACE_setting.VScroll);
                // 设置显示空格为点
                option.ACE_setting.setShowInvisibles == undefined ? aceEditor.env.editor.setShowInvisibles(true):aceEditor.env.editor.setShowInvisibles(option.ACE_setting.setShowInvisibles);
                // 设置显示tab
                option.ACE_setting.setDisplayIndentGuides == undefined ?aceEditor.env.editor.setDisplayIndentGuides(true):aceEditor.env.editor.setDisplayIndentGuides(option.ACE_setting.setDisplayIndentGuides);
                // 光標由|變_，即複寫狀態
                aceEditor.setOverwrite(false);
                // 使用軟tab嗎？ Use soft tabs:
                aceEditor.getSession().setUseSoftTabs(true);
                // 是否折行 Toggle word wrapping:
                aceEditor.getSession().setUseWrapMode(true);
                // 是否高亮當前行 （強內容編輯的化還是關掉比較好）Set line highlighting:
                aceEditor.setHighlightActiveLine(false);
                // 是否顯示打印線 Set the print margin visibility:
                aceEditor.setShowPrintMargin(false);
                // 設置是否爲只讀模式 Set the editor to read-only:
                aceEditor.setReadOnly(false);

                var textSet = require('ace/layer/text');
                // 设置文章结尾符号
                textSet.Text.prototype.EOF_CHAR='';
                // 设置回车符号
                textSet.Text.prototype.EOL_CHAR='';

                // 设置换行线方法
                function setSoftWrap(value){
                    var session = aceEditor.env.editor.session;
                    var renderer = aceEditor.env.editor.renderer;
                    switch (value) {
                        case "off":
                            session.setUseWrapMode(false);
                            renderer.setPrintMarginColumn(80);
                            break;
                        case "free":
                            session.setUseWrapMode(true);
                            session.setWrapLimitRange(null, null);
                            renderer.setPrintMarginColumn(80);
                            break;
                        default:
                            session.setUseWrapMode(true);
                            var col = parseInt(value, 10);
                            session.setWrapLimitRange(col, col);
                            renderer.setPrintMarginColumn(col);
                    }
                }

                // 初始化之前，先清除插件对象多余的
                for(var i in KindEditor._plugins){
                    if(i != 'core'){
                        delete KindEditor._plugins[i];
                    }
                }
                // 初始化KindEditor
                KindEditor.lang({
                    aceEditor : '源代码模式',
                });
                window.editor = null;
                editor = KindEditor.create(option.KE_id, option.KE_setting);
                editor.loadPlugin('aceEditor');  //加载ACE插件
                editor.options.htmlTags.link = ['id', 'rel', 'type', 'href', 'hreflang', 'rev', 'target'];
                editor.options.htmlTags.style = ['id', 'rel', 'type', 'media', 'lang', 'dir'];
                editor.options.filterMode = false;
            }
        }
    });


    // 模块现在返回实例化后的view
    // 有的时候你可能需要返回未实例化的view，可以写 return projectListView
    return ArticleEditView;
}

);