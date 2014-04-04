<?php

/*
 * 文章同步模块
 * 
 */

class ManageSync extends \BaseController {

    private $_sites = [];

    const ARTICLE_API_URL_SUFFIX = '/api/post/';
    const APP_API_URL_SUFFIX     = '/api/application/';

    function __construct() {
        $sites = Option::get('cmssync::sites');
        if ($sites) {
            $sites = explode("\n", $sites);
            foreach ($sites as $site) {
                if (strlen($site) && strpos($site, '=>') !== false) {
                    list($site_name, $site_url) = explode('=>', $site);
                    $this->_sites[] = array(
                        'name' => $site_name,
                        'url'  => trim($site_url),
                    );
                }
            }
        }
    }

    function getSites() {
        return $this->_sites;
    }

    function postSites() {
        if ($site_str = Input::get('site')) {
            if (strpos($site_str, '=>') === false) {
                return [
                    'success' => false,
                    'msg'     => '格式不对',
                    'errCode' => 1
                ];
            }
            Option::set('cmssync::sites', $site_str);
            return [
                'success' => true,
                'data'    => $site_str,
                'errCode' => 0
            ];
        }
    }

    function getIndex() {
        $site_offset = Input::get('site', key($this->_sites));
        if (is_null($site_offset) || !isset($this->_sites[$site_offset])) {
            return [
                'success' => false,
                'msg'     => '没有绑定域名',
                'errCode' => 1
            ];
        }

        //使用验证器验证是否为合法域名
        $rules     = [
            'url' => 'required|url',
        ];
        $validator = Validator::make($this->_sites[$site_offset], $rules);

        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return [
                'success' => false,
                'msg'     => $messages,
                'errCode' => 2
            ];
        }

        $page   = Input::get('page', 1);
        $params = array('page' => $page);

        if ($keywords = Input::get('keywords')) {
            $params['keywords'] = $keywords;
        }
        $url = trim($this->_sites[$site_offset]['url']) . self::ARTICLE_API_URL_SUFFIX;
        return $this->simpleGet($url, $params);
    }

    function simpleGet($site, $params) {
        $curl = new Curl;
        if ($data = $curl->simple_get($site, $params)) {
            $subjects = json_decode($data, true);
            if (json_last_error() != JSON_ERROR_NONE) {
                return [
                    'success' => false,
                    'msg'     => 'JSON解析出错',
                    'errCode' => json_last_error()
                ];
            } else {
                $this->changePageinfo($subjects);
                return [
                    'success' => true,
                    'data'    => $subjects,
                    'errCode' => 0
                ];
            }
        } else {
            return [
                'success' => false,
                'msg'     => $curl->error_string,
                'errCode' => $curl->error_code
            ];
        }
    }

    //把旧框架的pageinfo转成laravel用
    function changePageinfo(&$input) {
        if (isset($input['posts'])) {
            $input['data'] = array_values($input['posts']);
            unset($input['posts']);
        }
        if (isset($input['applications'])) {
            $input['data'] = array_values($input['applications']);
            unset($input['applications']);
        }
        if (isset($input['pageinfo'])) {
            $input['total']        = $input['pageinfo']['total'];
            $input['per_page']     = $input['pageinfo']['size'];
            $input['current_page'] = $input['pageinfo']['current'];
            $input['last_page']    = $input['pageinfo']['last'];
            $input['from']         = $input['pageinfo']['from'];
            $input['to']           = $input['pageinfo']['to'];
            unset($input['pageinfo']);
        }
    }

    function postIndex() {
        $ids = Input::get('ids');
        $ids = is_array($ids) ? $ids : [$ids];

        $site_offset = Input::get('site', key($this->_sites));
        if (is_null($site_offset) || !isset($this->_sites[$site_offset])) {
            return [
                'success' => false,
                'msg'     => '没有绑定域名',
                'errCode' => 1
            ];
        }

        foreach ($ids as $id) {
            $url  = trim($this->_sites[$site_offset]['url']) . self::ARTICLE_API_URL_SUFFIX;
            $data = $this->simpleGet($url . $id . '?orgin=1');
            if (isset($data[success]) && $data[success]) {
                //为什么要取消掉分类?
                //不取分类的原因是,分类可能没有,不自动创建
                $subject_data = $data['data'];
                unset($subject_data['categories']);

                //同步app?
//                $apps = array();
//                foreach ($subject_data['apps'] as $app) {
//                    $apps[] = $this->createApp($app);
//                }
//                $subject_data['application_id'] = $apps;

                unset($subject_data['id']);
                $subject_data['status'] = Article::S_DRAFT;

                $curl = new Curl;
                return $curl->simple_post('ipa/article', $subject_data);
            } else {
                return $data;
            }
        }
    }

    function getApp() {
        $site_offset = Input::get('site', key($this->_sites));
        if (is_null($site_offset) || !isset($this->_sites[$site_offset])) {
            return [
                'success' => false,
                'msg'     => '没有绑定域名',
                'errCode' => 1
            ];
        }

        //使用验证器验证是否为合法域名
        $rules     = [
            'url' => 'required|url',
        ];
        $validator = Validator::make($this->_sites[$site_offset], $rules);

        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return [
                'success' => false,
                'msg'     => $messages,
                'errCode' => 2
            ];
        }

        $page   = Input::get('page', 1);
        $params = array('page' => $page);

        if ($keywords = Input::get('keywords')) {
            $params['keywords'] = $keywords;
        }
        $url = trim($this->_sites[$site_offset]['url']) . self::APP_API_URL_SUFFIX;
        return $this->simpleGet($url, $params);
    }

}
