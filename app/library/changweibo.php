<?php

/**
 * 长微博图片生成
 *
 * laravel的图片扩展插入文字不会自己分行的
 *
 * @author cheerchen <cheerchen37@gmail.com>
 * @copyright  Copyright (c) 2009-2013 Saturn_CMS
 *
 */
class changweibo {

    private $config = array(
        'font_file'        => 'file/font/FZLanTingHei-R.ttf',
        'font_size'        => 15,
        'font_color'       => '#000000',
        'font_line_height' => 15,
        'font_bold_file'   => 'file/font/FZLanTingHei-B.ttf',
        'font_bold_size'   => 18,
        'font_bold_color'  => '#000000',
        'font_title_file'  => 'file/font/FZLanTingHei-B.ttf',
        'font_title_size'  => 21,
        'font_title_color' => '#000000',
        'layout_pic_file'  => 'file/changweibo/banner_layout.png',
        'header_pic_file'  => 'file/changweibo/header.png',
        'footer_pic_file'  => 'file/changweibo/footer.png',
        'img_path'         => 'file/changweibo',
        'tmp_path'         => ''
    );
    private $fails;
    private $id;

    function getConfig() {
        unset($this->config['tmp_path']);
        return $this->config;
    }

    function fail() {
        if (isset($this->fails)) {
            return $this->fails;
        }
    }

    function __construct($id) {
        $this->id                 = $id;
        $this->config['tmp_path'] = storage_path('changweibo');
    }

    function init() {
        if (!($a = Article::find($this->id))) {
            $this->fails = 'article not exist';
            return false;
        }

        //这是为了生成长文需要不止30s
//        set_time_limit(0);
        //生成配置
        $user_config = Option::get('changweibo::setting');
        if (!empty($user_config)) {
            foreach ($user_config as $k => $c) {
                if (empty($c)) {
                    unset($user_config[$k]);
                }
            }
            $this->config = array_merge($this->config, $user_config);
        }

        //检查生成环境
        foreach ($this->config as $k => $v) {
            if (strpos($k, 'file') !== false) {
                if (!is_file($v)) {
                    $this->fails = 'lost font or layout file';
                    return false;
                }
            } else if (strpos($k, 'path') !== false) {
                if (!$this->mkdirs($v)) {
                    $this->fails = 'fail making dir';
                    return false;
                }
            }
        }

        $filename = 'file/changweibo/' . $a->id . '.png';
        if (!file_exists($filename)) {
            //dg生成拼图
            $this->changWeibo($a, $filename);
        }
        return $filename;
    }

    /**
     *  创建多级目录
     *
     *
     *  @access public
     *  @return void
     */
    function mkdirs($dir) {
        if (!is_dir($dir)) {
            if (!$this->mkdirs(dirname($dir))) {
                return false;
            }
            if (!mkdir($dir, 0777)) {
                return false;
            }
        }
        return true;
    }

    /**
     *  检测是不是本地,转换为文件路径
     *
     *  没有该图片就不生成
     *
     *  @access public
     *  @return void
     */
    function _checkPicValid($src) {
//        if (is_localhost()) {
//            $src = preg_replace('([^/]*/cms/)', '', $src);
//        }
        //没有图片的时候不生成
        if ($src) {
            if (strpos($src, 'http') !== false) {
                return $src;
            }
            if (is_file(asset($src))) {
                $src = asset($src);
                return $src;
            }
        }
        return null;
    }

    /**
     *  获取扩展名
     *
     *  最科学的获取扩展名的方法
     *
     *  @access public
     *  @return void
     */
    function __getExtension($file) {
        $tempfile = @fopen($file, "rb");
        $bin      = fread($tempfile, 2); //只读2字节
        fclose($tempfile);
        $strInfo  = @unpack("C2chars", $bin);
        $typeCode = intval($strInfo['chars1'] . $strInfo['chars2']);
        $fileType = '';
        switch ($typeCode) {
// 6677:bmp 255216:jpg 7173:gif 13780:png 7790:exe 8297:rar 8075:zip tar:109121 7z:55122 gz 31139
            case '255216':
                $fileType = 'jpg';
                break;
            case '7173':
                $fileType = 'gif';
                break;
            case '13780':
                $fileType = 'png';
                break;
            default:
                $fileType = 'unknown';
        }
        return $fileType;
    }

    /**
     *  创建图片句柄从文件
     *
     *  主要是识别扩展名
     *
     *  @access public
     *  @return void
     */
    function createFromFile($src) {
        $fileext       = $this->__getExtension($src);
        $ext2functions = array(
            'jpg'  => 'imagecreatefromjpeg',
            'jpeg' => 'imagecreatefromjpeg',
            'png'  => 'imagecreatefrompng',
            'gif'  => 'imagecreatefromgif'
        );
        if (isset($ext2functions[$fileext])) {
            $im = call_user_func($ext2functions[$fileext], $src);
            return $im;
        }
    }

