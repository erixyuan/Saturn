define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(type){
            this.url = Saturn.cmsPath+'ipa/category?type='+type;
            this.url = Saturn.cmsPath+'ipa/category?type='+type;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        }
    });
}

);