<?php

class ManageArticle extends \BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {

        $params = Input::get();

        //设置隐藏域
        $article = Article::withCate()
                ->select(DB::raw('subjects.*'));

        if ($status = trim(Input::get('status'))) {
            $article = $article->status($status);
        }
        if ($keywords = trim(Input::get('keyword'))) {
            $article = $article->where('title', 'LIKE', "%{$keywords}%");
        }
        if ($uid = Input::get('uid')) {
            $article = $article->where('user_id',$uid);
        }
        if ($cid = Input::get('cid')) {
            $article = $article->join('re_subjects_categories as sc', 'subjects.id', '=', 'sc.subject_id')
                    ->where('sc.category_id', $cid);
        }
        if ($order = Input::get('orderby')) {
            $article = $article->orderby($order, 'desc');
        } else {
            $article = $article->orderby('created', 'desc');
        }
        $a_articles = $article
                      ->paginate(20)
                      ->toArray();

//        dd(DB::getQueryLog());
        //输出各个状态的文章数
        $counter_j    = '{"all":0,"publish":0,"draft":0,"pending":0,"refuse":0,"contribution":0,"recycle":0,"page":0}';
        $counter_sql  = "SELECT count(`status` !=0 or null) AS 'all',
            count(`status` =1 or null) AS publish,
            count(`status` =-1 or null) AS draft,
            count(`status` =-2 or null) AS pending,
            count(`status` =-3 or null) AS refuse,
            count(`status` <-10 and `status` >-20 or null) AS contribution,
            count(`status` =-99 or null) AS recycle,
            count(`status` =2 or null) AS page FROM subjects";
        $query_result = DB::select($counter_sql);
        $query_result = isset($query_result[0]) ?
                $query_result[0] : json_decode($counter_j);


