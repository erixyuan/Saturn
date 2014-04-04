<?php

class ManageCategory extends \BaseController {

    /**
     * 分类列表
     *
     * @return Response
     */
    public function index() {
        $query_builder = new Category;

        if (Input::has('type')) {
            $query_builder = $query_builder->where('type', Input::get('type'));
        }
        if (Input::get('index')) {
            $query_builder = $query_builder->where('status', Category::S_INDEX);
        }

        if (Input::has('parent_id')) {
            $query_builder = $query_builder->where('parent_id', Input::get('parent_id'));
        }

        if (Input::has('order')) {
            $query_builder = $query_builder->orderBy(Input::get('order'));
        } else {
            $query_builder = $query_builder->orderBy('parent_id')->orderBy('order')->orderBy('id');
        }

        $a_categories = $query_builder->get()->toArray();
        foreach ($a_categories as $k => $one) {
            $a_categories[$k]['childs'] = [];
            $a_categories[$k]['status'] = (bool) $a_categories[$k]['status'];
        }
        if (!empty($a_categories)) {
            $a_categories = with(new Tree($a_categories, ['id', 'parent_id']))->leaf(0);
        }

        return array_merge(['data' => $a_categories], Input::get());
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
        if ($id = Input::get('id')) {
            $category = Category::find($id);
        } else {
            $category = new Category();
        }

        $inputs = Input::only(['type', 'parent_id', 'name', 'description',
                    'slug', 'keywords', 'order', 'status', 'template']);
        $rules  = [
            'type'  => 'in:subject,application,product',
            'name'  => 'required|min:1',
            'order' => 'required|numeric',
        ];

        $validator = Validator::make($inputs, $rules);
        $validator->sometimes('slug', 'unique:categories,slug', function() use($inputs, $category) {
            return !empty($inputs['slug']) && ($category->slug != $inputs['slug']);
        });
        //todo: 循环继承的问题解决思路
        //在数据库存一个layer的字段,标明改分类的层级,p_id=0的为1层
        //递归n次得到p_id=0则为n层
        //最后对比大小禁止循环继承
        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return $this->msg($messages, 1);
        }

        $category->fill($inputs);
        $category->save();

        return $this->msg('success', 0);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        $o_article = Category::find($id);
        if (is_null($o_article)) {
            return $this->msg('category not exists', 1);
        }

        return $o_article;
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
        $category = Category::find($id);

        if (is_null($category)) {
            return $this->msg('分类不存在或已删除', 1);
        }
        if (Category::where('parent_id', $id)->count() > 0) {
            return $this->msg('请先删除子分类', 2);
        }
        $category->delete();
        return $this->msg('article id:$id deleted', 0);
    }

}
