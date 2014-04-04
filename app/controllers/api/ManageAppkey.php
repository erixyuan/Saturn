<?php

class ManageAppkey extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    /**
     * ad列表
     *
     * @return Response
     */
    function index() {
        return Appkey::all();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    function show($id) {
        $ad = Appkey::find($id);
        if (!$ad) {
            $ad = Appkey::where('key', $id)->first();
        }
        if (!$ad) {
            return array('errCode' => 1, 'msg' => 'ad not exists!');
        }
        return $ad;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    function store() {
        if ($id = Input::get('id')) {
            $ad = Appkey::find($id);
        } else {
            $ad = new Appkey;
        }
        $inputs    = Input::only(['key', 'name', 'items']);
        $rules     = [
            //必须存在已发布的文章的id
            'key'  => 'required|min:1',
            'name' => 'required|min:1',
        ];
        $validator = Validator::make($inputs, $rules);
        $validator->sometimes('key', 'required|min:1|unique:appkeys,key', function() {
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
        $ad = Appkey::find($id);

        if (is_null($ad)) {
            return array(
                'msg'     => "appkey 不存在或已删除.",
                'errCode' => 1,
            );
        }
        $ad->delete();
        return [
            'success' => true,
            'msg'     => "appkey id:$id deleted.",
            'errCode' => 0,
        ];
    }

}
