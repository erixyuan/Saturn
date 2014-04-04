
require.config({
    paths: {
         "jquery": '../../resource/js/lib/jquery/jquery-1.11.0.min',
         'ace' : "../../resource/js/lib/aceEditor/src-min/ace",
         'emmet': "../../resource/js/lib/aceEditor/plugin/emmet",
         'ext-emmet': "../../resource/js/lib/aceEditor/src-min/ext-emmet",
         'tinymce' : '../../resource/js/lib/tinymce/tinymce.min',
         'enquire' : '../../resource/js/lib/enquire/enquire.min',

         "backbone":'../../resource/js/lib/backbonejs/backbone',
         "underscore":'../../resource/js/lib/backbonejs/underscore',
         "text":'../../resource/js/lib/requirejs/plugin/text',
         "css":'../../resource/js/lib/requirejs/plugin/css',
         "template":'../../resource/js/lib/artTemplate/template-simple',
         "albumcolors" : "../../resource/js/lib/albumcolors/albumcolors",
         "onecolor" : "../../resource/js/lib/colorjoe/onecolor",
         "colorjoe" : "../../resource/js/lib/colorjoe/colorjoe",
     },
     shim:{
        "backbone":{
            deps:['underscore','jquery'],
            exports:'Backbone'
        },
        'underscore':{
            exports:'_'
        },
        'template':{
            exports:'template'
        },
        'ace':{
            'exports':'ace'
        },
        'KindEditor':{
            'exports':'KindEditor'
        },
        'lang':{
            deps:['KindEditor'],
        },
        'albumColors':{
            'exports':'AlbumColors'
        },
        'colorjoe':{
            'exports':'colorjoe',
            deps:['onecolor'],
        },
        'onecolor':{
            'exports':'onecolor',
        },
        'ext-emmet':{
            deps:['ace','emmet'],
        }
     }
})

