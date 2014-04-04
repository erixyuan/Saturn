<?php

class ManageApplication extends \BaseController {

    /**
     * 应用列表.
     *
     * @return Response
     */
    public function index() {
        $params = Input::get();

        //设置隐藏域
        $app = Application::withCate()
                ->with('appinfos')
                ->with('icon')
                ->with('user')
                ->select(DB::raw('applications.*'));

        if ($status = trim(Input::get('status'))) {
            $app = $app->status($status);
        }
        if ($keywords = trim(Input::get('keyword'))) {
            $app = $app->where('name', 'LIKE', "%{$keywords}%");
        }
        if ($uid = Input::get('uid')) {
            $app = $app->where('user_id',$uid);
        }
        if ($cid = Input::get('cid')) {
            $app = $app->join('re_applications_categories as ac', 'applications.id', '=', 'ac.app_id')
                    ->where('ac.category_id', $cid);
        }
        if ($plat = Input::get('platform')) {
            $app = $app->join('application_downs as ad', 'applications.id', '=', 'ad.application_id')
                    ->where('ad.platform', $plat);
        }
        if ($order = Input::get('orderby')) {
            $app = $app->orderby($order, 'desc');
        } else {
            $app = $app->orderby('created', 'desc');
        }
        $a_apps = $app->paginate(20)->toArray();

        $counter_sql  = "SELECT count(`status` !=0 or null) AS 'all',
            count(`status` =1 or null) AS publish,
            count(`status` =-1 or null) AS draft,
            count(`status` =-2 or null) AS pending,
            count(`status` =-3 or null) AS refuse,
            count(`status` =-99 or null) AS recycle FROM applications";
        $query_result = DB::select($counter_sql);
        $query_result = isset($query_result[0]) ?
                $query_result[0] : json_decode('{"all":0,"publish":0,"draft":0,"pending":0,"refuse":0,"recycle":0}');

        return array_merge($a_apps, $params, ['count' => $query_result]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {

        $new          = Application::firstOrCreate(array(
                    'user_id' => Auth::user()->id,
                    'status'  => Application::S_INIT,
        ));
        $new->created = time();
        $new->save();
        return $new;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        $inputs    = Input::only(['id', 'name', 'tags', 'categories', 'icon_id']);
        $rules     = [
            'id'         => 'required|exists:applications,id',
            'tags'       => 'required',
            'categories' => 'required',
        ];

        $validator = Validator::make($inputs, $rules);
        $validator->sometimes('icon_id', 'exists:attachments,id', function() use($inputs) {
            return !empty($inputs['icon_id']);
        });


        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return [
                'error'   => $messages,
                'state'   => $messages,
                'errCode' => 1
            ];
        }

        $o_app = Application::find($inputs['id']);
        $o_app->fill(Input::only(['ontop', 'to_appwall', 'name', 'name_en', 'icon_id',
                    'name_package', 'version', 'language', 'size', 'description'
        ]));


        //定时
        if ($published = Input::get('published')) {
            $o_app->published = $published;
        }

        if (Input::get('draft')) {
            $o_app->status = Application::S_DRAFT;
        } else if (Input::get('pending')) {
            $o_app->status = Application::S_PENDING;
        } else if (Input::get('autosave')) {
            if ($o_app->status == Application::S_INIT) {
                $o_app->status = Application::S_DRAFT;
            }
        } else {
            //todo检查发表权限
            //没有就设为草稿
            $o_app->status = Application::S_PUBLISHED;
        }



        //处理关联
        //标签处理
        if ($tags = Input::get('tags')) {
            $tags = is_array($tags) ? array_unique($tags) : [$tags];
            $tags = array_map('trim', $tags);
            $exist_tags      = Tag::whereIn('name', $tags)->get();
            $exist_tags_name = $exist_tags->lists('name');
            $tagids          = $exist_tags->lists('id');

            foreach ($tags as $tag) {
                if (!in_array($tag, $exist_tags_name)) {
                    $o_tag       = new Tag;
                    $o_tag->name = $tag;
                    $o_tag->save();
                    $tagids[]    = $o_tag->id;
                }
            }
            $o_app->tags()->sync($tagids);
        }



        //分类处理
        if ($cids = Input::get('categories')) {
            $cids = is_array($cids) ? array_unique($cids) : array($cids);
            $o_app->categories()->sync($cids);
        }



        //下载信息关联
        if ($downs = Input::get('appinfos')) {
            $downs = new Illuminate\Database\Eloquent\Collection($downs);

            foreach ($downs as $down) {

                // 如果appinfoos
                if (!empty($down)) {


                    if (!isset($down['id']) || $down['id'] == "null") {
                        $appinfo = new Appinfo;
                        $appinfo->fill($down);
                        $appinfo->save();
                        // ::TODO:: 這個是幹嘛用的？ 如果留下會報錯，註釋了就沒問題，而且數據能提交。
                        // $o_app->appinfos()->associate($appinfo);
                    } else {
                        $appinfo = Appinfo::find($down['id']);
                        $appinfo->fill($down);
                        if ($appinfo->getDirty()) {
                            $appinfo->save();
                            // 从子模型向父模型插入数据
                            // $o_app->appinfos()->associate($appinfo);
                        }
                    }
                }
            }
        }


        // getDirty() = 獲取自上次同步已更改的屬性
        if ($o_app->getDirty()) {
            $o_app->modified = time();
        }

        $o_app->push();
        return [
            'success' => true,
            'msg'     => 'success',
            'errCode' => 0
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        $app = Application::withCate()
                ->with('appinfos')
                ->with('tags')
                ->with('icon')
                ->find($id);
        if (is_null($app) || $app->status == Application::S_INIT) {
            return $this->msg(0, 'app not exists');
        }

//动态设置隐藏域
        $app->setHidden([]);
        return $app;
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
        if (Input::has('ids')) {
            $ids   = Input::get('ids');
            $ids   = is_array($ids) ? $ids : [$ids];
            $count = 0;
            switch ($id) {
                case 'publish':
                    $count = $this->changeStatus($ids, Application::S_PUBLISHED);
                    break;
                case 'refuse':
                    $count = $this->changeStatus($ids, Application::S_REFUSE);
                    break;
                case 'pending':
                    $count = $this->changeStatus($ids, Application::S_PENDING);
                    break;
                case 'delete':
                    $count = $this->changeStatus($ids, Application::S_RECYCLE);
                    break;
                default:
                    break;
            }
            $require = count($ids);
            return $this->msg(1, "request {$require} ,deal {$count}.");
        }
        return $this->msg(0, "require ids.");
    }

    function changeStatus($ids, $status) {
        $i = 0;
        foreach ($ids as $id) {
            $c = Application::find($id);
            if ($c) {
                if ($status == -99 && $c->status == -99) {
                    $c->delete();
                } else {
                    $c->status = $status;
                    $c->save();
                }
                $i++;
            }
        }
        return $i;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $article = Application::find($id);

        if (is_null($article)) {
            return array(
                'msg'     => "应用不存在或已删除.",
                'errCode' => 3,
            );
        }
        if ($article->status == Application::S_RECYCLE) {
            $article->delete();
        } else {
            $article->status = Application::S_RECYCLE;
            $article->save();
        }
        return [
            'success' => true,
            'msg'     => "application id:$id deleted.",
            'errCode' => 0,
        ];
    }

}
