define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(id){
            this.url = Saturn.cmsPath+'ipa/user/'+id;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        }

    });
}

);