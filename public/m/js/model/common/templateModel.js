define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:'',
        initialize:function(type){
            this.url = Saturn.cmsPath+'ipa/template/?type='+type;
        },
        defaults: {
            //name: "Harry Potter"
        }
    });
}

);