<?php

class Appkey extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table   = 'appkeys';
    //关闭时间戳维护
    public $timestamps = false;
    
    protected static $unguarded = true;

    public function getItemsAttribute($value) {
        return unserialize($value);
    }

    public function setItemsAttribute($value) {
        $this->attributes['items'] = serialize($value);
    }
}
