define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    var isLogin = Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/checkAuth/',
        initialize:function(state,page){

        },
        defaults: {

        },
        validate:function(attributes){

        }
    });


    //You usually don't return a model instantiated
    return new isLogin();
}

);