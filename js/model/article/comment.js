define([
    'underscore',
    'backbone',
    'jquery'
    ],

function(_, Backbone,$){
    return Backbone.Model.extend({
        initialize:function(status,page){
            this.url = Saturn.cmsPath+'ipa/comment';
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes,func){

        },
        refuse: function(id,func){
            var data = [];
            if(id instanceof Array){
                data = id;
            }else{
                data.push(id);
            }
            $.ajax({
                url:Saturn.cmsPath+'ipa/comment/refuse',
                type:"POST",
                data:{ids:data},
                contentType : 'application/json',
                dataType: 'json',
                success: func ? func : function(){},
            })
        },
        delete:function(id,func){
            var data = [];
            if(id instanceof Array){
                data = id;
            }else{
                data.push(id);
            }
            $.ajax({
                url:Saturn.cmsPath+'ipa/comment',
                type:"DELETE",
                data:{ids:data},
                contentType : 'application/json',
                dataType: 'json',
                success: func ? func : function(){},
            })
        },
        pass:function(id,func){
            var data = [];
            if(id instanceof Array){
                data = id;
            }else{
                data.push(id);
            }
            $.ajax({
                url:Saturn.cmsPath+'ipa/comment/publish',
                type:"POST",
                data:{ids:data},
                contentType : 'application/json',
                dataType: 'json',
                success: func ? func : function(){},
            })
        }
    });
}

);