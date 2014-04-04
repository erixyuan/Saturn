<?php

class Category extends Eloquent {

    //分类类型
    const T_ARTICLE = 'subject'; //文章
    const T_APP     = 'application';  //应用
    const T_PRODUCT     = 'product';  //应用
    //分类状态
    const S_INDEX   = 1;  //允许在首页
    const S_NOINDEX = 0;  //允许在首页

    /**
     * The database table used by the model.
     *
     * @var string
     */

    protected static $unguarded = true;
    protected $table            = 'categories';
    //关闭时间戳维护
    public $timestamps          = false;

    public function articles() {
        return $this->belongsToMany('Article', 're_subjects_categories', 'category_id', 'subject_id');
    }

    public function apps() {
        return $this->belongsToMany('Application', 're_applications_categories', 'category_id', 'app_id');
    }

    public function scopeType($query, $type) {
        switch (strtolower($type)) {
            case self::T_APP:
                return $query->where('type', self::T_APP);
            case self::T_ARTICLE:
                return $query->where('type', self::T_ARTICLE);
            default:
                return $query;
        }
    }

    public function scopeIndex($query) {
        return $query->where('status', self::S_INDEX);
    }
    public function scopeFather($query) {
        return $query->where('parent_id', self::S_NOINDEX);
    }

    function url() {
        return URL::to('category/' . $this->slug);
    }

}
