<?php

class Attachment extends Eloquent {

    //原图路径前缀
    const PATH_ORIGIN      = 'attachment/origin/';
    const PATH_THUMBNAIL   = 'attachment/thumbnail/';
    const FOLDER_ORIGIN    = 'origin';
    const FOLDER_THUMBNAIL = 'thumbnail';

    // 限制輸出，置空為都輸出
    // protected $visible          = [];
    protected $visible          = ['id', 'filename'];
    protected static $unguarded = true;
    //定义访问器,可以用于输出非字段的属性
    protected $appends          = ['origin_url', 'thumb_url'];

    public function getOriginUrlAttribute() {
        if ($this->origin_path()) {
            return asset($this->origin_path());
        }
        return '';
    }

    public function getThumbUrlAttribute() {
        if ($this->origin_path()) {
            return asset($this->thumb(['w' => 100, 'h' => 100, 'c' => 1]));
        }
        return '';
    }

    //对应表
    protected $table   = 'attachments';
    //关闭时间戳维护
    public $timestamps = false;

    public static function boot() {
        parent::boot();
        self::deleting(function($a) {
            if (file_exists($a->origin_path())) {
                unlink($a->origin_path());
            }
        });
        // 在这里使用事件绑定
    }

    public function isPic($path) {
        if (file_exists($path) && helper::getExtension($path)) {
            return true;
        }
        return false;
    }

    public function origin_path() {
        if ($this->isPic(self::PATH_ORIGIN . $this->path)) {
            return self::PATH_ORIGIN . $this->path;
        }
        return '';
    }

    public function watermark_path() {
        return self::PATH_ORIGIN . $this->path;
    }

    //可能有的args有w,h,wm,wmp
    //水印位置
    protected $wm_anchor = ['bottom-left', 'bottom', 'bottom-right', 'left', 'center', 'right', 'top-left', 'top', 'top-right'];

    public function thumb($args = []) {
        return $this->thumbnail_path($args);
    }

    public function thumbnail_path($args = array()) {
        //先根据生成规则找一下对应的缩略图
        if (!empty($args) && $this->isPic($this->origin_path())) {
            $thumb_path = substr($this->origin_path(), 0, strrpos($this->origin_path(), '/'));
            $thumb_path = str_replace(self::FOLDER_ORIGIN, self::FOLDER_THUMBNAIL, $thumb_path);

            helper::mkdirs($thumb_path);
            $thumb_path .= '/' . md5($this->id) . $this->argsToSuffix($args) . '.' . helper::getExtension($this->origin_path());

            if (!$this->isPic($thumb_path)) {
                $img = Image::make($this->origin_path());
                if (isset($args['mw']) && isset($args['mh']) && ($args['mh'] * $args['mw'] > 0)) {
                    if ($args['mw'] < $img->width && $args['mh'] < $img->height) {
                        $img->resize($args['mw'], $args['mh']);
                    }
                } elseif (isset($args['mw']) && $args['mw'] && $args['mw'] < $img->width) {
                    $img->resize($args['mw'], null, true);
                } elseif (isset($args['mh']) && $args['mh'] && $args['mh'] < $img->width) {
                    $img->resize(null, $args['mh'], true);
                }
                if (isset($args['w']) && isset($args['h']) && ($args['h'] * $args['w'] > 0)) {
                    if (isset($args['c']) && $args['c']) {
                        if (abs($img->width - $args['w']) > abs($img->height - $args['h'])) {
                            $img->resize(null, $args['h'], true);
                        } else {
                            $img->resize($args['w'], null, true);
                        }
                        $img->resizeCanvas($args['w'], $args['h'], 'center');
                    } else {
                        $img->resize($args['w'], $args['h']);
                    }
                } elseif (isset($args['w']) && $args['w']) {
                    $img->resize($args['w'], null, true);
                } elseif (isset($args['h']) && $args['h']) {
                    $img->resize(null, $args['h'], true);
                }
                //水印
                if (isset($args['wm']) && $args['wm']) {
                    $wm_path = Option::get('attachment::watermarks');
                    if (file_exists($wm_path)) {
                        if (isset($args['wmp']) && $args['wmp'] > 0) {
                            $img->insert($wm_path, 0, 0, $this->wm_anchor[$args['wmp'] - 1]);
                        } else {
                            $img->insert($wm_path, 0, 0, 'bottom-right');
                        }
                    }
                }
                $img->save($thumb_path);
            }

            return asset($thumb_path);
        }
        return '';
    }

    //把参数变成后缀
    public function argsToSuffix($args) {
        $suffix = array('');
        foreach ($args as $k => $v) {
            if (strlen($v)) {
                $suffix[] = "$k";
                $suffix[] = "$v";
            }
        }
        return implode('_', $suffix);
    }

}