    /**
     *  banner图与标题合成
     *
     *  加一层渐隐
     *  加标题
     *
     *  @access public
     *  @param string $banner_src banner缩略图地址
     *  @param string $title 标题文字
     *  @return resource gd图片资源
     */
    function mergeBanner($banner_src, $title) {

        //取出bannar的缩略图
        $banner_im = $this->createFromFile($banner_src);
        list($banner_width, $banner_height) = getimagesize($banner_src);

        if ($banner_width != 440) {
            $banner_width = 440;
        }

        //先取title以判断栏目的预留空
//        $title_img_path = $this->config['tmp_path'] . '/title_temp_' . md5($title) . '.png';

        $title_config = array(
            'text'        => $title,
//            'img_path'    => $title_img_path,
            'font_path'   => $this->config['font_title_file'],
            'font_size'   => $this->config['font_title_size'],
            'font_color'  => $this->config['font_title_color'],
            'line-height' => 0,
        );
        $text2img     = new Text2Image($title_config);
        $title_im     = $text2img->text2image($return_im    = 1, $transparent  = 1);
//        list($title_width, $title_height) = getimagesize($title_img_path);
        list($title_width, $title_height) = array(imagesx($title_im), imagesy($title_im));
        $dst_y        = $banner_height - $title_height;


        $canvas = imagecreatetruecolor($banner_width, $banner_height + $title_height - 35);

        //填成白色,这是为了填充预留的
        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $white);

        //把banner图印到画布上
        imagecopyresampled($canvas, $banner_im, 0, 0, 0, 0, $banner_width + 2, $banner_height, $banner_width, $banner_height);

        //把渐隐印到画布
        $layout_im = $this->createFromFile($this->config['layout_pic_file']);
        list($layout_width, $layout_height) = getimagesize($this->config['layout_pic_file']);

        //把渐隐印到画布
        imagecopyresampled($canvas, $layout_im, 0, 0, 0, 0, $banner_width, $banner_height, $layout_width, $layout_height);

