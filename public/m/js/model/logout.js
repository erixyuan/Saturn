define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/logout/',
        initialize:function(state,page){

        },
    });
}

);