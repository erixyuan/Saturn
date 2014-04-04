define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/product/edit.html',
    '../../model/product/edit',
    '../../model/common/attachment',
    '../../model/setting/system',
    ],

function($, template, Backbone, tpl,model, attachment,platformModel){

    var coverListTpl = [
                '{{each}}',
                '<li>',
                '<img src="{{$value.thumb_url}}" title="{{$value.filename}}" alt="{{$value.filename}}" data-thumb-url="{{$value.thumb_url}}" data-origin-url="{{$value.origin_url}}">',
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
        coverListTpl:coverListTpl,
        initialize: function(obj){
            this.model = Saturn.appModel = new this.model(obj.id);
            this.platformModel = new this.platformModel('product__platform')
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
                            type : 'product',
                            id : obj.id,
                            relation : 'thumb'
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

            'click #js_submit span': 'submit',

            'click #js_appinfos span[operate=deleteApp]' : 'deleteAppdown',    /* 删除app下载 */
            'click #js_addAppdown' : 'addAppdown',                             /* 添加app下载 */

            'click #js_iconUploadBtn' : 'uploadIcon',                          /* 上传图标 */
            'click #js_uploadProductImgBtn' : 'uploadScreenShot',               /* 上传产品图片 */

            'click #js_commonTags span' : 'addCommonTags',

        },
        render: function(data) {
            // 如果不是当前视图，就不渲染，避免多次点击锚点，引起的ajax回调覆盖之前的页面
            if(!(Saturn.isCurrentView("product","create") || Saturn.isCurrentView("product","edit"))){
                return false;
            }
            this.model.set('screenshots',data[1].data);
            this.model.set('downloads',data[2].get('data'));
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');

            /*  初始化模板的数据 */
            $('#js_language').val(this.model.get('language'));

            /* 初始化应用下载 */
            if (this.model.get('product_links')) {
                if (this.model.get('product_links').length > 0) {
                    _.each(this.model.get('product_links'),function(value,key,list){
                        $('#js_appinfos tr').eq(key).find('select[appinfoAttr=js_platform]').val(value.platform);
                    });
                };
            }else{
                this.model.set('product_links',[]);
            }


        },

        addTag:function(tag){
            var newTag = (typeof tag) == 'string' ? tag : $('#js_newTag').val();
            if (newTag !='') {
                if($('#js_tagsListContent li a').text().indexOf(newTag) == -1){
                    $('#js_tagsListContent').append('<li><a href="javascript:void(0)">'+newTag+'</a></li>');
                    $('#js_newTag').val('');
                }
            };
        },
        /* 添加公共tag */
        addCommonTags:function(e){
            var html = $(e.target).html();
            this.addTag(html);
        },

        deleteTag:function(e){
            $(e.target).remove();
        },

        submit:function(e){
            var type = $(e.target).attr('type');  //确定是发布还是草稿
            var submitObject = {};

            for(var i in this.model.attributes){
                submitObject[i] = this.model.attributes[i];
            }


            var categories = [];
            var tags = [];

            var that = this;
            submitObject.product_links = [];
            $('#js_appinfos tr').each(function(index,e){
                submitObject.product_links.push({
                    id: $(this).attr('appinfoId'),
                    product_id: that.model.get('id'),
                    platform: $(this).find('select[appinfoAttr=js_platform]').val(),
                    price: $(this).find('input[appinfoAttr=js_price]').val(),
                    desc: $(this).find('input[appinfoAttr=js_desc]').val(),
                    url: $(this).find('input[appinfoAttr=js_url]').val(),
                })
                if (!submitObject.product_links[index].id) {
                    delete submitObject.product_links[index].id;
                };


            });
            $('#js_categoryListContent span').each(function(e){
                categories.push($(this).attr('value'));
            });
            $('#js_tagsListContent a').each(function(e){
                tags.push($(this).html());
            });


            submitObject.name = $('#js_title').val();                                 //应用标题
            submitObject.cover_id = $('#js_cover_id').attr('iconid');                                 //应用标题
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
            submitObject.cover_wmp = $('#js_cover_wmp').val();

            submitObject.public = 0;
            submitObject.draft = 0;
            submitObject[type] = 1;

            this.model.update(submitObject,function(data){
                if (data.errCode == 0) {
                    if ($(e.target).attr('skip')) {
                        window.location.hash = '#article/create';
                    }else{
                        var html = [
                            '<p>3秒后或任意点击，返回编辑页面</p>',
                            '<a href="#product/list">跳转到商品列表</a>'
                        ].join('');
                        Saturn.createDialog('发布成功',html,true);
                    }

                }else{
                    alert(data.msg);
                }
            });
        },


        /* 分类 */
        showCategory:function(){
            Saturn.beginLoading();
            require(['view/common/CategoryPluginListView'],function(CategoryPluginListView){
                new CategoryPluginListView({type:"product"});
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
            var url = $(target).parents('li').find('img').attr('data-origin-url');
            $('#js_cover_id').attr({iconid:id,src:url});
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
                    var html = template.compile(this.coverListTpl)(data.data);
                    $('#js_iconList').html(html);
                    $('#js_iconListContent').addClass('show');
                }.bind(this)
            )
        },
        /* 上传截图 */
        uploadScreenShot:function(){
            Saturn.initImgLoad({
                inputId:'#js_ProductImg',
                params:{
                    object_type: 'product',
                    object_id : this.model.get('id'),
                    object_relation:'thumb'
                },
                callback:function(attachment){
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
                }
            })
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
        /* 上传图标 */
        uploadIcon:function(){
            Saturn.initImgLoad({
                inputId:'#iconImg',
                params:{
                    object_type: 'application',
                    object_id : this.model.get('id'),
                    object_relation:'icon'
                },
                callback:function(attachment){
                    $('#js_cover_id').attr('src',attachment.url);
                    $('#js_cover_id').attr('iconId',attachment.id);
                }
            })
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
                $('#js_cover_id').attr('src',data.icon_url);
                $('#js_cover_id').attr('iconId',data.cover_id);
                $('#js_name_package').val(data.packageName[0]);
                $('#js_size').val(data.filesize);
                $('#js_version').val(data.versionName);
            }
            $('#apkForm').attr('action',Saturn.cmsPath+'ipa/unpack  ')
            $('#apkForm').submit();
        },

        /* 删除app 下载 */
        deleteAppdown:function(e){
            $(e.target).parents('tr').remove();
        },
        /* 添加app 下载 */
        addAppdown:function(){
            var html = [
                '<tr appinfoId=>',
                    '<td>',
                        '<select name="" appinfoAttr="js_platform" class="g-select">',
            ];
            _.each(this.model.get('downloads'),function(value,key,list){
                html.push('<option value="'+value+'">'+value+'</option>')
            })
            html.push('</select>');
            html.push('</td>');
            html.push('<td><input type="text" class="input-text col-url" appinfoAttr="js_url" value=""></td>');
            html.push('<td><input type="text" class="input-text col-price" appinfoAttr="js_price" value=""></td>');
            html.push('<td><input type="text" name="" class="col-depict" appinfoAttr="js_desc" value=""></td>');
            html.push('<td><input type="text" name="" class="col-redirection" value="" disabled></td>');
            html.push('<td class="col-actions"><span operate="deleteApp" class="g-btn  g-btn-delete">删</span></td>');
            html.push('</tr>');
            html = html.join('')
            $('#js_appinfos').append(html);
        },

    });
}

);