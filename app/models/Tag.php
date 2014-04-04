<?php

class Tag extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table            = 'tags';
    protected static $unguarded = true;
    //关闭时间戳维护
    public $timestamps          = false;

    static public function get($name) {
        $tag = self::where('name', $name)->get();
        return is_null($tag) ? false : $tag;
    }

    function url() {
        return URL::to('tag/' . $this->name);
    }

    public function articles() {
        return $this->belongsToMany('Article', 're_subjects_tags', 'tag_id', 'object_id');
    }

}
