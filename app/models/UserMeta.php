<?php

class UserMeta extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table            = 'user_metas';
    protected static $unguarded = true;

    public function user() {
        return $this->belongsTo('User');
    }

    //关闭时间戳维护
    public $timestamps = false;

}