        return array_merge($a_articles, $params, ['count' => $query_result]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        $new          = Article::firstOrCreate(array(
                    'user_id' => Auth::user()->id,
                    'status'  => Article::S_INIT,
        ));
        $new->created = time();
        $new->save();
        return $new;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {

        // 提交文章時，不強制要求填寫tag和分類
        // if (!Input::get('tags') || !Input::get('categories')) {
        //     return [
        //         'errCode' => 1,
        //         'msg'     => '请填写Tag或分类。'
        //     ];
        // }
        $o_article = Article::find(Input::get('id'));
        if (is_null($o_article)) {
            return [
                'errCode' => 1,
                'msg'     => '文章不存在。'
            ];
        }

        $o_article->fill(Input::only(['slug', 'goto_link', 'template', 'title',
                    'author', 'keywords', 'description', 'content', 'content_wmp',
                    'banner_id', 'banner_wmp', 'source_name', 'source_url', 'ontop', 'disable_comment']));

        //处理操作符
        //清除缩略图
        if (Input::get('cleanthumbs')) {
//            foreach ($o_article->attachments as $attachment) {
//                $attachment->cleanThumbs();
//            }
        }

        //过滤外站的链接
        if (Input::get('url_filter')) {
            $o_article->content = Article::urlFilter($o_article->content);
        }

        //处理文章状态

        if (Input::get('draft')) {
            $o_article->status = Article::S_DRAFT;
        } else if (Input::get('pending')) {
            $o_article->status = Article::S_PENDING;
        } else if (Input::get('autosave')) {
            if ($o_article->status == Article::S_INIT) {
                $o_article->status = Article::S_DRAFT;
            }
        } else {
            //todo检查发表权限
            //没有就设为草稿
            $o_article->status = Article::S_PUBLISHED;
        }

        if (Input::get('page')) {
            //todo检查发表权限
            //页面
            $o_article->status = Article::S_PAGE;
        }

        //定时
        if ($published = Input::get('published')) {
            $o_article->published = $published;
        }

        if (!$o_article->published && in_array($o_article->status, array(Article::S_PUBLISHED, Article::S_PAGE))) {
            //状态改(已经)为已发布或页面且没有发布时间时
            $o_article->published = time();
        }

        //没有作者就用用户名
        $o_article->author = $o_article->author ? $o_article->author : Auth::user()->username;

        //下载图片
//        $dom  = new SimpleHtmlDom($o_article->content);
//        $imgs = $dom->root ? $dom->find('img') : array();
//        foreach ($imgs as $img) {
//            $img_src = $img->src;
//
//            $download_src = $img_src;
//            $httphost     = PApp::instance()->request->httpHost();
//            $http_pattern = '(http.*?//.*?\.?(.*?)(\.(aero|biz|cc|co|com|coop|edu|gov|info|int|mil|museum|name|nato|net|org|tv|me|cn|gg)(\.)?(\.[a-zA-Z]{1,4})?)\/.*)';
//            if (preg_match($http_pattern, $download_src, $m)) {
//                if (strpos($httphost, $m[1]) !== false) {
//                    //不下载
//                } else {
//                    //下载
//                    $ext = strtolower(substr($download_src, -4)); //切不了 '.jpeg'
//                    if (in_array($ext, array('.jpg', '.gif', '.png'))) {
//                        $local_url = $this->downloadImage($download_src, $o_article->user_id, $o_article->id);
//                        if ($local_url) {
//                            $o_article->content = str_replace($img_src, $local_url, $o_article->content);
//                        }
//                    }
//                }
//            }
//        }
        //上传的时候,存的是原图地址
        //用第index张图片做banner图
        if ($index = Input::get('banner_index')) {
            $html = new Htmldom($o_article->content);
            foreach ($html->find('img') as $k => $img) {
                if ($k + 1 == $index) {
                    if (preg_match('([0-9]+(?=\.))', $img->src, $m)) {
                        $o_article->banner_id = $m[0];
                    }
                }
            }
        }
        //没有slug的时候产生拼音slug
        //需要设置开启
//        if (Option::get('subject_default_slug') && !$o_article->slug) {
//            if (Option::get('subject_default_slug') == 1) {
//                $o_article->slug = ZHSpell::zh2pinyin($o_article->title);
//            } else if (Option::get('subject_default_slug') == 2) {
//                $o_article->slug = $o_article->title;
//            }
//        }
        $o_article->description = trim(str_replace(array("\r", "\n", "\t"), '', $o_article->description));

        if (empty($o_article->keywords) && Input::has('tags')) {
            if (is_array(Input::get('tags'))) {
                $o_article->keywords = implode(',', Input::get('tags'));
            }
        }


        //处理关联
        //标签处理
        if ($tags = Input::get('tags')) {
            $tags = is_array($tags) ? array_unique($tags) : [$tags];
            $tags = array_map('trim', $tags);

            $exist_tags      = Tag::whereIn('name', $tags)->get();
            $exist_tags_name = $exist_tags->lists('name');
            $tagids          = $exist_tags->lists('id');

            foreach ($tags as $tag) {
                if (!in_array($tag, $exist_tags_name)) {
                    $o_tag       = new Tag;
                    $o_tag->name = $tag;
                    $o_tag->save();
                    $tagids[]    = $o_tag->id;
                }
            }
            $o_article->tags()->sync($tagids);
        }

        //分类处理
        if ($cids = Input::get('categories')) {
            $cids = is_array($cids) ? array_unique($cids) : array($cids);
//            $exist_cs = Category::where('type', 'subject')
//                            ->whereIn('id', $cids)->get();
//            $cids = $exist_cs->lists('id');
            $o_article->categories()->sync($cids);
        }
        //应用处理
        if ($appids = Input::get('apps')) {
            $appids = is_array($appids) ? $appids : array($appids);
//            $exist_apps = Application::whereIn('id', $appids)->get();
//
//            $appids = $exist_apps->lists('id');
            $o_article->apps()->sync($appids);
        }

        // 商品处理
        if ($productids = Input::get('products')) {
            $productids = is_array($productids) ? $productids : array($productids);
            $o_article->products()->sync($productids);
        }

        if ($o_article->getDirty()) {
            $o_article->modified = time();
        }
        $o_article->push();
        return [
            'success' => true,
            'msg'     => 'success',
            'errCode' => 0
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        //找到该文章
        $o_article = Article::withCate()
                ->with('tags')
                ->with(array('apps' => function($query) {
                    $query->with('icon');
                }))
                ->with(array('products' => function($query) {
                    $query->with('cover');
                }))
                ->find($id);
        if (is_null($o_article) || $o_article->status == Article::S_INIT) {
            return array('errCode' => 1, 'msg' => '文章不存在。');
        }

        //动态设置隐藏域
        $o_article->setHidden([]);

        $o_article->banner_url = $o_article->banner_url();
        return $o_article;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id) {
//
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id) {
        if (Input::has('ids')) {
            $ids   = Input::get('ids');
            $ids   = is_array($ids) ? $ids : [$ids];
            $count = 0;
            switch ($id) {
                case 'publish':
                    $count = $this->changeStatus($ids, Article::S_PUBLISHED);
                    break;
                case 'refuse':
                    $count = $this->changeStatus($ids, Article::S_REFUSE);
                    break;
                case 'pending':
                    $count = $this->changeStatus($ids, Article::S_PENDING);
                    break;
                case 'delete':
                    $count = $this->changeStatus($ids, Article::S_RECYCLE);
                    break;
                default:
                    break;
            }
            $require = count($ids);
            return [
                'success' => true,
                'msg'     => "request {$require} ,deal {$count}.",
                'errCode' => 0,
            ];
        }
        return array(
            'msg'     => "require ids.",
            'errCode' => 1,
        );
    }

    function changeStatus($ids, $status) {
        $i = 0;
        foreach ($ids as $id) {
            $c = Article::find($id);
            if ($c) {
                if ($status == -99 && $c->status == -99) {
                    $c->delete();
                } else {
                    $c->status = $status;
                    $c->save();
                }
                $i++;
            }
        }
        return $i;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $article = Article::find($id);

        if (is_null($article)) {
            return array(
                'msg'     => "文章不存在或已删除。",
                'errCode' => 3,
            );
        }
        if ($article->status == Article::S_RECYCLE) {
            $article->delete();
        } else {
            $article->status = Article::S_RECYCLE;
            $article->save();
        }
        return [
            'success' => true,
            'msg'     => "文章 id:$id 以删除。",
            'errCode' => 0,
        ];
    }

}
