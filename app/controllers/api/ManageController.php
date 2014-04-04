<?php

class ManageController extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    function themes() {
        $a_dir        = Config::get('view.paths');
        $theme_dir    = dir(array_pop($a_dir));
        $exist_themes = array();
        while (false !== ($file         = $theme_dir->read())) {
            if (trim($file, '.') && is_dir($theme_dir->path . '/' . $file)) {
                if (strtolower(substr($file, -4)) != '.bak') {
                    $exist_themes[] = $file;
                }
            }
        }
        return $exist_themes;
    }

    function templates() {
        //category,author,tag
        if (!$type = Input::get('type')) {
            return $this->msg('template need type', 1);
        }

        $a_dir     = Config::get('view.paths');
        $theme_dir = array_pop($a_dir);
        $theme     = Option::get('theme');

        $template_dir = $theme_dir . '/' . $theme . '/' . $type . '/template';
        $exist_themes = [];
        if (file_exists($template_dir) && is_dir($template_dir)) {
            $template_dir = dir($template_dir);
            while (false !== ($file         = $template_dir->read())) {
                if (!is_dir($template_dir->path . '/' . $file)) {
                    $exist_themes[] = str_replace('.blade.php', '', $file);
                }
            }
        }

        $data = array(
            'data' => $exist_themes
        );
        // return $exist_themes;
        return $data;

    }

    function cacheFlush() {
        Cache::flush();
        return $this->msg();
    }

    public function navs() {
        $navs = Config::get('managenav');
        if (!Auth::user()->can('manage_category')) {
            $this->_unsetModule($navs['article'], 'category');
            $this->_unsetModule($navs['application'], 'category');
        }
        if (!Auth::user()->can('manage_article')) {
            $this->_safeUnset($navs, 'article');
        }
        if (!Auth::user()->can('manage_app')) {
            $this->_safeUnset($navs, 'application');
        }
        if (!Auth::user()->can('manage_user')) {
        // $this->_safeUnset($navs, 'userManage');
        }
        if (!Auth::user()->can('manage_option')) {
            $this->_safeUnset($navs, 'set');
            $this->_safeUnset($navs, 'plugin');
        }

        return ['data' => $navs];
    }

    private function _safeUnset(&$a, $disable_tag) {
        if (isset($a[$disable_tag])) {
            unset($a[$disable_tag]);
        }
    }

    private function _unsetModule(&$a, $disable_tag) {
        if (is_array($a) && isset($a['child']) && is_array($a['child'])) {
            foreach ($a['child'] as $k => $a1) {
                if (isset($a1['module']) && $a1['module'] == $disable_tag) {
                    unset($a['child'][$k]);
                }
            }
        }
    }

    function initRole() {
        Role::create(['name' => 'Admin', 'display_name' => '管理员']);
        Role::create(['name' => 'Member', 'display_name' => '会员']);
        Role::create(['name' => 'Editor', 'display_name' => '编辑']);
        Role::create(['name' => 'Chief_Editor', 'display_name' => '主编']);
        Role::create(['name' => 'Author_Lv.1']);
        Role::create(['name' => 'Author_Lv.2']);
        Role::create(['name' => 'Author_Lv.3']);
        $users   = User::All();
        $roles   = Role::All();
        $a_roles = array_map('strtolower', $roles->lists('name', 'id'));
        foreach ($users as $u) {
            if (in_array(strtolower($u->roles), $a_roles)) {
                $key = array_search(strtolower($u->roles), $a_roles);
                $u->attachRole($roles->find($key));
            }
        }
        Schema::table('users', function($table) {
            $table->dropColumn('roles');
        });
        Permission::create(['name' => 'manage_article', 'display_name' => '管理文章']);
        Permission::create(['name' => 'publish_article', 'display_name' => '发布文章到首页']);
        Permission::create(['name' => 'submit_article', 'display_name' => '提交文章到待审']);
        Permission::create(['name' => 'delete_article', 'display_name' => '删除文章']);
        Permission::create(['name' => 'submit_others_article', 'display_name' => '编辑他人的文章']);

        Permission::create(['name' => 'manage_app', 'display_name' => '管理应用']);
        Permission::create(['name' => 'publish_app', 'display_name' => '发布应用到首页']);
        Permission::create(['name' => 'submit_app', 'display_name' => '提交应用到待审']);
        Permission::create(['name' => 'delete_app', 'display_name' => '删除应用']);
        Permission::create(['name' => 'submit_others_app', 'display_name' => '编辑他人的应用']);

        Permission::create(['name' => 'manage_category', 'display_name' => '管理分类']);
        Permission::create(['name' => 'submit_category', 'display_name' => '新建分类']);
        Permission::create(['name' => 'delete_category', 'display_name' => '删除分类']);

        Permission::create(['name' => 'manage_user', 'display_name' => '管理用户']);
        Permission::create(['name' => 'manage_role', 'display_name' => '管理角色']);

        Permission::create(['name' => 'manage_option', 'display_name' => '系统设置']);
        Permission::create(['name' => 'manage_attachment', 'display_name' => '附件管理']);
        Permission::create(['name' => 'upload_attachment', 'display_name' => '上传附件']);
        return $this->msg('完成权限初始化');
    }

}
