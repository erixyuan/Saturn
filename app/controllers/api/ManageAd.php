<?php

class ManageAd extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    /**
     * ad列表
     *
     * @return Response
     */
    function index() {
        return Ad::orderBy('id')->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    function show($id) {
        $ad = Ad::find($id);
        if (!$ad) {
            $ad = Ad::where('key', $id)->first();
        }
        if (!$ad) {
            return array('errCode' => 1, 'msg' => 'ad not exists!');
        }
        $a_ad          = $ad->toArray();
        $a_ad['items'] = is_array($a_ad['items']) ? $a_ad['items'] : [];

        foreach ($a_ad['items'] as $k => $item) {
            if (isset($item['attachment_id']) && $item['attachment_id']) {
                if ($img = Attachment::find($item['attachment_id'])) {
                    $url = $img->origin_path();
                }
                $a_ad['items'][$k]['image_url'] = isset($url) ? asset($url) : '';
            }
        }
        return $a_ad;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        return Ad::firstOrCreate(['key' => '']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    function store() {
        $ad = Ad::find(Input::get('id'));
        if (!$ad) {
            return [
                'errCode' => 1,
                'msg'     => 'ad not exists!'
            ];
        }

        $inputs    = Input::only(['key', 'name', 'items', 'type']);
        $rules     = [
            'key'  => 'required|min:1',
            'name' => 'required|min:1',
        ];

        $validator = Validator::make($inputs, $rules);
        $validator->sometimes('key', 'required|min:1|unique:ads,key', function() {
            return !Input::has('id');
        });
        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return [
                'success' => FALSE,
                'msg'     => $messages,
                'errCode' => 1
            ];
        }

//        if ($items = Input::get('items')) {
//            foreach ($items as $i) {
//                foreach (['attachment_id', 'title', 'link', 'content', 'order'] as $v) {
//                    if (!isset($i[$v])) {
//                        return [
//                            'success' => FALSE,
//                            'msg'     => '请提供完整的广告字段包括'
//                            . "'attachment_id', 'title', 'link', 'content', 'order'",
//                            'errCode' => 1
//                        ];
//                    }
//                }
//            }
//        }
        $ad->fill($inputs);
        $ad->save();

        return array(
            'success' => true,
            'msg'     => 'success',
            'errCode' => 0,
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $ad = Ad::find($id);

        if (is_null($ad)) {
            return array(
                'msg'     => "ad不存在或已删除.",
                'errCode' => 1,
            );
        }
        $ad->delete();
        return [
            'success' => true,
            'msg'     => "ad id:$id deleted.",
            'errCode' => 0,
        ];
    }

}
