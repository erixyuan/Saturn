define([
    'underscore',
    'backbone',
    '../../model/article/list'
    ],

function(_, Backbone,listModel){

    var returnData = Backbone.Collection.extend({
        model : listModel,
        // 持久化到本地数据库
        //localStorage: new Storage("listModel"),

    });

    //You usually don't return a model instantiated
    return returnData;
}

);