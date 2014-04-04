<?php

class PostController extends BaseController {

    private $view;

    function __construct() {
        $view = Option::get('theme');
        if (in_array($view, helper::themes())) {
            $this->view = $view;
        } else {
            return View::make('404');
        }
    }


    // 找模板
    function findTemplate($name, $type) {
        if ($name && $type) {
            $t            = Config::get('view.paths');
            $template_dir = array_pop($t)
                    . '/' . Option::get('theme') . '/' . $type . '/template';
            if (file_exists($template_dir . '/' . $name . '.blade.php')) {
                return $type . '.template.' . $name;
            }
        }
        if ($type == 'subject') {
            return $type . '.view';
        }
        return $type . '.' . $type;
    }


    // 找文章 ID
    public function byId($id) {
        $article = Article::find($id);
        if ($article && $article->status > 0) {
            $params = ['article' => $article];
            if (Input::has('page')) {
                $params['page'] = Input::get('page');
            } else {
                $article->views++;
                $article->save();
            }
            $template = $this->findTemplate($article->template, 'subject');
            return View::make($this->view . '.' . $template, $params);
        } else {
            return View::make('404');
        }
    }






    // APP 應用跳轉地址 如/dl/a5555 跳轉倒 baidu.com
    public function goToAppDownloadUrl($id) {
        $appinfo = Appinfo::find($id);
        if($appinfo['url']){
            $appinfo_url = $appinfo['url'];
            // ::TODO:: 這種校驗方法應該還有別的更好的，不過不知道怎麼寫，或許可以寫一個放到helper
            // 如果URL裏沒有http和https開頭，就給加上
            // preg_match("/^htt/", $appinfo_url);
            if ( preg_match("/^htt/", $appinfo_url) == false ) {
                $appinfo_url = 'http://'.$appinfo_url;
            }
            return Redirect::to($appinfo_url);
        }else {
            return View::make('404');
        }
    }



    // 市場跳轉地址 如/dl/p1111 跳轉倒 tmall.com
    public function goToMarketUrl($id) {
        $productlink = ProductLink::find($id);
        if($productlink['url']){
            $productlink_url = $productlink['url'];

            if ( preg_match("/^htt/", $productlink_url) == false ) {
                $productlink_url = 'http://'.$productlink_url;
            }
            return Redirect::to($productlink_url);
        }else {
            return View::make('404');
        }
    }









    // 找 slug
    public function bySlug($slug) {
        $article = Article::where('slug', $slug)->first();
        if ($article && $article->status > 0) {
            $params = ['article' => $article];
            if (Input::has('page')) {
                $params['page'] = Input::get('page');
            } else {
                $article->views++;
                $article->save();
            }
            $template = $this->findTemplate($article->template, 'subject');
            return View::make($this->view . '.' . $template, $params);
        } else {
            return View::make('404');
        }
    }



    // 找分类
    public function byCategory($slug) {
        $cate = Category::where('slug', $slug)->first();
        if ($cate) {
            $a      = $cate->articles()->withCate()->status(Article::S_PUBLISHED);
            if ($subtag = Input::get('subtag')) {
                $subtag = explode(",", $subtag);
                $subtag = array_map('strtolower', $subtag);
                foreach ($subtag as $k => $s) {
                    if ($k) {
                        $a = $a->orWhereHas('tags', function($q) use($s) {
                            $q->where('name', $s);
                        });
                    } else {
                        $a = $a->WhereHas('tags', function($q) use($s) {
                            $q->where('name', $s);
                        });
                    }
                }
            }

            // 可用，但只能找主题目录下的category
            // $a = $a->orderby('published', 'desc')->distinct()->paginate(20);
            // return View::make($this->view . '.category', [
            //             'articles' => $a,
            //             'cate'     => $cate,
            //             'subtag'   => $subtag,
            // ]);



            $a      = $a->orderby('published', 'desc')->distinct()->paginate(20);
            $params = [
                'articles' => $a,
                'cate'     => $cate,
                'subtag'   => $subtag,
            ];

            $template = $this->findTemplate($cate->template, 'category');
            return View::make($this->view . '.' . $template, $params);




        } else {
            return View::make('404');
        }
    }






    // 找tag
    public function byTag($tag) {
        $o_tag = Tag::where('name', $tag)->first();
        if ($o_tag) {
            $a = Article::status(Article::S_PUBLISHED)
                    ->withCate()
                    ->WhereHas('tags', function($q) use($tag) {
                $q->where('name', $tag);
            });
            if ($subtag = Input::get('subtag')) {
                $subtag = explode(",", $subtag);
                $subtag = array_map('strtolower', $subtag);

                foreach ($subtag as $k => $s) {
                    if ($k) {
                        $a = $a->orWhereHas('tags', function($q) use($s) {
                            $q->where('name', $s);
                        });
                    } else {
                        $a = $a->WhereHas('tags', function($q) use($s) {
                            $q->where('name', $s);
                        });
                    }
                }
            }
            $a      = $a->orderby('published', 'desc')->distinct()->paginate(20);
            $params = [
                'articles' => $a,
                'tag'      => $tag,
                'subtag'   => $subtag,
            ];

            $template = $this->findTemplate($o_tag->template, 'tag');
            return View::make($this->view . '.' . $template, $params);
        } else {
            return View::make('404');
        }
    }




