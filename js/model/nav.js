define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        url:Saturn.cmsPath+'ipa/checkAuth/',
        initialize:function(){

        },
        defaults: {
            data:{
                home:{
                    module:'home',
                    name:'首页',
                    css:'fa fa-home',
                    child:[
                        {
                            parent:'article',
                            name:'撰写文章',
                            module:'create'
                        },
                        {
                            parent:'article',
                            name:'文章列表',
                            module:'list'
                        },
                        {
                            parent:'application',
                            name:'撰写应用',
                            module:'create'
                        }
                    ]
                },
                article:{
                    module: 'article',
                    css : 'fa fa-file-text',
                    name: '文章',
                    child:[
                        {
                            parent:'article',
                            name:'撰写文章',
                            module:'create'
                        },
                        {
                            parent:'article',
                            name:'文章列表',
                            module:'list'
                        },
                        {
                            parent:'article',
                            name:'文章分类',
                            module:'category'
                        },
                        {
                            parent:'article',
                            name:'文章评论',
                            module:'comment'
                        },
                        {
                            parent:'article',
                            name:'文章同步',
                            module:'articleSyn'
                        },
                    ]
                },
                application:{
                    module: 'application',
                    css : 'fa fa-adn',
                    name: '应用',
                    child:[
                        {
                            parent:'application',
                            name:'添加应用',
                            module:'create'
                        },
                        {
                            parent:'application',
                            name:'应用列表',
                            module:'list'
                        },
                        {
                            parent:'application',
                            name:'应用分类',
                            module:'category'
                        }
                    ]
                },
                userManage:{
                    module: 'userManage',
                    css : 'fa fa-user',
                    name: '用户',
                    child:[
                        {
                            parent:'userManage',
                            name:'添加角色',
                            module:'role/create'
                        },
                        {
                            parent:'userManage',
                            name:'角色列表',
                            module:'role/list'
                        },
                        {
                            parent:'userManage',
                            name:'添加用户',
                            module:'user/create'
                        },
                        {
                            parent:'userManage',
                            name:'用户列表',
                            module:'user/list'
                        },
                    ]
                },
                plugin:{
                    module: 'plugin',
                    css : 'fa fa-flask',
                    name: '插件',
                    child:[
                        {
                            parent:'plugin',
                            name:'插件列表',
                            module:'pluginList'
                        },
                        {
                            parent:'plugin',
                            name:'Appkey设置',
                            module:'apkList'
                        },
                        {
                            parent:'plugin',
                            name:'广告设置',
                            module:'adList'
                        },
                        {
                            parent:'plugin',
                            name:'UCenter设置',
                            module:'ucenterSet'
                        },
                        {
                            parent:'plugin',
                            name:'导出SQLite',
                            module:'sqlisteOutput'
                        },
                        {
                            parent:'plugin',
                            name:'多说同步设置',
                            module:'duoshuoSet'
                        }

                    ]
                },
                stat:{
                    module: 'stat',
                    css : 'fa fa-sitemap',
                    name: '统计',
                    child:[
                        {
                            parent:'stat',
                            name:'访问量',
                            module:'pv'
                        },
                        {
                            parent:'stat',
                            name:'营业厅统计',
                            module:'halls'
                        },
                        {
                            parent:'stat',
                            name:'分类统计',
                            module:'appdown'
                        },
                        {
                            parent:'stat',
                            name:'平台统计',
                            module:'platform'
                        },
                        {
                            parent:'stat',
                            name:'API统计',
                            module:'api'
                        },
                        {
                            parent:'stat',
                            name:'文章绩效统计',
                            module:'api'
                        }
                    ]
                },
                set:{
                    module:'set',
                    css:'fa fa-cog',
                    name:'设置',
                    child:[
                        {
                            parent:'set',
                            name:'系统设置',
                            module:'settingSystem'
                        },
                        {
                            parent:'set',
                            name:'主题列表',
                            module:'themesList'
                        },
                        {
                            parent:'set',
                            name:'清空缓存',
                            module:'clearCache'
                        },
                        {
                            parent:'set',
                            name:'同步设置',
                            module:'setSynchronous'
                        },
                    ]

                }
            }
        },
        validate:function(attributes){

        }
    });
}

);