<?php

class Option extends Eloquent {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table      = 'options';
    protected $primaryKey = 'key';
    //关闭时间戳维护
    public $timestamps    = false;
    protected static $unguarded = true;

    static public function get($key) {
        if ($v = self::find($key)) {
            return $v->value;
        }
        return '';
    }

    static public function set($key, $value, $create = true) {
        if (!empty($key)) {
            if ($o = self::find($key)) {//null
                return $o->update(array('value' => $value));
            } else {
                if ($create) {
                    return Option::create(array('key' => $key, 'value' => $value));
                }
            }
        }
    }

    public function getValueAttribute($value) {
        return unserialize($value);
    }

    public function setValueAttribute($value) {
        $this->attributes['value'] = serialize($value);
    }

}
