define([
    'jquery',
    'template',
    'backbone',
    'text!../../../template/plugin/adCreate.html',
    '../../model/plugin/adEdit',
    'swfupload',
    '../../model/common/attachment',
    '../PaginationView',
    ],

function($, template, Backbone, tpl,model,swfupload,attachment,PaginationView){

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


    var itemTpl = [
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


    return Backbone.View.extend({
        el:"#js_mainContent",
        model: model,
        template:tpl,
        imgTpl : imgTpl,
        itemTpl : itemTpl,
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
        },
        render: function() {
            var html = template.compile(this.template)(this.model.attributes);
            Saturn.renderToDom(html,'#js_mainContent');
            this.adImgLoadInit();

        },
        update:function(){
            var itemList = []
            $('#js_itemList tr').each(function(index,dom){
                var obj = {};
                obj.attachment_id = $(this).find('img[attachment_id]').attr('attachment_id');
                obj.title = $(this).find('input[name=title]').val();
                obj.link = $(this).find('input[name=link]').val();
                obj.content = $(this).find('textarea[name=content]').val();
                obj.order = $(this).find('input[name=order]').val();
                itemList.push(obj);
            });
            console.log(itemList);
            this.model.set({
                key : $('input[name=key]').val(),
                name : $('input[name=name]').val(),
                items : itemList
            });
            this.model.update(this.model.attributes);
        },
        addItem:function(){
            $('#js_itemList').append(this.itemTpl);
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
            var src = $(e.target).parents('li').find('img').attr('src');
            var id = $(e.target).attr('operateid');
            this.itemImg.attr('src',src);
            this.itemImg.attr('attachment_id',id);
            $('#js_imgListContent').removeClass('show');
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
                flash_url : Saturn.cmsPath+'manageV3/js/lib/swfupload/swfupload.swf',
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
                button_image_url: Saturn.cmsPath+'manageV3/js/lib/swfupload/upload-pic-btn.png',
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
    });
}

);