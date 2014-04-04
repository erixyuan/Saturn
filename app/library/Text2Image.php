<?php

class Text2Image {

    private $text; //文本
    private $font_path; //字体路径
    private $font_size; //文字大小
    private $font_color; //文字颜色
    private $width; //宽度
    private $padding; //填充
    private $background; //背景
    private $line_height; //行高
    private $img_path; //输出路径
    private $default_config = array(
        'background'  => '#FFFFF',
        'font_color'  => '#000000',
        'font_size'   => 14,
        'width'       => 440,
        'padding'     => 10,
        'line_height' => 10
    );

    /**
     * 将 16 进制颜色值转换为 rgb 值
     *
     * @param string $color 颜色值
     * @param string $default 使用无效颜色值时返回的默认颜色
     *
     * @return array 由 RGB 三色组成的数组
     */
    static function hex2rgb($color, $default = 'ffffff') {
        $hex = trim($color, '#&Hh');
        $len = strlen($hex);
        if ($len == 3) {
            $hex = "{$hex[0]}{$hex[0]}{$hex[1]}{$hex[1]}{$hex[2]}{$hex[2]}";
        } elseif ($len < 6) {
            $hex = $default;
        }
        $dec = hexdec($hex);
        return array(($dec >> 16) & 0xff, ($dec >> 8) & 0xff, $dec & 0xff);
    }

    function __construct($config) {

        $config     = array_merge($this->default_config, $config);
        //必须的输入
        $this->text = $config['text'];
        if (isset($config['img_path'])) {
            $this->img_path = $config['img_path'];
        }
        $this->font_path = $config['font_path'];

        //有默认值的输入
        $this->background  = $this->hex2rgb($config['background']);
        $this->font_color  = $this->hex2rgb($config['font_color']);
        $this->font_size   = $config['font_size'];
        $this->width       = $config['width'];
        $this->padding     = $config['padding'];
        $this->line_height = $config['line_height'];
    }

    function _string_chunk_to_array($string) {
        $limit  = $this->width - 2 * $this->padding;
        $result = array();
        $temp   = $string;
        while (1) {
            $box    = imageftbbox($this->font_size, 0, $this->font_path, $temp);
            $length = mb_strlen($temp, 'utf-8');
            if ($box[2] - $box[0] > $limit) {
                $temp = mb_substr($temp, 0, $length - 2, 'utf-8');
            } else {
                $result[]      = $temp;
                $string_length = mb_strlen($string, 'utf-8');
                $string        = mb_substr($string, $length, $string_length - 1, 'utf-8');
                $temp          = $string;
            }
            if ($string == '') {
                break;
            }
        }
        return $result;
    }

    function text2image($return_im = false, $transparent = false) {

        $background = $this->background;
        $font_color = $this->font_color;
        $box        = imageftbbox($this->font_size, 0, $this->font_path, '国');
        $h          = $box[1] - $box[7];

        //这是在分行
        $text     = array();
        $text_arr = explode(PHP_EOL, $this->text);
        foreach ($text_arr as $line) {
            $line = trim($line);
            if ($line != '') {
                $temp = $this->_string_chunk_to_array($line);
                array_push($temp, '');
                $text = array_merge($text, $temp);
            }
        }
        $height           = count($text) * ($h + $this->line_height); //+ 2 * $this->padding
        $im               = imagecreatetruecolor($this->width, $height);
        $background_color = imagecolorallocate($im, $background[0], $background[1], $background[2]);
        if ($transparent) {
            imagecolortransparent($im, $background_color);
        }
        imagefilledrectangle($im, 0, 0, $this->width, $height, $background_color);
        $text_color = imagecolorallocate($im, $font_color[0], $font_color[1], $font_color[2]);
        foreach ($text as $k => $v) {
            $y = $this->padding + ($h / 2) + $k * ($h + $this->line_height);
            imagefttext($im, $this->font_size, 0, $this->padding, $y, $text_color, $this->font_path, $v);
        }
        if (!$return_im) {
            imagepng($im, $this->img_path);
            imagedestroy($im);
        } else {
            return $im;
        }
    }

}
