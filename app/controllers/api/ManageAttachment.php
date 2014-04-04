<?php

class ManageAttachment extends \BaseController {

    /**
     * 输出附件列表.
     *
     * @return Response
     */
    public function index() {
        $params = Input::get();

        //设置隐藏域
        $attachment = new Attachment;

        if ($type = trim(Input::get('type'))) {
            $attachment = $attachment->where('object_type', $type);
        }
        if ($object_id = trim(Input::get('id'))) {
            $attachment = $attachment->where('object_id', $object_id);
        }
        if ($relation = trim(Input::get('relation'))) {
            $attachment = $attachment->where('object_relation', $relation);
        }
        $a_attachment = $attachment
                // 附件排序，按id倒序
                ->orderBy('id', 'desc')
                ->paginate(14)
                ->toArray();

        return array_merge($a_attachment, $params);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        if (Input::hasFile('file')) {
            $inputs    = Input::only(['object_id', 'object_type', 'object_relation']);
            $rules     = [
                'object_id'       => 'required',
                'object_type'     => 'required',//|in:subject,application,plugin_slide
                'object_relation' => 'required',
            ];
            /* 校验 必须存在以上三个属性 */
            $validator = Validator::make($inputs, $rules);
            $validator->sometimes('object_id', 'exists:subjects,id', function($input) {
                return $input->object_type == 'subject';
            });
            $validator->sometimes('object_id', 'exists:applications,id', function($input) {
                return $input->object_type == 'application';
            });
//            if (!$this->provider->visitor->checkAuth('attachment/upload')) {
//                return array('error' => '你没有权限上传附件.', 'state' => '你没有权限上传附件.', 'error_code' => 'access_dendy', 'session_id' => session_id());
//            }

            // 如果校验不对
            if ($validator->fails()) {
                $messages = $validator->messages()->toArray();
                return [
                    'error'   => $messages,
                    'state'   => $messages,
                    'error_code' => 'upload_invalid_validated'
                ];
            }

            $file = Input::file('file');
            $ext  = helper::getExtension($file->getRealPath());
            if (empty($ext) || ($file->getClientSize() > 8 * 1024 * 1024)) {
                return [
                    'error'   => '图片格式不正确',
                    'state'   => '图片格式不正确',
                    'error_code' => 'upload_invalid_extension'
                ];
            }
            $attachment      = new Attachment;
            $attachment->fill(array(
                'user_id'         => Auth::user()->id,
                'object_id'       => $inputs['object_id'],
                'object_type'     => $inputs['object_type'],
                'object_relation' => $inputs['object_relation'],
                'created'         => time()
            ));
            $attachment->save();
            $fileName        = $attachment->id . '.' . $file->getClientOriginalExtension();
            $destinationPath = Attachment::PATH_ORIGIN . date('Y/m/d', time());

            $uploadSuccess = $file->move($destinationPath, $fileName);
            if ($uploadSuccess) {
                $attachment->fill(
                        array(
                            'path'      => date('Y/m/d', time()) . '/' . $fileName,
                            'filename'  => $file->getClientOriginalName(),
                            'extension' => $file->getClientOriginalExtension(),
                            'filesize'  => $file->getClientSize(),
                        )
                );
                $attachment->save();
                return [
                    'error'    => 0,
                    'id'       => $attachment->id,
                    'url'      => asset(Attachment::PATH_ORIGIN . $attachment->path),
                    'title'    => '',
                    'fileType' => ".{$attachment->extension}",
                    'original' => $attachment->filename,
                    'state'    => 'SUCCESS',
                ];
            } else {
                $attachment->delete();
            }
        }
        return [
            'error'      => '没有上传文件',
            'state'      => '没有上传文件',
            'error_code' => 'no_upload_file'
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
//        $log = LogRequest::find(2);
//        return $log;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $article = Attachment::find($id);

        if (is_null($article)) {
            return array(
                'msg'     => "附件不存在或已删除.",
                'errCode' => 3,
            );
        }

        $article->delete();

        return [
            'success' => true,
            'msg'     => "attachment id:$id deleted.",
            'errCode' => 0,
        ];
    }

}
