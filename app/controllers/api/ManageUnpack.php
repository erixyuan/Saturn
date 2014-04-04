<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ManageUnpack extends BaseController {

    //解包apk文件
    //上传文件
    public function postIndex() {
        $apkpath = '';
        if (Input::hasFile('apk')) {
            $file = Input::file('apk');
            $ext  = helper::getExtension($file->getRealPath());
            if ($ext !== 'apk') {
                return $this->returnScript(false, 'only apk allowed.', 1);
            }

            //临时目录?
            $filename = uniqid() . '.apk';
            if ($file->move('file/apk', $filename)) {
                $apkpath = 'file/apk/' . $filename;
            }
        }
        return $this->appinfo($apkpath);
    }

    public function getIndex() {
        $apkpath = '';
        if ($url     = Input::get('url')) {
            $url = strtolower($url);
            if ('appchina' === $url) {
                $apkpath = $this->fromAppchina($url);
            } elseif ('coolapk' === $url) {
                $apkpath = $this->fromCoolapk($url);
            }
        }
        return $this->appinfo($apkpath);
    }

    function appinfo($apkpath) {
        if (!$apkpath && !file_exists($apkpath)) {
            return $this->returnScript(false, '获取不到APK包', 2);
        }
        if (!Input::has('appid')) {
            return $this->returnScript(false, '提供appid', 3);
        }

        $apkinfo = $this->unpack($apkpath, Input::get('appid', 0));

        if (Input::has('downloadapk') && isset($apkinfo['packageName'])) {
            $folder  = explode('.', $apkinfo['packageName'][0]);
            array_pop($folder);
            $folder  = implode('/', $folder);
            $newpath = 'apk/' . $folder . '/' . $apkinfo['packageName'][0] . '.apk';

            helper::mkdirs('apk/' . $folder);
            rename($apkpath, $newpath);

            $apkinfo['realurl'] = asset($newpath);
        } else {
            unlink($apkpath);
        }
        return $apkinfo;
    }

    function fromAppchina($url) {
        $curl = new Curl;
        $html = $curl->simple_get($url);

        $html = new Htmldom($html);
        $btn  = $html->find("#blue_widen", 0);

        $url = 'http://m.appchina.com' . $btn->href;

        if ($content = with(new Curl)->simple_get($url)) {
            $id   = uniqid();
            helper::mkdirs('file/apk');
            $path = "file/apk/{$id}.apk";
            if (file_put_contents($path, $content)) {
                return $path;
            }
        }
        return false;
    }

    function fromCoolapk($url) {
        if (strpos($url, 'www.coolapk.com') !== false) {
            $url = str_replace('www.coolapk.com', 'm.coolapk.com', $url);
        } else {
            $url = str_replace('coolapk.com', 'm.coolapk.com', $url);
        }

        $curl = new Curl;
        $html = $curl->simple_get($url);

        $html = new Htmldom($html);
        $btn  = $html->find(".install .installButton", 0);

        $url     = 'http://m.coolapk.com' . $btn->href;
        if ($content = with(new Curl)->simple_get($url)) {
            $id   = uniqid();
            helper::mkdirs('file/apk');
            $path = "file/apk/{$id}.apk";
            if (file_put_contents($path, $content)) {
                return $path;
            }
        }
        return false;
    }

    function unpack($apk, $appid = 0) {
        $cmd    = public_path('bin/aapt').' d badging ' . $apk;
        $result = exec($cmd, $out, $status);

        $params = array();

        if (!$status) {
            $patterns = array(
                'packageName'            => "/package: name='([^']*)'/i",
                'versionCode'            => "/versionCode='([^']*)'/i",
                'versionName'            => "/versionName='([^']*)'/i",
                'sdkVersion'             => "/^sdkVersion:'([^']*)'/i",
                'targetSdkVersion'       => "/targetSdkVersion:'([^']*)'/i",
                'usesPermission'         => "/uses-permission:'([^']*)'/i",
                'applicationLabel_zh_cn' => "/application-label-zh_CN:'([^']*)'/i",
                'applicationLabel_zh_hk' => "/application-label-zh_HK:'([^']*)'/i",
                'applicationLabel_zh_tw' => "/application-label-zh_TW:'([^']*)'/i",
                'applicationLabel_en'    => "/application-label-en:'([^']*)'/i",
                'applicationLabel'       => "/application-label:'([^']*)'/i",
                'applicationIcon'        => "/application-icon-[0-9]+:'([^']*)'/i",
            );
            foreach ($out as $line) {
                foreach ($patterns as $param_name => $pattern) {
                    if (preg_match($pattern, $line, $result)) {
                        if (!isset($params[$param_name]))
                            $params[$param_name]   = array();
                        $params[$param_name][] = $result[1];
                    }
                }
            }

            $zip        = zip_open($apk);
            $large_icon = end($params['applicationIcon']);
            while ($file       = zip_read($zip)) {
                $filepath = zip_entry_name($file);
                //if( in_array($filepath, $params['applicationIcon']) )
                if ($filepath == $large_icon) {
                    $filesize = zip_entry_filesize($file);
                    zip_entry_open($zip, $file); //打开文件
                    $filename = pathinfo($filepath, PATHINFO_BASENAME);
                    $fileext  = pathinfo($filepath, PATHINFO_EXTENSION);
                    $filedata = zip_entry_read($file, $filesize);
                    zip_entry_close($file);   //关闭文件
//                    helper::mkdirs('file/icon');
//                    $icon_path = 'apk/icon/' . $params['packageName'][0] . ".{$fileext}";
//                    file_put_contents($icon_path, $filedata);

                    break;
                }
            }

            if ($appid && isset($filedata)) {

                $attachment = Attachment::create(array(
                            'user_id'         => Auth::user()->id,
                            'object_id'       => $appid,
                            'object_type'     => 'application',
                            'object_relation' => 'icon',
                            'created'         => time(),
                ));

                $fileName        = $attachment->id . '.' . $fileext;
                $destinationPath = Attachment::PATH_ORIGIN . date('Y/m/d', time());
                helper::mkdirs($destinationPath);

                if (file_put_contents($destinationPath . '/' . $fileName, $filedata)) {
                    $attachment->fill(
                            array(
                                'path'      => date('Y/m/d', time()) . '/' . $fileName,
                                'filename'  => $filename,
                                'extension' => $fileext,
                                'filesize'  => filesize($destinationPath . '/' . $fileName),
                            )
                    );
                    $attachment->save();
                    $params['icon_id']  = $attachment->id;
                    $params['icon_url'] = $attachment->thumbnail_path(array('w' => 120, 'h' => 120));
                } else {
                    $attachment->delete();
                }
            }
        } else {
            return $this->returnScript(false, $result, $status);
        }
        $params['filesize'] = filesize($apk);


        return $this->returnScript(true, 'success', 0, $params);
    }

    function returnScript($success, $msg, $errCode, $data = null) {
        $back = json_encode([
            'success' => $success,
            'msg'     => $msg,
            'errCode' => $errCode,
            'data'    => $data
        ]);
        return <<<script
<script>
    window.parent.callback({$back});
</script>
script;
    }

}
