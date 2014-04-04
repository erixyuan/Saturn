<?php

class helper {

    static function time_tran_day($post_time){
        $now_time = time();
        $dur = $now_time - $post_time;

        if($dur < 86400){//3天内
            return  '今天';
        }else {
           return floor($dur/86400).'天前';
        }

    }





    /**
     * 清除XSS
     *
     * @param  $key 字符
     * @param  $low 过滤等级,true为低
     * @return mixed
     */
    static function clean_xss(&$string, $low = False) {
        if (!is_array($string)) {
            $string = trim($string);
            $string = strip_tags($string);
            $string = htmlspecialchars($string);
            if ($low) {
                return True;
            }
            $string = str_replace(array('"', "\\", "'", "/", "..", "../", "./", "//"), '', $string);
            $no     = '/%0[0-8bcef]/';
            $string = preg_replace($no, '', $string);
            $no     = '/%1[0-9a-f]/';
            $string = preg_replace($no, '', $string);
            $no     = '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/S';
            $string = preg_replace($no, '', $string);
            return True;
        }
        $keys = array_keys($string);
        foreach ($keys as $key) {
            clean_xss($string [$key]);
        }
    }

    /**
     *  创建多级目录
     *
     *
     *  @access public
     *  @return void
     */
    static function mkdirs($dir) {
        if (!is_dir($dir)) {
            if (!self::mkdirs(dirname($dir))) {
                return false;
            }
            if (!mkdir($dir, 0755)) {
                return false;
            }
        }
        return true;
    }






    /**
     *  获取扩展名
     *
     *  最科学的获取扩展名的方法
     *
     *  @access public
     *  @return void
     */
    static function getExtension($file) {
        $tempfile = @fopen($file, "rb");
        $bin      = fread($tempfile, 2); //只读2字节
        fclose($tempfile);
        $strInfo  = @unpack("C2chars", $bin);
        $typeCode = intval($strInfo['chars1'] . $strInfo['chars2']);
        $fileType = '';
        switch ($typeCode) {
            // 6677:bmp 255216:jpg 7173:gif 13780:png 7790:exe 8297:rar 8075:zip tar:109121 7z:55122 gz 31139
            // 6677:bmp 255216:jpg 7173:gif 13780:png 7790:exe 8297:rar 8075:zip tar:109121 7z:55122 gz 31139
            //
            // 7173 gif
            // 255216 jpg
            // 7790 exe dll
            // 00 ani--ico--cur
            // 7783
            // 255254 --ini
            // 9146 -- ini
            // 5866
            // 6395 hlp
            // 8269 reg
            // 70105 log
            // 205168
            // 7384 chm
            // 5549 txt
            // 117115 txt
            // 5450 txt
            // 5666 psd
            // 255254 rdp
            // 10056 bt种子
            // 8297 rar
            // 64101 bat
            //
            // JPG = 255216,
            // GIF = 7173,
            // BMP = 6677,
            // PNG = 13780,
            // SWF = 6787,
            // RAR = 8297,
            // ZIP = 8075,
            // _7Z = 55122,
            // TXT = 102100,
            // PDF = 3780,
            // DOC = 208207,
            // XLSX = 8075,
            // XLS = 207208,
            // CHM = 7384
            // XML = 6063,
            // HTML = 6033,
            // ASPX = 239187,
            // CS = 117115,
            // JS = 119105,
            // SQL = 255254,
            //

            // /*文件扩展名说明
            // *6063        xml
            // *01          accdb,mdb
            // *5666        psd
            // *4545 sql
            // *8075 xlsx, pptx, docx
            // *8389 txt
            // *239187 cshtml
            // *8483 csv
            // *6037 asp, aspx
            // *7173        gif
            // *255216      jpg
            // *13780       png
            // *6677        bmp
            // *208207      xls.doc.ppt
            // *6033        htm,html
            // *7790        exe,dll
            // *4742        js
            // */
            // xml = 6063,
            // accdb = 01,
            // mdb = 01,
            // sql = 4545,
            // xlsx = 8075,
            // pptx = 8075,
            // docx = 8075,
            // txt = 8389,
            // cshtml = 239187,
            // csv = 8483,
            // asp = 6037,
            // aspx = 6037,
            // gif = 7173,
            // jpg = 255216,
            // png = 13780,
            // bmp = 6677,
            // xls = 208207,
            // doc = 208207,
            // ppt = 208207,
            // htm = 6033,
            // html = 6033,
            // exe = 7790,
            // dll = 7790,
            // js = 4742,
            // zip = 8075,
            // rar = 8297,
            // sgp = 00, //3gp
            // mp4 = 00,
            // avi = 8273,
            // wmv = 4838
            case '255216':
                $fileType = 'jpg';
                break;
            case '7173':
                $fileType = 'gif';
                break;
            case '13780':
                $fileType = 'png';
                break;
            case '8075':
                $fileType = 'apk';
                break;
            case '00':
                $fileType = 'mp4';
                break;
            // case '8297':
            //     $fileType = 'rar';
            //     break;
            // case '8075':
            //     $fileType = 'zip';
            // break;
            default:
        }
        return $fileType;
    }

    static function themes() {
        $a_dir        = Config::get('view.paths');
        $theme_dir    = dir(array_pop($a_dir));
        $exist_themes = array();
        while (false !== ($file         = $theme_dir->read())) {
            if (trim($file, '.') && is_dir($theme_dir->path . '/' . $file)) {
                if (strtolower(substr($file, -7)) != '_mobile' && strtolower(substr($file, -4)) != '.bak') {
                    $exist_themes[] = $file;
                }
            }
        }
        return $exist_themes;
    }

}
