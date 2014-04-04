<?php

class ManageOption extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    function index() {
        $options = Option::all()->lists('value', 'key');

        //js说::不能解析,这里转换
        if (!empty($options)) {
            $json_options = json_encode($options);
            $json_options = str_replace('::', '__', $json_options);
            $options      = json_decode($json_options, 1);
        }
        return $options;
    }

    function show($id) {
        if (strpos($id, '__') !== false) {
            $id = str_replace('__', '::', $id);
        }
        if ('application::platform' == $id) {
            return [
                'data'    => explode('|', Option::get($id)),
                'errCode' => 0
            ];
        }
        if ('product::platform' == $id) {
            return [
                'data'    => explode('|', Option::get($id)),
                'errCode' => 0
            ];
        }
        return Option::get($id);
    }

    function store() {
        $options = Input::get();
        if (is_array($options) && !empty($options)) {
            foreach ($options as $k => $v) {
                if (strpos($k, '__') !== false) {
                    $k = str_replace('__', '::', $k);
                }
                //不新增键值
                Option::set($k, $v, 0);
                continue;
            }
            return [
                'success' => true,
                'errCode' => 0
            ];
        }
        return [
            'msg'     => 'illegal type or empty array',
            'errCode' => 1
        ];
    }

}
