<?php

class ManagePlugin extends BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    function getIndex() {
        $temp              = [];
        $plugins           = Option::get('plugin::installed');
        $plugins_activated = Option::get('plugin::activated');
        foreach ($plugins as $k => $p) {
            $temp[$k] = [
                'name'      => $p,
                'installed' => true,
            ];
            if (in_array($p, $plugins_activated)) {
                $temp[$k]['activated'] = true;
            } else {
                $temp[$k]['activated'] = false;
            }
        }
        return $temp;
    }

    function getChangweibo() {
        $config = Option::get('changweibo::setting');
        if (!$config) {
            $c = new changweibo(1);
            Option::set('changweibo::setting', $c->getConfig());
        } else {
            return $config;
        }
        return $this->getChangweibo();
    }

    function postChangweibo() {
        $inputs = Input::get();
        if (is_array($inputs)) {
            Option::set('changweibo::setting', $inputs);
        }
        return [
            'success' => true,
            'errCode' => 0
        ];
    }

    function getUcenter() {
        $options = Option::all()->lists('value', 'key');

        if (!empty($options)) {
            $json_options = json_encode($options);
            $json_options = str_replace('::', '__', $json_options);
            $options      = json_decode($json_options, 1);
        }
        foreach ($options as $k => $o) {
            if (strpos($k, 'ucenter') === false) {
                unset($options[$k]);
            }
        }
        if (!$options) {
            $ucenter_config = json_decode(
                    '{"ucenter::uc_api":"","ucenter::uc_key":"","ucenter::uc_charset":"utf-8","ucenter::uc_appid":"utf-8","ucenter::login_page":""}', 1);
            foreach ($ucenter_config as $k => $v) {
                Option::set($k, $v);
            }
        } else {
            return $options;
        }
        return $this->getUcenter();
    }

    function postUcenter() {
        
    }

}
