<?php

use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission {

    protected static $unguarded = true;
//关闭时间戳维护
    public $timestamps          = false;

}