        //这里如果用resampled会出现不透明,简直奇妙
        imagecopyresized($canvas, $title_im, 0, $dst_y + $title_height, 0, 0, $title_width, $title_height, $title_width, $title_height);
//        header("Content-type: image/png");
//        imagepng($canvas);
//
//        die;
        imagedestroy($banner_im);
        imagedestroy($title_im);
        imagedestroy($layout_im);
        return $canvas;
    }

    function delVideo($content) {
        if (strpos($content, '[video]') !== false) {
            $video_pattern = '/(\[video\](.*)\[\/video\])/';
            $result        = array();
            while (preg_match($video_pattern, $content, $result)) {
                $content = str_replace($result[0], '', $content);
            }
        }
        return $content;
    }

    /**
     *  长微博生成
     *
     *  包含3个步骤
     * 1.把html代码用simpledom遍历一遍
     * 2.按照type(text,h2,h3,img)给到text2img分别处理成同样宽度的图片
     * 3.把图片合成一个
     *
     *
     *  @param object $subject 文章信息
     *  @param string $img_path 输出的长微博的地址
     *  @access public
     *  @return void
     */
    function changWeibo($subject, $img_path = null) {

        $subject->content = $this->delVideo($subject->content);
        //做一个html遍历器
        $dom              = new Htmldom($subject->content);
        $list             = array();
        $prev_content     = '';
        $text_tags        = array('text');
        $h_tags           = array('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
        $inner_tags       = array('a', 'strong', 'span');
        $img_tags         = array('img');

        $banner_src = $this->_checkPicValid($subject->banner_url(array('w' => 440)));


        //如果banner图不存在
        if ($banner_src) {
            $list[] = array(
                'type'    => 'banner',
                'content' => $this->mergeBanner($banner_src, $subject->title)
            );
        }

        $list[] = array(
            'type'    => 'author',
            'content' => $subject->author . '   ' . date('Y-m-d H:i', $subject->created),
        );

        //文章引言
        // $list[] = array(
        //     'type'    => 'text',
        //     'content' => $subject->description
        // );

        foreach ($dom->nodes as $node) {
            //如果是子元素
            //再快一点
            $tag = $node->tag;
            if ($node->firstChild() == null) {

                $deal_as_text_tags = array_merge($text_tags, $h_tags, $inner_tags);
                if (in_array($tag, $deal_as_text_tags)) {
                    $content = trim($node->plaintext);
                } else if (in_array($tag, $img_tags)) {
                    $content = $this->_checkPicValid($node->src);
                } else {
                    continue;
                }
                if (!empty($content) && ($content != $prev_content)) {
                    $list[]       = array(
                        'type'    => $tag,
                        'content' => $content
                    );
                    $prev_content = $content;
                }
            }
        }
        //把a标签和strong标签与前后合并
        $this->dealWithInnerTags($list);

        //生成图片
        //这里耗时较长,在内存中操作
        //省去文件存取,从8s=>6s,效率提高33%

        $todo_list = array();

        $todo_list[] = $this->createFromFile($this->config['header_pic_file']);

        foreach ($list as $k => $todo) {

            $img_1_path = $this->config['tmp_path'] . '/' . $subject->id . '_' . $k . '.png';

            if ($todo['type'] == 'text') {
                $text_config = array(
                    'text'        => $todo['content'],
                    'img_path'    => $img_1_path,
                    'font_path'   => $this->config['font_file'],
                    'font_size'   => $this->config['font_size'],
                    'font_color'  => $this->config['font_color'],
                    'line-height' => 15
                );

                $text2img = new Text2Image($text_config);
                $im       = $text2img->text2image(1);
            } else if (in_array($todo['type'], $h_tags)) {
                // h1-h6文字樣式
                $h_config = array(
                    'text'        => $todo['content'],
                    'img_path'    => $img_1_path,
                    'font_path'   => $this->config['font_bold_file'],
                    'font_size'   => $this->config['font_bold_size'],
                    'font_color'  => $this->config['font_bold_color'],
                    'line-height' => 5
                );
                $text2img = new Text2Image($h_config);
                $im       = $text2img->text2image(1);
            } else if (in_array($todo['type'], $img_tags)) {

                $im = $this->resizePic($todo['content'], $img_1_path, 1);
            } else if ($todo['type'] == 'banner') {

                $im = $todo['content'];
            } else if ($todo['type'] == 'author') {

                // 頂部banner與文字之間的間距
                $author_config = array(
                    'text'        => $todo['content'],
                    'img_path'    => $img_1_path,
                    'font_path'   => $this->config['font_file'],
                    'font_size'   => 12,
                    'font_color'  => '#999999',
                    'line-height' => 15
                );

                $text2img = new Text2Image($author_config);
                $im       = $text2img->text2image(1);
            } else {
                continue;
            }
            $todo_list[] = $im;
        }

        $todo_list[] = $this->createFromFile($this->config['footer_pic_file']);
        $this->combine($todo_list, $img_path);
    }

    public function combine($ims, $img_path) {
        if (empty($ims)) {
            return;
        }
        $canvas = $this->createCanvas($ims);

        $desyY = 0;
        for ($i = 0; $i < count($ims); $i++) {

            $im        = $ims[$i];
            $srcHeight = imagesy($im);
            $srcWidth  = imagesx($im);

            // 计算当前原图片应该位于画布的哪个位置
            imagecopyresampled($canvas, $im, 0, $desyY, 0, 0, 440, $srcHeight, $srcWidth, $srcHeight);
            $desyY += $srcHeight;
        }

        imagepng($canvas, $img_path);
    }

    private function createCanvas($ims) {
        $totalImage   = count($ims);
        $width        = 440;
        $total_height = 0;
        for ($i = 0; $i < $totalImage; $i++) {
            $im        = $ims[$i];
            $srcHeight = imagesy($im);
            $total_height+=$srcHeight;
        }

        $canvas = imagecreatetruecolor($width, $total_height);

        // 使画布透明
        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $white);

        return $canvas;
    }

    /**
     *  处理长微博中的图片
     *
     *  将图片缩放至420*?其余留白
     *
     *  @param string $srcImage 源图像地址
     *  @param string $img_path 输出图像地址
     *  @access public
     *  @return void
     */
    function resizePic($srcImage, $img_path, $return_im = false) {
        $im          = $this->createFromFile($srcImage);
        $srcHeight   = imagesy($im);
        $srcWidth    = imagesx($im);
        //计算图像缩放尺寸
        $dest_width  = 420;
        $dest_height = $srcHeight * ($dest_width / $srcWidth);
        //创建画布
        $canvas      = imagecreatetruecolor(440, $dest_height + 40);
        //用白色填充
        $white       = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $white);
//        imagecolortransparent($canvas, $white);
        //把缩放的图片印到画布上
        imagecopyresampled($canvas, $im, 10, 0, 0, 0, $dest_width, $dest_height, $srcWidth, $srcHeight);
        if ($return_im) {
            return $canvas;
        }
        imagepng($canvas, $img_path);
    }

    /**
     *  处理文本中的a,strong标签
     *
     *  做法是把他们和前后文合并
     *  脑袋真是越来越不灵光了
     *
     *  @access public
     *  @return void
     */
    function dealWithInnerTags(&$list) {
        $inner_tags = array('a', 'strong', 'span');

        $change_flag = 0;
        while (list($key, $val) = each($list)) {
            if (in_array($val['type'], $inner_tags)) {
                $prev_key = $key - 1;
                $next_key = $key + 1;
                //&&后面的语句没机会被调用，被运算符“短路”了
                //如果前一个元素存在且为文本类型,合并到嵌套元素并删除前一个
                //
                if (isset($list[$prev_key]) && ($list[$prev_key]['type'] == 'text')) {
                    $list[$key]['content'] = $list[$prev_key]['content'] . $list[$key]['content'];
                    unset($list[$prev_key]);
                }
                if (isset($list[$next_key]) && ($list[$next_key]['type'] == 'text')) {
                    $list[$key]['content'] .= $list[$next_key]['content'];
                    unset($list[$next_key]);
                }
                $list[$key]['type'] = 'text';
                $list               = array_values($list);
                $change_flag        = 1;
                break;
            }
        }
        if ($change_flag == 1) {
            $this->dealWithInnerTags($list);
        } else {
            return;
        }
    }

}
