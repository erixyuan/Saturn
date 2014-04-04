define([
    'jquery',       // 加载jquery
    'template',     // 加载模板引擎
    'underscore',   // backbone依赖的库
    'backbone',     // 加载backbone
    '../PaginationPluginView',      // 用于插件的分页(还有一个用于列表的分页)
    'text!../../../template/article/edit.html',     // .html结尾的就是模板,这是文章
    '../../model/article/edit',                     // 编辑文章的model(api)，跟后台做交互就是model,用它来获取数据，更新数据，删除数据
    'ace',  // ace 编辑器
    'tinymce',  // tinymce编辑器
    '../../model/common/attachment',        // 这个就是附件model
    '../../model/common/templateModel',
    '../../model/setting/system',
    '../../model/role/userEdit',
    'ext-emmet',
    ],

function($, template, _, Backbone, PaginationPluginView, editTpl,EditModel,ace,tinymce,attachment,templateModel,settingModel,userModel){

    var tpl = [
        '{{each}}',
            '<li>',
                '<img src="{{$value.thumb_url}}" title="{{$value.filename}}" alt="{{$value.filename}}" data-thumb-url="{{$value.thumb_url}}" data-origin-url="{{$value.origin_url}}">',
                '<span class="bottom">',
                    '<span class="filename">{{$value.filename}}</span>',
                    '<span class="actions">',
                        '<span class="g-btn g-btn-mini" href="javascript:void(0);" operateId="{{$value.id}}" operate="deleteImg">删除</span> ',
                        '| <span class="g-btn g-btn-mini" href="javascript:void(0);" operateId="{{$value.id}}" operate="selectImg">确定</span>',
                    '</span>',
                '</span>',
            '</li>',
        '{{/each}}',
    ].join('');


    var ArticleEditView = Backbone.View.extend({
        el:"#js_mainContent",
        model: EditModel,
        template : editTpl,
        imgtpl : tpl,
        templateModel : new templateModel('subject'),
        attachment: new attachment(),   //附件表，用在banner图列表的删除
        settingModel : new settingModel(),
        userModel : new userModel(Saturn.userId),
        initialize: function(obj){
            var that = this;
            if (obj == undefined || obj.id == undefined) {
                Saturn.articleModel = this.model = new this.model();  // 3.初始化模型
            }else{
                Saturn.articleModel = this.model = new this.model(obj.id);  // 3.初始化模型
            }

            // 延迟加载:因为一个页面可能需要多个数据都准备好了，才可以显示。
            // 这里的逻辑是，等待文章实体，模板实体，系统实体，用户实体都加载完成之后，才开始渲染页面
            //
            Saturn.defer(
                [
                    {
                        object: this.model,
                        method:'fetch',
                    },
                    {
                        object:this.templateModel,
                        method:'fetch',
                    },
                    {
                        object:this.settingModel,
                        method:'fetch',
                    },
                    {
                        object:this.userModel,
                        method:'fetch',
                    }
                ],function(data){
                    // data是一个数组，顺序保存以上的4个实体的数据
                    // 接着开始渲染实体
                    // 这个bind(this)，是用于指定这个方法的当前上下文是当前的this,
                    // 不然this.render会报错
                    this.render(data);
                }.bind(this)
            )
        },
        // 这里是统一设置事件，尽量放在这里，好看，当然也可以自己用jq的方式，自己定义
        events:{
            'click #js_publicBtn,#js_draftBtn,#js_pendingBtn,#js_previewBtn': 'submit',
            'click #js_delete' : 'deleteArticle',

            // tag
            'click #js_addTag':'addTag',
            'click #js_tagsListContent li': 'deleteTag',
            'keypress #js_newTag': 'keypressAddTag',
            // applist
            'click #js_addApplicationBtn': 'addApplicationBtn',
            'click #js_widgetApplicationListClose,#js_widgetApplicationListSubmit': 'closeAppWidget',
            'click #js_widgetApplicationListContent a': 'addApp',
            'click #js_searchApplicationBtn': 'searchApp',

            'click #js_applicationListContent i[operate=delete], #js_productListContent i[operate=delete]':'deleteAppOrProduct',

            // productlist
            'click #js_addProductBtn': 'addProductBtn',

            // categorylist
            'click #js_categoryBtn': 'showCategory',
            'click #js_categoryListClose': 'categoryListClose',
            'click #js_categorySubmit': 'categorySubmit',
            'click #js_categoryListContent li': 'categoryDelete',

            // 显示更多选项
            'click #js_moreContentBtn': 'showMoreContent',

            /* banner upload*/
            'click #js_uploadBannerImage' : 'uploadBannerImg',

            // 图片上传
            'click #js_selectImgBtn': 'showImgList',
            'click #js_uploadImgListClose': 'closeImgList',
            'click #js_uploadImgListSubmit': 'confirmImg',
            'click #js_uploadImgList span[operate=selectImg]': 'selectImg',
            'click #js_uploadImgList span[operate=deleteImg]': 'deleteImg',

            'keyup #js_description': 'changeDescription',
            'blur #js_title' : 'updateInput',

            'click #js_setPostTime' : 'setPostTime',
            'click #saveBtn' : 'save',

        },

        // 渲染页面
        render: function(data) {
            /* 把模板实体，加到当前的文章实体中，为了走模板引擎的时候，把文章实体直接丢过去渲染,不用丢其他的实体 */
            this.model.set('templateList',data[1].attributes.data);

            /* 保存主题在全局 */
            Saturn.theme = this.settingModel.get('theme');

            /*
                如果全局的当前视图和这个视图不匹配，就不渲染。
                如果实例化这个视图（例如：文章）的情况下，但是当前视图（例如：应用）那就不渲染DOM。
            */
            if(!(Saturn.isCurrentView("article","create") || Saturn.isCurrentView("article","edit"))){
                return false;
            }



            // 通过模板+数据，编译成html代码
            // this.template = 模板
            // this.model.attributes = 数据
            // 把数据插入到模板里面
            var html = template.compile(this.template)(this.model.attributes);



            /* 把html代码加载到dom中 */
            Saturn.renderToDom(html,'#js_mainContent')


            //TIPS: DOM渲染完毕之后，才能做初始化事件

            this.edittorInit();         // 初始化编辑器
            this.changeDescription();   // 微博字数初始化事件

            /* 以下是一些input的初始化 */
            this.model.attributes.disable_comment == 1 ? $('#js_disable_comment').prop("checked", true) : null;     //禁止评论
            this.model.attributes.ontop == 1 ? $('#js_ontop').prop("checked", true) : null;                         //置顶
            this.model.attributes.url_filter == 1 ? $('#js_url_filter').prop("checked", true) : null;               //过滤链接
            this.model.attributes.status == 2 ? $('#js_page').prop("checked", true) : null;                           //页面
            this.model.attributes.cleanthumbs == 1 ? $('#js_cleanthumbs').prop("checked", true) : null;             //页面

            /* 处理发布时间（只要日期） */
            if (this.model.attributes.published != '0' && this.model.attributes.published!==undefined) {
                $('#js_postTime').val(new Date(this.model.attributes.published*1000).toISOString().substr(0,16));
                $('#js_postDate').html(new Date(this.model.attributes.created*1000).toISOString().substr(0,16));    // 评级中的发布时间
            }

            /*文章模板（高级选项里面，/subject/template/）初始化*/
            $('#js_templateContent').val(this.model.get('template'));

            /* 初始化保存时间 */
            if (this.model.get('published')*1000 >=  new Date().getTime()) {
                $('#js_setPostTime').prop("checked",true);
                $('#js_postTime').removeAttr('disabled');
            };

            /* 定时器保存文章 */
            this.autosave();

            /*
                对比，设置显示区域的高度
                :TODO: 这段代码用意不明
             */
            // $('#js_formTplContent').css('min-height', $('#js_formTplContent .w-ext').height());

            /* 绑定ctrl+s按钮 */
            $(window).keydown(function(event) {;
                if ( event.ctrlKey && event.which == 83) {
                    this.save();
                    event.preventDefault();
                    return false;
                }
            }.bind(this));

            // 浏览器大于1024的时候
            enquire.register("screen and (min-width: 1024px)", {
              match : function() {
                $('#js_formTplContent').height( Math.max($('#js_formTplContent .w-ext').height(), $('#js_formTplContent').height()) );
              },
              unmatch : function() {
                $('#js_formTplContent').height('auto');
              },
              setup : function() {},
              deferSetup : true
            });
        },

        /* 显示更多内容按钮事件 */
        showMoreContent:function(){
            $('#js_moreContent').slideToggle('fast');
        },

        /* 显示分类 */
        showCategory:function(){
            Saturn.beginLoading();
            require(['view/article/ArticleEdit_plugin_categoryListView'],function(ArticleEdit_plugin_categoryListView){
                new ArticleEdit_plugin_categoryListView();
            })
            Saturn.afterLoading();
        },

        /* 分类列表的关闭按钮事件 */
        categoryListClose:function(){
            $('#js_categoryListSelect').removeClass('show');
        },

        /* 分类确定按钮事件 */
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
        /* 删除分类 */
        categoryDelete:function(e){
            $(e.target).remove();
        },


        /* app list */
        /* 关闭应用列表 */
        closeAppWidget:function(){
            $('#js_widgetApplicationList').css('display',"none");
        },
        addApplicationBtn:function(){
            Saturn.beginLoading();
            if(this.appListView){
                new this.appListView();
            }else{
                require(['view/article/ArticleEdit_plugin_applicationListView'],function(ArticleEdit_plugin_applicationListView){
                    this.appListView = ArticleEdit_plugin_applicationListView;
                    new this.appListView();
                }.bind(this));
            }
            Saturn.afterLoading();
        },

        /* 增加一个应用 */
        addApp:function(e){
            // BAD:检查是否已经加入了该应用
            var target = $(e.target).parent();
            var targetId = target.attr('applicationId');
            var exist = 0;
            $('#js_applicationListContent a').each(function(){
                if($(this).attr('productId') == targetId){
                    exist =1;
                }
            })
            if (exist == 0 ) {
                var html = target.clone().append('<i class="fa fa-times" operate="delete"></i>')
                $('#js_applicationListContent').prepend(html);
                target.css('background','#js_A34B4B');
            };
            if($(document).width()>1024){
                $('#js_formTplContent').height($('#js_formTplContent .w-ext').height());
            }
        },

        /* 应用或者产品删除事件 */
        deleteAppOrProduct:function(e){
            $(e.target).parent('a').remove();
            $('#js_formTplContent').height($('#js_formTplContent .w-ext').height());
        },

        /* 搜索应用按钮事件 */
        searchApp:function(){
            var keyword = $('#js_searchApplicationText').val();
            new this.appListView({keyword:keyword})
        },

        /* product list */
        /* 增加产品按钮事件 */
        addProductBtn:function(){
            /* 显示加载进度条 */
            Saturn.beginLoading();
            /* 如果产品列表的视图“类”已经存在，直接实例化，如果不存在，加载该“类”，缓存起来，然后实例化 */
            if(this.productListView){
                new this.productListView();
            }else{
                require(['view/article/articleEdit_plugin_ProductListView'],function(articleEdit_plugin_ProductListView){
                    this.productListView = articleEdit_plugin_ProductListView;
                    new this.productListView();
                }.bind(this));
            }
            Saturn.afterLoading();
        },


        /*****************************************************************************************************
         * 图片
         ******************************************************************************************************/
        /* 上传banner图按钮的事件 */
        uploadBannerImg:function(){
            Saturn.initImgLoad({
                inputId:'#bannerImg',
                params:{
                    object_type: 'subject',
                    object_id : this.model.get('id'),
                    object_relation:'thumb'
                },
                callback:function(attachment){
                    $('#js_uploadImgList').append('<li><img src="'+attachment.url+'" alt=""><span class="bottom">'+
                        '<span class="filename">'+attachment.original+'</span>'+
                        '<span class="actions"><a class="delete" href="javascript:void(0);" bannerimgid ="'+attachment.id+'">删除</a></span></span></li>');
                    $('#js_bannerImgShow').attr('src',attachment.url).attr('bannerid',attachment.id);
                }
            })
        },

        /* 显示图片列表按钮事件 */
        showImgList:function(){
            Saturn.beginLoading();
            var page = this.page ? this.page : 1;
            $.ajax({
                url: Saturn.cmsPath+'ipa/attachment?type=subject&id='+this.model.get('id')+"&page="+page,
                type: 'get',
                success:function(data){
                    // 把图片的链接改成相对地址
                    _.each(data.data,function(value,key,list){
                        value.thumb_url = '../'+value.thumb_url.match(/attachment.*/)[0]
                    });
                    // 加载分页器，传入data列表
                    if (data.data) {
                        var html = template.compile(this.imgtpl)(data.data);
                        $('#js_uploadImgList').html(html);
                        $('#js_subject-thumb-upload-list').addClass('show');
                        new PaginationPluginView({
                            id:'#paginationPlugin_banner',
                            data:data,
                            callback:function(){
                                this.showImgList();
                            }.bind(this),
                            parent:this,
                        });
                    };
                    Saturn.afterLoading();
                }.bind(this)
            })
        },
        selectImg:function(e){
            var id = $(e.target).attr('operateId');
            $('#js_bannerImgShow').attr('bannerid',id);
            var src = $(e.target).parents('li').find('img').attr('data-origin-url');
            $('#js_bannerImgShow').attr('src',src);
        },
        deleteImg:function(e){
            var id = $(e.target).attr('operateId');
            this.attachment.delete(id,function(data){
                if(data.errCode == 0){
                    $(e.target).parents('li').remove();
                }
            }.bind(this));
        },
        closeImgList:function(){
            $('#js_subject-thumb-upload-list').removeClass('show');
        },

        /*****************************************************************************************************
         * 标签
         ******************************************************************************************************/
        deleteTag:function(e){
            $(e.target).remove();
        },
        keypressAddTag:function(e){
            if(e.keyCode == 13){
                this.addTag();
            }
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

        setPostTime:function(e){
            var bool = $(e.target).prop('checked');
            if (bool) {
                $('#js_postTime').removeAttr('disabled');
                if($('#js_postTime').val() == ''){

                    $('#js_postTime').val(new Date().toISOString().substr(0,16));
                }
            }else{
                $('#js_postTime').attr('disabled','true');
            }

        },

        /* 更新文章实体 */
        updateAll:function(){
            //更新哪些不同实现绑定的
            var submitObject = {};
            var categories = [];
            var applications = [];
            var products = [];
            var tags = [];
            $('#js_applicationListContent a[applicationid]').each(function(e){
                applications.push($(this).attr('applicationid'));
            });
            $('#js_productListContent a[productid]').each(function(e){
                products.push($(this).attr('productid'));
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
            submitObject.products = products;
            submitObject.categories = categories;                                   //文章分类,只保存id
            submitObject.tags = tags;                                               //标签

            submitObject.banner_id = $('#js_bannerImgShow').attr('bannerId');           //banner图的ID
            submitObject.banner_wmp = $('#js_banner_wmp').val();                     //banner图水印位置
            submitObject.banner_index = $('#js_banner_index').val();                   //编辑栏中选择第几张为banner图

            submitObject.published = new Date($('#js_postTime').val()).getTime()/1000; //发布时间

            submitObject.source_name = $('#js_source_name').val();                     //来源站点
            submitObject.source_url = $('#js_source_url').val();                       //来源链接
            submitObject.author = $('#js_author').val();                               //来源作者
            submitObject.template = $('#js_templateContent').val();

            submitObject.template = $('#js_templateContent').find("option:selected").text();//模板
            submitObject.goto_link = $('#js_goto_link').val();                         //跳转链接
            submitObject.slug = $('#js_slug').val();                                   //自定义连接

            submitObject.ontop = $('#js_ontop').prop('checked');                       //是否置顶
            submitObject.url_filter = $('#js_url_filter').prop('checked');             //过滤外站连接
            submitObject.page = $('#js_page').prop('checked');                         //过滤外站连接
            submitObject.disable_comment = $('#js_disable_comment').prop('checked');   //过滤外站连接

            this.model.set(submitObject);
        },

        /* 删除文章 */
        deleteArticle:function(){
            if (confirm("确定删除？")){
                $.ajax({
                    url:Saturn.cmsPath+'ipa/article/'+this.model.get('id'),
                    type:'DELETE',
                    success:function(data){
                        if(data.errCode == 0){
                            window.location.hash = "#article/list"
                        }else{
                            alert(data.msg)
                        }
                    }
                })
            }
        },

        // 提交文章实体
        submit : function(){
            // 走upadteAll的方法，更新this.model
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
                    }else{
                        switch(type){
                            case 'public':
                                var html = [
                                    '<p>3秒后或任意点击，返回编辑页面</p>',
                                    '<p><a href="#article/list">跳转到文章列表</a></p>',
                                    '<p><a href="../'+this.model.get('id')+'" target="_blank">跳转到文章</a></p>'
                                ].join('');
                                Saturn.createDialog('发布成功',html,true);
                                break;
                            case 'draft':
                                var html = [
                                    '<p>3秒后或任意点击，返回编辑页面</p>',
                                    '<p><a href="#article/list">跳转到文章列表</a></p>'
                                ].join('');
                                Saturn.createDialog('保存草稿成功',html,true);
                                break;
                            case 'pending':
                                var html = [
                                    '<p>3秒后或任意点击，返回编辑页面</p>',
                                    '<p><a href="#article/list">跳转到文章列表</a></p>',
                                    '<p><a href="'+'id'+'">跳转到文章</a></p>'
                                ].join('');
                                Saturn.createDialog('成功发表到审核',html,true);
                                break;
                            case 'autosave':
                                window.open(Saturn.cmsPath+this.model.get('id'),"_blank");
                                break;
                        }

                    }
                    Saturn.afterLoading();
                }.bind(this)
            });
        },

        /* 保存文章 */
        save:function(){
            $('#saveBtn').hide();
            $('#saveing').show();
            this.updateAll();
            var sendData = {
                public:0,
                draft:1,
                pending:0,
                autosave:0
            };
            Saturn.articleModel.save(sendData,{
                success:function(model, response){
                    if(response.errCode !== 0){
                        alert(response.msg)

                    }
                    $('#saveBtn').show();
                    $('#saveing').hide();
                    Saturn.afterLoading();
                }.bind(this)
            });
        },

        /* 自动保存 */
        autosave:function(){
            var saveTime = this.settingModel.get('subject_auto_save_time');
            if(saveTime > 0 ){
                var timer = setInterval(function(){
                    this.updateAll();
                    this.model.save()
                }.bind(this), saveTime*1000);
                // 当锚点变化的时候，清除这个定时器
                window.onhashchange = function(){
                    clearInterval(timer);
                }
            }
        },

        /* 引言描述字数限制 */
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

        /* 编辑器初始化 */
        edittorInit:function(){
            var that = this;
            Saturn.createEditor({
                textarea_id: "#js_editor_textarea",                 /* tinymce所要用的id*/
                ACE_id:"js_aceEditor",                              /* ace所要用的id */
                currentEditType:that.userModel.get('editor_type'),  /* 当前的编辑模式 */
                id : that.model.get('id'),                          /* 当前的编辑id */
                codeTheme: that.userModel.get('editor_theme'),
            });

        },


    });

    return ArticleEditView;
}

);