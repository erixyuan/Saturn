define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url : Saturn.cmsPath+'ipa/cache/flush',
        initialize:function(key){
        },
        defaults: {
        },
    });
}

);