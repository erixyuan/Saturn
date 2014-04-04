define([
    'jquery',
    'template',
    'backbone',
    '../../model/common/attachment',
    '../PaginationPluginView'
    ],

function($, template, Backbone, modelData,PaginationPluginView){
    var tpl = '{{each}}'+
                '<li>'+
                    '<img src="{{$value.thumb_url}}" title="{{$value.filename}}" alt="{{$value.filename}}" data-thumb-url="{{$value.thumb_url}}" data-origin-url="{{$value.origin_url}}">'+
                    '<span class="bottom">'+
                        '<span class="filename">{{$value.filename}}</span>'+
                        '<span class="actions">'+
                            '<span class="g-btn g-btn-mini" href="javascript:void(0);" operateId="{{$value.id}}" operate="deleteImg">删除</span> '+
                            '| <span class="g-btn g-btn-mini" href="javascript:void(0);" operateId="{{$value.id}}" operate="selectImg">确定</span>'+
                        '</span>'+
                    '</span>'+
                '</li>'+
              '{{/each}}';

    return Backbone.View.extend({
        model: modelData,
        template:tpl,
        initialize: function(obj){
            this.model = new this.model('subject',obj.id);

            this.model.fetch({
                success:function(model,respones){
                    this.render(respones);
                }.bind(this)
            });

        },
        events:{
        },
        render: function(respones) {
            var uploadImgHtml = template.compile(this.template)(respones.data);
            $('#js_uploadImgList').html(uploadImgHtml);
            $('#js_subject-thumb-upload-list').addClass('show');

            new PaginationPluginView({
                id : "#paginationPlugin_banner",
                data : this.model.attributes,
                callback:function(){
                    this.render();
                }.bind(this),
                parent:option,
            })
        }
    });
}

);