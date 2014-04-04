<?php

class Article extends Eloquent {

    //文章状态
    const S_PUBLISHED              = 1; //发布
    const S_PAGE                   = 2;  //已发布的页面
    const S_INIT                   = 0;  //初始化
    const S_DRAFT                  = -1;  //草稿
    const S_PENDING                = -2; //待审核
    const S_REFUSE                 = -3; //拒绝
    const S_CONTRIBUTION_ANONYMOUS = -11; //匿名来稿
    const S_CONTRIBUTION_FAMOUS    = -12; //非匿名来稿
    const S_RECYCLE                = -99; //回收站

    protected $table            = 'subjects';
    //这个酷炫的数组声明只能在php5.4+
    //json输出时隐藏的字段
    protected $hidden           = ['slug', 'content', 'banner_id', 'banner_wmp', 'template', 'content_wmp', 'banner'];
    //允许集体赋值
    protected static $unguarded = true;

    /*     * ******************************************************************
     *
     * 时间戳维护
     *
     * ************************************************************************
     */
    //关闭时间戳维护
    public $timestamps = false;

    //禁用日期调整
    public function getDates() {
        return array();
    }

    //筛选类型为投稿
    //使用方法为$a->contribution()
    public function scopeContribution($query) {
        return $query->whereRaw('status < ? AND status > ?', [-10, -20]);
    }

    //包含分类
    //使用方法为$a->withCate()
    //因为关联表不独立,所以为了防止抓到分类类型是app的,过滤一下
    public function scopeWithCate($query) {
        return $query->with(array('categories' => function($query) {
                $query->where('type', Category::T_ARTICLE);
            }));
    }

    public function scopeWithComment($query) {
        return $query->with(array('comments' => function($query) {
                $query->where('object_type', Comment::T_ARTICLE);
            }));
    }

    //筛选类型为状态
    //使用方法为$a->status($status)
    public function scopeStatus($query, $status) {
        switch (strtolower($status)) {
            case 'draft':
                return $query->where('status', self::S_DRAFT);
            case 'pending':
                return $query->where('status', self::S_PENDING);
            case 'refuse':
                return $query->where('status', self::S_REFUSE);
            case 'all':
                return $query->where('status', '<>', self::S_INIT);
            case 'page':
                return $query->where('status', self::S_PAGE);
            case 'recycle':
                return $query->where('status', self::S_RECYCLE);
            case 'contribution':
                return $query->contribution();
            default:
                return $query->where('status', self::S_PUBLISHED);
        }
    }

    //评论::一对多
    public function comments() {
        return $this->hasMany('Comment', 'object_id', 'id');
    }

    //题图::一对一
    public function banner() {
        return $this->hasOne('Attachment', 'id', 'banner_id');
    }

    //发表者::一对一
    public function user() {
        return $this->hasOne('User', 'id', 'user_id');
    }

    //文章绩效::一对一
    public function quality() {
        return $this->hasOne('SubjectQuality', 'subject_id', 'id');
    }

    //分类::多对多
    public function categories() {
        return $this->belongsToMany('Category', 're_subjects_categories', 'subject_id', 'category_id');
    }

    //tag::多对多
    public function tags() {
        return $this->belongsToMany('Tag', 're_subjects_tags', 'subject_id', 'tag_id');
    }

    //应用::多对多
    public function apps() {
        return $this->belongsToMany('Application', 're_subjects_applications', 'subject_id', 'application_id');
    }

    //应用::多对多
    public function products() {
        return $this->belongsToMany('Product', 're_subjects_products', 'subject_id', 'product_id');
    }

    public static $rules = [];

    function GetRelatedPosts() {
        if (!$this->tags->isEmpty()) {
            $T_R_A = $this->tags->first()->articles->sortByDesc(function($a) {
                        return $a->published;
                    })->take(5);
        }
        if (!$this->categories->isEmpty()) {

            $C_R_A = $this->categories->first()->articles->sortByDesc(function($a) {
                        return $a->published;
                    })->take(5);
        }
        $result = [];
        for ($i = 0; $i < 4; $i++) {
            $result[] = $T_R_A->shift();
            $result[] = $C_R_A->shift();
        }
        return $result;
    }

    //文章url
    function url() {
        if (!empty($this->slug)) {
            return URL::to($this->slug);
        }
        return URL::to($this->id);
    }

    //文章url
    function next() {
        $try = Article::where('published', $this->published)
                ->status(Article::S_PUBLISHED)
                ->where('id', '<', $this->id)
                ->first();
        if (!$try) {
            $try = Article::where('published', '>', $this->published)
                    ->status(Article::S_PUBLISHED)
                    ->where('id', '<>', $this->id)
                    ->orderBy('published', 'asc')
                    ->first();
        }
        return $try;
    }

