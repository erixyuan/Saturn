<?php

class Application extends Eloquent {

    //应用状态
    const S_PUBLISHED = 1; //发布
    const S_INIT      = 0;  //初始化
    const S_DRAFT     = -1;  //草稿
    const S_PENDING   = -2; //待审核
    const S_REFUSE    = -3; //拒绝
    const S_RECYCLE   = -99; //删除

    protected $table = 'applications';
    protected static $unguarded = true;
    protected $hidden  = ['name_en', 'name_cn', 'name_package', 'views', 'comments', 'description', 'published', 'hidden'];
    //关闭时间戳维护
    public $timestamps = false;

    //禁用日期调整
    public function getDates() {
        return array();
    }

    //包含分类
    //使用方法为$a->withCate()
    //因为关联表不独立,所以为了防止抓到分类类型是app的,过滤一下
    public function scopeWithCate($query) {
        return $query->with(array('categories' => function($query) {
                $query->where('type', Category::T_APP);
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
            case 'recycle':
                return $query->where('status', self::S_RECYCLE);
            case 'all':
                return $query->where('status', '<>', self::S_INIT);
            default:
                return $query->where('status', self::S_PUBLISHED);
        }
    }

    //图标::一对一
    public function icon() {
        return $this->hasOne('Attachment', 'id', 'icon_id');
    }
    public function user() {
        return $this->belongsTo('User');
    }

    //下载信息::一对多
    public function appinfos() {
        return $this->hasMany('Appinfo');
    }

    //评论::一对多
    public function comments() {
        return $this->hasMany('Comment');
    }

    //分类::多对多
    public function categories() {
        return $this->belongsToMany('Category', 're_applications_categories', 'app_id', 'category_id');
    }

    //tag::多对多
    public function tags() {
        return $this->belongsToMany('Tag', 're_applications_tags', 'app_id', 'tag_id');
    }

    //文章::多对多
    public function articles() {
        return $this->belongsToMany('Article', 're_subjects_applications', 'application_id', 'subject_id');
    }

}
