define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/adCreate.html',
    '../../model/plugin/adEdit',
    'swfupload',
    '../../model/common/attachment',
    '../PaginationView',
    'albumcolors',
    'colorjoe',
    'css!../../../../resource/js/lib/colorjoe/colorjoe.css',
    ],

function($, template, Backbone, tpl,model,swfupload,attachment,PaginationView,AlbumColors,colorjoe){

    var itemsTpl = ['<thead>',
                        '<tr>',
                            '<th class="col-pic">图片</th>',
                            '<th class="col-title">标题</th>',
                            '<th class="col-link">连接</th>',
                            '<th class="col-desp">描述</th>',
                            '{{if type==="color"}}',
                                '<th class="col-color">颜色</th>',
                            '{{/if}}',
                            '<th class="col-order" width="5%">顺序</th>',
                            '<th class="col-actions">操作</th>',
                        '</tr>',
                    '</thead>',
                    '{{each items as item}}',
                        '<tbody>',
                            '<tr>',
                                '<td class="col-pic">',
                                    '<img src="{{item.image_url}}" width="200" attachment_id="js_{{attachment_id}}">',
                                '</td>',
                                '<td class="col-title">',
                                    '<input class="input-text" type="text" name="title" value="{{item.title}}" keyev="true">',
                                '</td>',
                                '<td class="col-link">',
                                    '<input class="input-text" type="text" name="link" value="{{item.url}}">',
                                '</td>',
                                '<td class="col-desp">',
                                    '<textarea  name="content" >{{item.content}}</textarea>',
                                '</td>',
                                '{{if type=="color"}}',
                                    '<td class="col-color" width="5%" id="js_itemOrder">',
                                        '<input class="input-text" type="text" name="color" value="{{item.color}}"><span colorbtn style="background:{{color}}" value="    " class="g-btn"></span>',
                                    '</td>',
                                '{{/if}}',
                                '<td class="col-order" width="5%" id="js_itemOrder">',
                                    '<input class="input-text" type="text" name="order" style="width:2em" value="{{item.order}}">',
                                '</td>',
                                '<td class="col-actions">',
                                    '<span data-slide-index="0" class="g-btn g-btn-mini pick-image" operate="showImgList" >选择缩略图</span>',
                                    '<span  class="g-btn g-btn-mini remove-item" operate="deleteItem">删除</span>',
                                '</td>',
                            '</tr>',
                        '</tbody>',
                    '{{/each}}'
                    ].join('');
    var imgTpl = [
                '{{each}}',
                '<li>',
                '<img src="{{$value.thumb_url}}" alt="" attachment_id="{{$value.id}}">',
                '<span class="bottom">',
                '<span class="filename">{{$value.filename}}</span>',
                '<span class="actions">',
                '<span class="g-btn g-btn-mini" operateId="{{$value.id}}" operate="deleteImg">删除</span> ',
                '| <span class="g-btn g-btn-mini" operateId="{{$value.id}}" operate="selectImg">确定</span>',
                '</span>',
                '</span>',
                '</li>',
                '{{/each}}'
                ].join('');


    var standardItemTpl = [
                    '<tr>',
                        '<td class="col-pic">',
                            '<img src="img/article_banner_default.gif" alt="" attachment_id="" width="200">',
                        '</td>',
                        '<td class="col-title">',
                            '<input class="input-text" type="text" name="title" value="">',
                        '</td>',
                        '<td class="col-link">',
                            '<input class="input-text" type="text" name="link" value="">',
                        '</td>',
                        '<td class="col-desp">',
                            '<textarea  name="content"></textarea>',
                        '</td>',
                        '<td class="col-order">',
                            '<input class="input-text" type="text" name="order" style="width:2em" value="">',
                        '</td>',
                        '<td class="col-actions">',
                            '<span data-slide-index="0" class="g-btn g-btn-mini pick-image" operate="showImgList" >选择缩略图</span>',
                            '<span  class="g-btn g-btn-mini remove-item" operate="deleteItem"> 删除</span>',
                        '</td>',
                    '</tr>',
                  ].join('');

    var colorItemTpl = [
                    '<tr>',
                        '<td class="col-pic">',
                            '<img src="img/article_banner_default.gif" alt="" attachment_id="" width="200">',
                        '</td>',
                        '<td class="col-title">',
                            '<input class="input-text" type="text" name="title" value="">',
                        '</td>',
                        '<td class="col-link">',
                            '<input class="input-text" type="text" name="link" value="">',
                        '</td>',
                        '<td class="col-desp">',
                            '<textarea  name="content"></textarea>',
                        '</td>',
                        '<td class="col-color">',
                            '<input class="input-text" type="text" name="color" value=""><span colorbtn value="    " class="g-btn"></span>',
                        '</td>',
                        '<td class="col-order">',
                            '<input class="input-text" type="text" name="order" style="width:2em" value="">',
                        '</td>',
                        '<td class="col-actions">',
                            '<span data-slide-index="0" class="g-btn g-btn-mini pick-image" operate="showImgList" >选择缩略图</span>',
                            '<span  class="g-btn g-btn-mini remove-item" operate="deleteItem"> 删除</span>',
                        '</td>',
                    '</tr>',
                  ].join('');

    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        imgTpl : imgTpl,
        itemsTpl:itemsTpl,
        standardItemTpl : standardItemTpl,
        colorItemTpl:colorItemTpl,
        attachment : new attachment(),
        status:'',
        initialize: function(obj){
            this.model = new model(obj.id);
            this.model.fetch({
                success:function(){
                    this.render();
                }.bind(this),
            })
        },
        events:{
            "click #js_update":'update',
            'click span[operate=showImgList]' : 'showImgList',
            "click #js_imgListClose":'imgListClose',
            'click #js_pagination a,#jumpPageBtn': 'jumpPage',
            'click span[operate=deleteImg]' : 'deleteImg',
            'click span[operate=selectImg]' : 'selectImg',
            'click #js_addItem': 'addItem',
            'click span[operate=deleteItem]' : 'deleteItem',
            'change #js_adType' : 'changeAdType',
            'click span[colorbtn]' : 'selectColor',
        },
        render: function() {
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');
            $('#js_adType').val(this.model.get('type'));
            this.renderItems();
            this.adImgLoadInit();
        },
        renderItems:function(){
            var html = template.compile(this.itemsTpl)(this.model.attributes);
            $('#js_itemList').html(html);
        },
        update:function(){
            var itemList = []
            var type = this.model.get('type')
            // 遍历items 组装上传的对象
            $('#js_itemList tr').each(function(index,dom){
                var obj = {};
                obj.attachment_id = $(this).find('img[attachment_id]').attr('attachment_id');
                obj.title = $(this).find('input[name=title]').val();
                obj.link = $(this).find('input[name=link]').val();
                obj.content = $(this).find('textarea[name=content]').val();
                obj.order = $(this).find('input[name=order]').val();
                if(type == 'color'){
                    obj.color = $(this).find('input[name=color]').val();
                }
                itemList.push(obj);
            });
            this.model.set({
                key : $('input[name=key]').val(),
                name : $('input[name=name]').val(),
                items : itemList
            });
            this.model.update(this.model.attributes,function(data){
                if(data.errCode == 0){
                    var html = [
                        '<p>(1) 3秒后或任意点击，返回</p>',
                        '<a href="#plugin/adList">(2) 跳转到广告列表</a>'
                        ].join('');
                    Saturn.createDialog('提交成功',html,true);
                }else{
                    alert(data.msg);
                }
            });
        },
        addItem:function(){
            switch(this.model.get('type')){
                case 'standard':
                    $('#js_itemList').append(this.standardItemTpl);
                    break;
                case 'color':
                    $('#js_itemList').append(this.colorItemTpl);
                    break;
            }

        },
        deleteItem:function(e){
            $(e.target).parents('tr').remove();
        },
        deleteImg:function(e){
            var id = $(e.target).attr('operateId');
            this.attachment.delete(id,function(){
                $(this).parents('li').remove();
            }.bind(e.target))
        },
        selectImg:function(e){
            // 生成图片颜色;
            var src = $(e.target).parents('li').find('img').attr('src');
            var id = $(e.target).attr('operateid');
            this.itemImg.attr('src',src);
            this.itemImg.attr('attachment_id',id);
            $('#js_imgListContent').removeClass('show');
            if(this.model.get('type') == 'color'){
                var albumColors = new window.AlbumColors(src);
                albumColors.getColors(function(colors) {
                    var c="#";
                    _.each(colors[0],function(value){
                        c += value.toString(16);
                    })
                    this.itemImg.parents('tr').find('input[name=color]').val(c);
                    this.itemImg.parents('tr').find('span[colorbtn]').css('background',c)
                }.bind(this))
            }
        },
        selectColor:function(e){
            $('#rgbPicker').html(' ');
            var color = $(e.target).css('background-color');
            //显示拾色器
            colorjoe.rgb('rgbPicker',color).on('change', function(c) {
                $(e.target).css('background',c.hex());
                $(e.target).parents('tr').find('input[name=color]').val(c.hex());

            }.bind(e));
        },
        imgListClose:function(){
            $('#js_imgListContent').removeClass('show');
        },
        showImgList:function(page){
            // 这里的逻辑有点诡异，这个函数会在两个地方执行，
            // 第一个，点击选择缩略图按钮的时候会执行，这个时候，传进来的page是jq的事件
            // 第二个，点解分页按钮的时候就会执行，这时候传进来的page是数字，代表页码
            if(typeof page == 'number'){
                var page = page;
            }else{
                // 代表是点击缩略图的按钮，记录这个按钮
                var e = page;   //避免歧义，现在的page代表event
                var page = 1;
                this.itemImg = $(e.target).parents('tr').find('img');
            }
            this.attachment.get(
                {
                    type : 'plugin_slide',
                    id : this.model.get('id'),
                    relation : 'plugin_slide',
                    page : page ? page : 1,
                },
                function(data){
                    var html = template.compile(this.imgTpl)(data.data);
                    $('#js_imgList').html(html);
                    $('#js_imgListContent').addClass('show');
                    var pagination = new PaginationView({
                        data:data
                    });
                }.bind(this)
            )

        },
        jumpPage:function(e){
            if($(e.target).attr('id') == "jumpPageBtn"){
                var value = $("#js_jumpPageValue").attr('page');
                if (value) {
                    var page = parseInt(value);
                };
            }else{
                var page = parseInt($(e.target).attr('page'));
            }
            this.showImgList(page);
        },
        adImgLoadInit:function(){
            var settings = {
                flash_url : Saturn.cmsPath+'resource/js/lib/swfupload/swfupload.swf',
                upload_url: Saturn.cmsPath + "ipa/attachment",
                file_post_name : "file",
                post_params: {
                    object_type: 'plugin_slide',
                    object_id : this.model.get('id'),
                    object_relation:'plugin_slide'
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
                button_placeholder_id: 'js_adImgBtn',
                file_dialog_complete_handler : function(){
                    this.startUpload();
                },
                upload_start_handler : function(file){
                    Saturn.beginLoading("上传中...");
                },
                upload_success_handler : function(file,attachment) {
                    var attachment = JSON.parse(attachment);
                    // $('#js_applicationScreenshotList').append(html.join(''));
                },
                upload_complete_handler : function() {
                    Saturn.afterLoading();
                },
            };

            this.adImgUpload = new SWFUpload(settings);
        },
        changeAdType:function(e){
            var type = $(e.target).val();
            this.model.set('type',type);
            this.renderItems();
        }
    });
}

);