    function previous() {
        $try = Article::where('published', $this->published)
                ->status(Article::S_PUBLISHED)
                ->where('id', '>', $this->id)
                ->first();
        if (!$try) {
            $try = Article::where('published', '<', $this->published)
                    ->status(Article::S_PUBLISHED)
                    ->where('id', '<>', $this->id)
                    ->orderBy('published', 'desc')
                    ->first();
        }
        return $try;
    }

    //获取banner的图片地址,有指定参数即为缩略图路径
    function banner_url($arg = null) {
        //1 banner_id有值
        if ($this->banner_id) {
            //2 找得到对应附件
            if ($this->banner) {
                //3 对应文件存在
                $path = $this->banner->origin_path();
                //4 是合法图片
                if ($this->banner->isPic($path)) {
                    //输出
                    if (!empty($arg)) {
                        $path = $this->banner->thumbnail_path($arg);
                    }
                    return asset($path);
                }
            }
        }
        return '';
    }

    //输出文章的分页信息
    //用的是分隔符正则截断
    //感觉会不会有点烦?
    function pageinfo($current) {
        $c = $this->content;
        if ($current && strpos($this->content, $this->page_break_tag) !== false) {
            $page_pattern = '/<!--##page_break_tag##((?!##page_break_tag##).)*##page_break_tag##-->/i';

            $content_parts = preg_split($page_pattern, $c);
            foreach ($content_parts as $k => $c_part) {
                if (strlen(trim($c_part)) < 1) {
                    unset($content_parts[$k]);
                }
            }
            $total = count($content_parts);
            return array(
                'total'   => $total,
                'first'   => 1,
                'prev'    => $current - 1 < 1 ? NULL : $current - 1,
                'current' => $current,
                'next'    => $current + 1 > $total ? NULL : $current + 1,
                'last'    => $total,
            );
        }
        return null;
    }

    private $page_break_tag = '##page_break_tag##';

    function getContent($args) {
        $c = $this->content;
        if (strlen($c) < 2) {
            return $c;
        }

        //对分页进行处理
        if (isset($args['page'])) {
            if (!$args['page'] && $this->pageinfo(1)) {
                $args['page'] = 1;
            }

            $page_pattern = '/<!--##page_break_tag##((?!##page_break_tag##).)*##page_break_tag##-->/i';

            $content_parts = preg_split($page_pattern, $c);

            foreach ($content_parts as $k => $c_part) {
                if (strlen(trim($c_part)) < 1) {
                    unset($content_parts[$k]);
                }
            }
            $content_parts = array_values($content_parts);

            if (isset($content_parts[$args['page'] - 1])) {
                $c = $content_parts[$args['page'] - 1];
            }
        }

        //原图=>缩略图
        if (isset($args['img_args'])) {
            $c = $this->origin2thumbnail($c, $args['img_args']);
        }

        //video标签
        if (strpos($c, '[video]') !== false) {
            $c = $this->videoConven($c);
        }
        return $c;
    }

    //原图=>缩略图
    function origin2thumbnail($content, $arg) {
        $dom = new Htmldom($content);
        foreach ($dom->find('img') as $img) {
            //抓原图id
            if (preg_match('([0-9]+(?=\.))', $img->src, $m)) {
                $a = Attachment::find($m[0]);

                if ($a && ($thumb_url = $a->thumbnail_path($arg))) {
                    $img->src = $thumb_url;
                }
            }
        }
        return $dom;
    }

    //过滤提交内容中的href为指定字符
    static function urlFilter($str, $replacement = '###') {
        $html = new Htmldom($str);

        foreach ($html->find('a') as $a) {
            $a->href = $replacement;
        }
        return $html;
    }

    //video标签
    function videoConven($c) {
        $video_pattern = '/(\[video\](.*)\[\/video\])/';
        $result        = array();
        $i             = 0;
        while (preg_match($video_pattern, $c, $result)) {

            $youku_id_pattern = '/id_([0-9a-z_]+)\.html/i';

            //在内容中匹配youku id
            $ids              = array();
            if (preg_match($youku_id_pattern, $result[0], $ids)) {
                $youku_id = $ids[1];
                if (Agent::isMobile() || Agent::isTablet()) {
                    $replacement = '<video id="youku-html5-player-video" width="300" height="225" '
                            . 'controls="" autoplay="" preload="" src="http://v.youku.com/player/getRealM3U8/vid/' . $youku_id . '/type/mp4/v.m3u8"></video>';
                } else {
                    $replacement = '<embed width="520" height="390" align="middle" '
                            . 'type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" quality="high" '
                            . 'allowfullscreen="true" src="http://player.youku.com/player.php/sid/' . $youku_id . '/v.swf">';
                }
                $c = str_replace($result[0], $replacement, $c);
            } else {
                break;
            }
            if ($i > 10) {
                break;
            }
            $i++;
        }
        return $c;
    }

}