// 这里依赖ace，是为了后面的兼容，ace需要提前加载。不然里面的require会冲突
require(['jquery','backbone','model/checkLogin','enquire'], function($,Backbone, isLogin){

    // 第一次进入页面要检查一下登陆情况
    isLogin.fetch({
        success:function(model,data){
            if(data.errCode!= 0){
                window.location.href = 'login.html';
            }else{
                callback(data);
            }
        }
    });

    function loadView(func){
        // 每次切换视图都把之前的视图，绑定的事件，还有model注销掉
        if (Saturn.currentView && Saturn.currentView.undelegateEvents) {
            Saturn.currentView.undelegateEvents()
        };
        Saturn.beginLoading();
        func();
    }

    function initGobalEvent(data){
        Saturn.userId = data.userid;
        // 加載當前JS後，body顯示
        $('body').css('display','block');

        // 如果有頭像，就把原來的src改寫
        if (data.avatar) {
            $('#js_avatarImg').attr('src',data.avatar)
        };
        $('#js_userName').html(data.username);      /*加入用户名*/
        $('#js_editInfo').attr('href','#userManage/user/edit/'+data.userid);

        $('#js_avatar').mouseover(function(){
            $('#js_exp-box').fadeIn(150);
        });

        var timer = null;
        $('#js_exp-box').hover(function(){
            clearTimeout(timer);
            $(this).stop();
            $('#js_exp-box').fadeIn(150);
        },function(){
            //$('#js_exp-box').delay(6000).hide(0);
            timer = setTimeout(function(){
                $('#js_exp-box').fadeOut(50);
            },300)
        });

    }

    // 根据用户的权限加载好头部和底部
    function callback(data){
        initGobalEvent(data);
        // 加载头部
        require(['view/navView'],function(navView){
            new navView();
            // 显示头部
            $('#js_mainHeader').css('display','block')

            // 路由定时器，等待导航加载完成
            var routeTimer = null;
            routeTimer = setInterval(function(){
                if($('#js_topNav').html() != ''){
                    Saturn.Router = new Router();
                    Backbone.history.start();
                    clearInterval(routeTimer);
                }
            }, 500)

        });
        var Router = Backbone.Router.extend({
            initialize:function(){
                this.route(/^article\/list\/(.*?)\?category=(.*?)$/,'articleListForCategory');

                // 按应用列表的分类来显示路由
                this.route(/^application\/list\/(.*?)\?category=(.*?)$/,'applicationListForCategory');
                // 按应用列表的作者来显示路由
                this.route(/^application\/list\/(.*?)\?author=(.*?)$/,'applicationListForAuthor');

                // 按文章列表的分类来显示路由
                this.route(/^article\/list\/(.*?)\?category=(.*?)$/,'articleListForCategory');
                // 按应用列表的作者来显示路由
                this.route(/^article\/list\/(.*?)\?author=(.*?)$/,'articleListForAuthor');
            },

            routes: {
                'article/category/create' : 'category_edit',
                'application/category/create' : 'category_edit',
                'product/category/create' : 'category_edit',

                // ************文章 start*********************
                "article":                          "article_list",
                "article/list":                     "article_list",
                "article/list/:status/:page":            "article_list",
                "article/list/:status/:keyword/:page":   "article_list",
                "article/edit/:id":                 "article_edit",
                "article/create":                   "article_edit",
                "article/category":                 "article_category",
                "article/category/:id":             "category_edit",
                "article/comment":                  "article_comment",
                "article/comment/:status/:page":    "article_comment",
                "article/articleSyn":               "article_articleSyn",
                "article/articleSyn/:status/:page": "article_articleSyn",
                // ************文章 end*********************

                // ************应用 start*********************
                "application":                      "app_list",
                "application/list":                 "app_list",
                "application/list/:status/:page":   "app_list",
                "application/list/:status/:keyword/:page":   "app_list",
                "application/edit/:id":             "app_edit",
                "application/create":               "app_edit",
                "application/category":             "app_category",
                "application/category/:id":         "category_edit",
                // ************应用 end*********************

                // ************产品 start*********************
                "product":                      "product_list",
                "product/list":                 "product_list",
                "product/list/:status/:page":   "product_list",
                "product/list/:status/:keyword/:page":   "product_list",
                "product/edit/:id":             "product_edit",
                "product/create":               "product_edit",
                "product/category":             "product_category",
                "product/category/:id":         "category_edit",
                // ************产品 end*********************

                // ************统计 start*********************
                "stat":            "stat_pv",
                "stat/pv":         "stat_pv",
                "stat/appdown":         "stat_appdown",
                "stat/platform":         "stat_platform",
                "stat/halls":         "stat_halls",
                "stat/api":         "stat_api",
                "stat/quality":         "stat_quality",
                // ************统计 start*********************

                // ************用户 start*********************
                "userManage":            "user_list",
                "userManage/role/list":         "role_list",
                "userManage/role/edit/:id":         "role_edit",
                "userManage/role/create":         "role_edit",
                "userManage/user/list":         "user_list",
                "userManage/user/list/:id":         "user_list",
                "userManage/user/list/:keyword/:id":         "user_list",
                "userManage/user/edit/:id":         "user_edit",
                "userManage/user/create":         "user_edit",
                // ************用户 end*********************


                // ************插件 start*********************
                "plugin" : "adList",
                "plugin/pluginList" : "plugin_list",

                'plugin/appkeyList' : "appkeyList",
                'plugin/appkeyEdit/:id' : "appkeyEdit",
                'plugin/appkeyCreate' : "appkeyEdit",
                'plugin/adList' : "adList",
                'plugin/adEdit/:id' : "adEdit",
                'plugin/adCreate' : "adEdit",
                'plugin/ucenterSet' : "ucenterSet",
                'plugin/sqlisteOutput' : "sqlisteOutput",
                'plugin/duoshuoSet' : "duoshuoSet",
                // ************插件 end*********************



                // ************设置 end*********************
                'set' : "settingSystem",
                'set/settingSystem' : "settingSystem",
                'set/setSynchronous' : "setSynchronous",
                'set/themesList' : "themesList",
                'set/clearCache' : "clearCache",
                // ************设置 end*********************



                ''     : 'home',
                'home' : 'home'

            },
            home:function(){
                loadView(function(){
                    require(['view/HomeView'],function(HomeView){
                        Saturn.currentView = new HomeView();
                        Saturn.navModel.set({currentModule:'home',secondModule:'system'});
                        $('#js_sidebar a[module=user]').attr('href','#userManage/user/edit/'+Saturn.userId);

                    });
                });

            },

            category_edit:function(id){
                loadView(function(){
                    require(['view/common/EditCategoryView'],function(EditCategoryView){
                        // 正则获取当前导航模块
                        var reg = /#(.*)\/category/;
                        var module = window.location.href.match(reg)[1];
                        if(id){
                            Saturn.currentView = new EditCategoryView({id:id});
                        }else{
                            Saturn.currentView = new EditCategoryView({module:module});
                        }
                        // 保持之前的导航
                        Saturn.navModel.set({
                            currentModule:module,
                            secondModule:'category'}
                        );
                    });
                });

            },

            //**********************************article start*********************************
            article_list: function(status,keyword,page) {
                if(arguments.length >2){
                    loadView(function(){
                        require(['view/article/ArticleList'],function(ArticleListView){
                            Saturn.currentView = new ArticleListView({status:status,page:page,keyword:keyword});
                            Saturn.navModel.set({currentModule:'article',secondModule:'list'});
                        });
                    });
                }else{
                    loadView(function(){
                        require(['view/article/ArticleList'],function(ArticleListView){
                            Saturn.currentView = new ArticleListView({status:status,page:keyword});
                            Saturn.navModel.set({currentModule:'article',secondModule:'list'});
                        });
                    });
                }


            },
            article_edit: function(id) {
                loadView(function(){
                    require(['view/article/ArticleEditView'],function(ArticleEditView){
                        Saturn.currentView = new ArticleEditView({id:id});
                        Saturn.navModel.set({currentModule:'article',secondModule:'create'});
                    });
                })

            },
            article_category:function(){
                loadView(function(){
                    require(['view/article/ArticleCategoryView'],function(ArticleCategoryView){
                        Saturn.currentView = new ArticleCategoryView();
                        Saturn.navModel.set({currentModule:'article',secondModule:'category'});
                    });
                })
            },
            article_comment:function(status,page){
                loadView(function(){
                    require(['view/article/ArticleCommentView'],function(ArticleCommentView){
                        Saturn.currentView = new ArticleCommentView({status:status,page:page});
                        Saturn.navModel.set({currentModule:'article',secondModule:'comment'});
                    });
                })

            },
            article_articleSyn:function(status,page){
                loadView(function(){
                    require(['view/article/ArticleSynView'],function(ArticleSynView){
                        Saturn.currentView = new ArticleSynView({status:status,page:page});
                        Saturn.navModel.set({currentModule:'article',secondModule:'articleSyn'});
                    });
                });

            },
            articleListForCategory:function(params,category){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    category:category
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/article/ArticleList'],function(ArticleListView){
                    Saturn.currentView = new ArticleListView(obj);
                    Saturn.navModel.set({currentModule:'article',secondModule:'list'});
                });

            },
            articleListForCategory:function(params,category){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    category:category
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/article/ArticleList'],function(ListView){
                    Saturn.currentView = new ListView(obj);
                    Saturn.navModel.set({currentModule:'article',secondModule:'list'});
                });

            },
            articleListForAuthor:function(params,author){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    author:author
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/article/ArticleList'],function(ListView){
                    Saturn.currentView = new ListView(obj);
                    Saturn.navModel.set({currentModule:'article',secondModule:'list'});
                });

            },
            //**********************************article start*********************************



            //**********************************application start*********************************
            app_list:function(status,keyword,page){
                if(arguments.length >2){
                    loadView(function(){
                        require(['view/application/ListView'],function(ListView){
                            Saturn.currentView = new ListView({status:status,page:page,keyword:keyword});
                            Saturn.navModel.set({currentModule:'application',secondModule:'list'});
                        });
                    });
                }else{
                    loadView(function(){
                        require(['view/application/ListView'],function(ListView){
                            Saturn.currentView = new ListView({status:status,page:keyword});
                            Saturn.navModel.set({currentModule:'application',secondModule:'list'});
                        });
                    });
                }


            },
            app_edit: function(id) {
                loadView(function(){
                    require(['view/application/EditView'],function(EditView){
                        Saturn.currentView = new EditView({id:id});
                        Saturn.navModel.set({currentModule:'application',secondModule:'create'});
                    });
                })

            },
            app_category:function(){
                loadView(function(){
                    require(['view/application/CategoryView'],function(CategoryView){
                        Saturn.currentView = new CategoryView();
                        Saturn.navModel.set({currentModule:'application',secondModule:'category'});
                    });
                })

            },
            app_category_edit:function(id){
                loadView(function(){
                    require(['view/common/EditCategoryView'],function(EditCategoryView){
                        Saturn.currentView = new EditCategoryView({id:id});
                        Saturn.navModel.set({currentModule:'application',secondModule:'list'});
                    });
                });

            },
            applicationListForCategory:function(params,category){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    category:category
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/application/ListView'],function(ListView){
                    Saturn.currentView = new ListView(obj);
                    Saturn.navModel.set({currentModule:'application',secondModule:'list'});
                });

            },
            applicationListForAuthor:function(params,author){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    author:author
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/application/ListView'],function(ListView){
                    Saturn.currentView = new ListView(obj);
                    Saturn.navModel.set({currentModule:'application',secondModule:'list'});
                });

            },
            //**********************************application end*********************************





            //**********************************product start*********************************
            product_list:function(status,keyword,page){
                if(arguments.length >2){
                    loadView(function(){
                        require(['view/product/ListView'],function(ListView){
                            Saturn.currentView = new ListView({status:status,page:page,keyword:keyword});
                            Saturn.navModel.set({currentModule:'product',secondModule:'list'});
                        });
                    });
                }else{
                    loadView(function(){
                        require(['view/product/ListView'],function(ListView){
                            Saturn.currentView = new ListView({status:status,page:keyword});
                            Saturn.navModel.set({currentModule:'product',secondModule:'list'});
                        });
                    });
                }


            },
            product_edit: function(id) {
                loadView(function(){
                    require(['view/product/EditView'],function(EditView){
                        Saturn.currentView = new EditView({id:id});
                        Saturn.navModel.set({currentModule:'product',secondModule:'create'});
                    });
                })

            },
            product_category:function(){
                loadView(function(){
                    require(['view/product/CategoryView'],function(CategoryView){
                        Saturn.currentView = new CategoryView();
                        Saturn.navModel.set({currentModule:'product',secondModule:'category'});
                    });
                })

            },
            product_category_edit:function(id){
                loadView(function(){
                    require(['view/common/EditCategoryView'],function(EditCategoryView){
                        Saturn.currentView = new EditCategoryView({id:id});
                        Saturn.navModel.set({currentModule:'product',secondModule:'list'});
                    });
                });

            },
            productListForCategory:function(params,category){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    category:category
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/product/ListView'],function(ListView){
                    Saturn.currentView = new ListView(obj);
                    Saturn.navModel.set({currentModule:'product',secondModule:'list'});
                });

            },
            productListForAuthor:function(params,author){
                var arr = params.split('/');
                if (arr.length == 0) { return false;};
                var obj ={
                    author:author
                };
                obj.status = arr[0];
                if(arr.length > 2){
                    obj.keyword = arr[1];
                    obj.page = arr[2];
                }else{
                    obj.page = arr[1];
                    obj.keyword = undefined;
                }
                require(['view/product/ListView'],function(ListView){
                    Saturn.currentView = new ListView(obj);
                    Saturn.navModel.set({currentModule:'product',secondModule:'list'});
                });

            },
            //**********************************product end*********************************







            //**********************************统计 start*********************************
            stat_pv:function(){
                loadView(function(){
                    require(['view/stat/StatPvView'],function(StatPvView){
                        Saturn.currentView = new StatPvView();
                        Saturn.navModel.set({currentModule:'stat',secondModule:'pv'});
                    });
                });

            },
            stat_appdown:function(){
                loadView(function(){
                    require(['view/stat/StatAppdownView'],function(StatAppdownView){
                        Saturn.currentView = new StatAppdownView();
                        Saturn.navModel.set({currentModule:'stat',secondModule:'appdown'});
                    });
                });

            },
            stat_platform:function(){
                loadView(function(){
                    require(['view/stat/StatPlatformView'],function(StatPlatformView){
                        Saturn.currentView = new StatPlatformView();
                        Saturn.navModel.set({currentModule:'stat',secondModule:'platform'});
                    });
                });

            },
            stat_halls:function(){
                loadView(function(){
                    require(['view/stat/StatHallsView'],function(StatHallsView){
                        Saturn.currentView = new StatHallsView();
                        Saturn.navModel.set({currentModule:'stat',secondModule:'halls'});
                    });
                });

            },
            stat_api:function(){
                loadView(function(){
                    require(['view/stat/StatApiView'],function(StatApiView){
                        Saturn.currentView = new StatApiView();
                        Saturn.navModel.set({currentModule:'stat',secondModule:'api'});
                    });
                });

            },
            stat_quality:function(){
                loadView(function(){
                    require(['view/stat/StatQualityView'],function(StatQualityView){
                        Saturn.currentView = new StatQualityView();
                        Saturn.navModel.set({currentModule:'stat',secondModule:'quality'});
                    });
                });

            },
            //**********************************统计 end*********************************





            //**********************************用户 start*********************************
            role_list:function(){
                loadView(function(){
                    require(['view/role/RoleListView'],function(RoleListView){
                        Saturn.currentView = new RoleListView();
                        Saturn.navModel.set({currentModule:'userManage',secondModule:'role/list'});
                    });
                });

            },
            role_edit:function(id){
                loadView(function(){
                    require(['view/role/RoleEditView'],function(RoleEditView){
                        Saturn.currentView = new RoleEditView({id:id});
                        if(id){
                            Saturn.navModel.set({currentModule:'userManage',secondModule:'role/list'});
                        }else{
                            Saturn.navModel.set({currentModule:'userManage',secondModule:'role/create'});
                        }
                    });
                });


            },
            user_list:function(keyword,page){
                if(arguments.length >1){
                    loadView(function(){
                        require(['view/role/UserListView'],function(UserListView){
                            Saturn.currentView = new UserListView({keyword:keyword,page:page});
                            Saturn.navModel.set({currentModule:'userManage',secondModule:'user/list'});
                        });
                    });
                }else{
                    loadView(function(){
                        require(['view/role/UserListView'],function(UserListView){
                            Saturn.currentView = new UserListView({page:keyword});
                             Saturn.navModel.set({currentModule:'userManage',secondModule:'user/list'});
                        });
                    });
                }


            },
            user_edit:function(id){
                loadView(function(){
                    require(['view/role/UserEditView'],function(UserEditView){
                        Saturn.currentView = new UserEditView({id:id});
                    });
                    if (id) {
                        Saturn.navModel.set({currentModule:'userManage',secondModule:'user/list'});
                    }else{
                        Saturn.navModel.set({currentModule:'userManage',secondModule:'user/create'});
                    }
                });


            },
            //**********************************用户 end*********************************



            //**********************************插件 end*********************************
            plugin_list:function(){
                loadView(function(){
                    require(['view/plugin/PluginListView'],function(PluginListView){
                        Saturn.currentView = new PluginListView();
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'pluginList'});
                    });
                });

            },
            appkeyList:function(){
                loadView(function(){
                    require(['view/plugin/AppkeyListView'],function(AppkeyListView){
                        Saturn.currentView = new AppkeyListView();
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'appkeyList'});
                    });
                });

            },
            appkeyEdit:function(id){
                loadView(function(){
                    require(['view/plugin/AppkeyEditView'],function(AppkeyEditView){
                        Saturn.currentView = new AppkeyEditView({id:id});
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'appkeyList'});
                    });
                });

            },
            adList:function(){
                loadView(function(){
                    require(['view/plugin/AdListView'],function(AdListView){
                        Saturn.currentView = new AdListView();
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'adList'});
                    });
                });

            },
            adEdit:function(id){
                loadView(function(){
                    require(['view/plugin/AdEditView'],function(AdEditView){
                        Saturn.currentView = new AdEditView({id:id});
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'adList'});
                    });
                });

            },
            ucenterSet:function(){
                loadView(function(){
                    require(['view/plugin/UcenterSetView'],function(UcenterSetView){
                        Saturn.currentView = new UcenterSetView();
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'ucenterSet'});
                    });
                });

            },
            sqlisteOutput:function(){
                loadView(function(){
                    require(['view/plugin/SqlisteOutputView'],function(SqlisteOutputView){
                        Saturn.currentView = new SqlisteOutputView();
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'pluginList'});
                    });
                });

            },
            duoshuoSet:function(){
                loadView(function(){
                    require(['view/plugin/DuoshuoSetView'],function(DuoshuoSetView){
                        Saturn.currentView = new DuoshuoSetView();
                        Saturn.navModel.set({currentModule:'plugin',secondModule:'duoshuoSet'});
                    });
                });

            },
            //**********************************插件 end*********************************


            // ************设置 end*********************
                // 'set' : "settingSystem",
                // 'set/settingSystem' : "settingSystem",
                // 'set/themesList' : "themesList",
                // 'set/clearCache' : "clearCache",
            setSynchronous:function(){
                loadView(function(){
                    require(['view/setting/SetSynchronousView'],function(SetSynchronousView){
                        Saturn.currentView = new SetSynchronousView();
                        Saturn.navModel.set({currentModule:'set',secondModule:'setSynchronous'});
                    });
                });

            },
            settingSystem:function(){
                loadView(function(){
                    require(['view/setting/SetSystemView'],function(SetSystemView){
                        Saturn.currentView = new SetSystemView();
                        Saturn.navModel.set({currentModule:'set',secondModule:'settingSystem'});
                    });
                });

            },
            themesList:function(){
                loadView(function(){
                    require(['view/setting/ThemesListView'],function(ThemesListView){
                        Saturn.currentView = new ThemesListView();
                        Saturn.navModel.set({currentModule:'set',secondModule:'themesList'});
                    });
                });

            },
            clearCache:function(){
                loadView(function(){
                    require(['view/setting/ClearCacheView'],function(ClearCacheView){
                        Saturn.currentView = new ClearCacheView();
                        Saturn.navModel.set({currentModule:'set',secondModule:'clearCache'});
                    });
                });

            },
            // ************设置 end*********************
        });


    }



});

