<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;
use Zizaco\Entrust\HasRole;

class User extends Eloquent implements UserInterface, RemindableInterface {

    //使用角色
    use HasRole;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = array('password');

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier() {
        return $this->getKey();
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword() {
        return $this->password;
    }

    /**
     * Get the e-mail address where password reminders are sent.
     *
     * @return string
     */
    public function getReminderEmail() {
        return $this->email;
    }

    public function metas() {
        return $this->hasOne('UserMeta');
    }
    public function userOAuth() {
        return $this->hasOne('UserOAuth');
    }

    public function avatar() {
        return $this->hasOne('Attachment', 'id', 'avatar_id');
    }

//    public function avator() {
//        return $this->hasOne('UserMeta');
//    }
    //关闭时间戳维护
    public $timestamps          = false;
    protected static $unguarded = true;

    public function articles() {
        return $this->hasMany('Article', 'user_id', 'id');
    }

    public function setPasswordAttribute($value) {
        if ($value) {
            $this->attributes['password'] = md5($value);
        } else {
            $this->attributes['password'] = '';
        }
    }

}
