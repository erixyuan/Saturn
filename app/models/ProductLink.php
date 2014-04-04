<?php

class ProductLink extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table   = 'product_links';
    //关闭时间戳维护
    public $timestamps = false;

    protected static $unguarded = true;

    public function product() {
        return $this->belongsTo('Product', 'product_id');
    }

}
