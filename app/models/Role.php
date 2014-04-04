<?php

use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole {

    protected static $unguarded = true;
//关闭时间戳维护
    public $timestamps = false;
    protected $hidden  = ['perms'];

    /**
     * Checks if the user has a Role by its name
     * 
     * @param string $name Role name.
     *
     * @access public
     *
     * @return boolean
     */
    public function hasPermission($name) {
        foreach ($this->perms as $p) {
            if ($p->name == $name) {
                return true;
            }
        }

        return false;
    }

}
