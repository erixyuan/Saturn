define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/stat/appdown',
        initialize:function(state,page){

        },
        defaults: {

        },
        validate:function(attributes){

        }
    });

}

);