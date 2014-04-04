<?php

class Comment extends Eloquent {

    //分类类型
    const T_ARTICLE   = 'subject'; //文章
    const T_APP       = 'application';  //应用
    const S_RECYCLE   = -99; //回收站
    const S_INIT      = 0;       //初始化
    const S_REFUSE    = -1;    //拒绝
    const S_PUBLISHED = 1; //发布

    /**
     * The database table used by the model.
     *
     * @var string
     */

    protected $table            = 'comments';
    protected static $unguarded = true;
    //关闭时间戳维护
    public $timestamps          = false;

    public static function boot() {
        parent::boot();
        self::observe(new CommentObserver);
    }

    public function article() {
        return $this->belongsTo('Article', 'object_id');
    }

    //筛选类型为状态
    //使用方法为$a->status($status)
    public function scopeStatus($query, $status) {
        switch (strtolower($status)) {
            case 'refuse':
                return $query->where('status', self::S_REFUSE);
            case 'published':
                return $query->where('status', self::S_PUBLISHED);
            case 'pending':
                return $query->where('status', self::S_INIT);
            case 'recycle':
                return $query->where('status', self::S_RECYCLE);
            case 'all':
            default:
                return $query;
        }
    }

}

//评论观察者
class CommentObserver {

    //当保存或删除的时候更新评论数
    public function saved(Eloquent $model) {
        if ($model->object_type == 'subject') {
            $model->comments = Article::find($model->object_id)->comments()->where('status', Comment::S_PUBLISHED)->count();
        }
    }

    public function deleted(Eloquent $model) {
        if ($model->object_type == 'subject') {
            $model->comments = Article::find($model->object_id)->comments()->where('status', Comment::S_PUBLISHED)->count();
        }
    }

}
