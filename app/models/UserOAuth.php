<?php

class UserOAuth extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table            = 'user_oauth';
    protected static $unguarded = true;

    public function user() {
        return $this->belongsTo('User');
    }

    //关闭时间戳维护
    public $timestamps = false;

}
