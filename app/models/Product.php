<?php

class Product extends Eloquent {

    // 商品部分不知道ORM能不能對應上來，先拋API，待後臺調試後修改。 SolidZORO 2014-03-17

    //商品状态
    const S_PUBLISHED = 1; //发布
    const S_INIT      = 0;  //初始化
    const S_DRAFT     = -1;  //草稿
    const S_PENDING   = -2; //待审核
    const S_REFUSE    = -3; //拒绝
    const S_RECYCLE   = -99; //删除

    protected $table = 'products';
    protected static $unguarded = true;
    // protected $hidden  = ['name_en', 'name_cn', 'name_package', 'views', 'comments', 'description', 'published', 'hidden'];

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
                $query->where('type', Category::T_PRODUCT);
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

    //封面::一对一
    public function cover() {
        return $this->hasOne('Attachment', 'id', 'cover_id');
    }

    public function user() {
        return $this->belongsTo('User');
    }

    //市场信息::一对多
    public function productLinks() {
        return $this->hasMany('ProductLink');
    }

    //评论::一对多
    public function comments() {
        return $this->hasMany('Comment');
    }

    //分类::多对多
    public function categories() {
        return $this->belongsToMany('Category', 're_products_categories', 'product_id', 'category_id');
    }

    //tag::多对多
    public function tags() {
        return $this->belongsToMany('Tag', 're_products_tags', 'product_id', 'tag_id');
    }

    //文章::多对多
    public function articles() {
        return $this->belongsToMany('Article', 're_subjects_products', 'product_id', 'subject_id');
    }

}
