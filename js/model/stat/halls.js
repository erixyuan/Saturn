define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/stat/hall',
        initialize:function(state,page){

        },
        defaults: {

        },
        validate:function(attributes){

        }
    });

}

);