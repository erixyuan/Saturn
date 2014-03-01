define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    var ArticleList = Backbone.Model.extend({
        initialize:function(status,page){
            this.url = Saturn.cmsPath+'ipa/article/?'+'status='+status+'&page='+page;
        },
        defaults: {
            //name: "Harry Potter"
        },
        validate:function(attributes){

        }
    });

    //You usually don't return a model instantiated
    return ArticleList;
}

);