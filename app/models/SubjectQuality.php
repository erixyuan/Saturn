<?php

class SubjectQuality extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'subject_quality';
    //关闭时间戳维护
    public $timestamps          = false;
    protected static $unguarded = true;

}
