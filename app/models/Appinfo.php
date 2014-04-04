<?php

class Appinfo extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table   = 'application_downs';
    //关闭时间戳维护
    public $timestamps = false;

    protected static $unguarded = true;

    public function app() {
        return $this->belongsTo('Application', 'application_id');
    }

}