    // 找作者 ::TODO:: 這個需要之後也做模板，按用戶id，或後臺某個地方的ID。
    public function byAuthor($uid) {
        $author = User::with('metas')->with('roles')->where('id', $uid)->first();

        // 頭像暫時這樣拿，終於搞定了，眼淚都掉下來了。 ::TODO:: SolidZORO
        $avatar = User::with('avatar')->where('id', $uid)->first();

        if($author) {
            $a = $author->articles()->status(Article::S_PUBLISHED)
                ->withCate()
                ->orderby('published', 'desc')->paginate(20);
            return View::make($this->view . '.author.author', [
                'articles' => $a,
                'author'   => $author,
                'avatar' => $avatar
            ]);
        } else {
            return View::make('404');
        }
    }





    // 找归档
    public function byArchives() {
        $as                = Article::select('id', 'published', 'title')
                        ->status(Article::S_PUBLISHED)->orderby('published', 'desc')->get();
        $articles_by_month = array();
        foreach ($as as $a) {
            $m = date('Y-m-1', $a->published);
            $m = strtotime($m);
            if (!isset($articles_by_month[$m])) {
                $articles_by_month[$m] = [];
            }
            $articles_by_month[$m][] = $a;
        }
        return View::make($this->view . '.archives', [
                    'articles_by_month' => $articles_by_month
        ]);
    }


    // 找关键字
    public function byKeyword($keyword) {
        helper::clean_xss($keyword);
        if (mb_strlen($keyword, 'utf-8') < 2) {
            $keyword = '';
        }

        $category_id = Input::get('categoryid');
        $withappname = Input::get('withappname', 0);
        $withtag     = Input::get('withtag', 0);

        $page   = Input::get('page', 1);
        $page   = max(1, $page);
        $params = ['keyword' => $keyword];

        if ($keyword) {
            $articles = Article::status(Article::S_PUBLISHED)
                    ->withCate()
                    ->select(DB::raw('subjects.*'));

            //空格分词
            $keyword = explode(' ', trim($keyword));

            foreach ($keyword as $keyword) {
                if (strlen($keyword)) {
                    //搜文章标题
                    $articles = $articles->where('title', 'like', "%$keyword%");
                    if ($withappname) {
                        //搜应用名/英文
                        $articles = $articles->WhereHas('apps', function($q) use($keyword) {
                            $q->where('name', 'like', "%$keyword%")
                                    ->orwhere('name_en', 'like', "%$keyword%");
                        });
                    }
                    if ($withtag) {
                        //搜标签名
                        $articles = $articles->WhereHas('tags', function($q) use($keyword) {
                            $q->where('name', 'like', "%$keyword%");
                        });
                    }
                }
            }

            if ($category_id) {
                $article = $article->join('re_subjects_categories as sc', 'subjects.id', '=', 'sc.subject_id')
                        ->where('sc.category_id', $category_id);
            }
            if ($withappname) {
                //试一次精确匹配
                $try_app = Application::with('icon')->whereRaw('name=? or name_en=? or name_cn=?', [$keyword[0], $keyword[0], $keyword[0]])
                                ->take(1)->first();
                //如果没有，就用模糊
                if (!$try_app) {
                    $try_app = Application::with('icon')->whereRaw('name like \'%?%\' or name_en like \'%?%\'', [$keyword[0], $keyword[0]])
                                    ->orderBy('created', 'desc')->take(1)->first();
                }
                $params['appinfo'] = $try_app;
                //找到app，调用caller取相关文章
//                if ($try_app) {
//                    $subjects_for_app            = $caller->get('subjects', array(
//                        'hasapp'   => true,
//                        'keywords' => $keyword,
//                        'limit'    => 5,
//                        'order'    => '`subjects`.created DESC'
//                    ));
//                    $this->data['_APP_SUBJECTS'] = $subjects_for_app;
//                }
            }

            //使用前缀search_keyword_是为了区分search_log 防止删除
            //使用condition序列化来对应不同搜索条件的页面
//            if ($page == 1 && $subjects->id()) {
//                $this->refreshSearchLog($keyword);
//            }
            $params['articles'] = $articles->orderby('published', 'desc')
                    ->paginate(20);
        }

        //高级搜索标志位
        $params['flag'] = array(
            'cid' => $category_id,
            'app' => $withappname,
            'tag' => $withtag
        );
        return View::make($this->view . '.search', $params);
    }

}
