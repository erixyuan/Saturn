define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url : Saturn.cmsPath+'ipa/theme',
        initialize:function(key){
        },
        defaults: {
        },
    });
}

);