define([
    'jquery',
    'template',
    'backbone',
    '../../model/common/attachment'
    ],

function($, template, Backbone, modelData){
    var tpl = '{{each}}'+
                '<li>'+
                    '<img src="{{$value.thumb_url}}" alt="">'+
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
        }
    });
    // 模块现在返回实例化后的view
    // 有的时候你可能需要返回未实例化的view，可以写 return projectListView
}

);