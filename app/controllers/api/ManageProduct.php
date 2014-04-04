<?php

class ManageProduct extends \BaseController {

    // 商品部分BUG很多，見諒。 SolidZORO 2014-03-17

    /**
     * 商品列表.
     *
     * @return Response
     */
    public function index() {
        $params = Input::get();

        // 设置隐藏域
        $product = Product::withCate()
            ->with('productLinks')
            ->with('user')
            ->with('cover')
            ->select(DB::raw('products.*'));

        if ($status = trim(Input::get('status'))) {
            $product = $product->status($status);
        }
        if ($keywords = trim(Input::get('keyword'))) {
            $product = $product->where('name', 'LIKE', "%{$keywords}%");
        }
        if ($uid = Input::get('uid')) {
            $product = $product->where('user_id',$uid);
        }
        if ($cid = Input::get('cid')) {
            $product = $product->join('re_products_categories as ac', 'products.id', '=', 'ac.product_id')
                    ->where('ac.category_id', $cid);
        }

        if ($plat = Input::get('platform')) {
            $product = $product->join('product_links as pl', 'products.id', '=', 'pl.product_id')
                    ->where('pl.platform', $plat);
        }
        if ($order = Input::get('orderby')) {
            $product = $product->orderby($order, 'desc');
        } else {
            $product = $product->orderby('created', 'desc');
        }
        $p_products = $product->paginate(20)->toArray();

        $counter_sql  = "SELECT count(`status` !=0 or null) AS 'all',
            count(`status` =1 or null) AS publish,
            count(`status` =-1 or null) AS draft,
            count(`status` =-2 or null) AS pending,
            count(`status` =-3 or null) AS refuse,
            count(`status` =-99 or null) AS recycle FROM products";
        $query_result = DB::select($counter_sql);
        $query_result = isset($query_result[0]) ?
                $query_result[0] : json_decode('{"all":0,"publish":0,"draft":0,"pending":0,"refuse":0,"recycle":0}');

        return array_merge($p_products, $params, ['count' => $query_result]);
    }




    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {

        $new          = Product::firstOrCreate(array(
                    'user_id' => Auth::user()->id,
                    'status'  => Product::S_INIT,
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
        $inputs    = Input::only(['id', 'tags', 'categories']);
        $rules     = [
            'id'         => 'required|exists:products,id',
            'tags'       => 'required',
            'categories' => 'required',
        ];
        $validator = Validator::make($inputs, $rules);
        $validator->sometimes('cover_id', 'exists:attachments,id', function() use($inputs) {
            return !empty($inputs['cover_id']);
        });
        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return [
                'error'   => $messages,
                'state'   => $messages,
                'errCode' => 1
            ];
        }
        $o_product = Product::find($inputs['id']);


        $o_product->fill(Input::only(['user_id', 'name', 'price', 'description','cover_id'
        ]));


        //定时
        if ($published = Input::get('published')) {
            $o_product->published = $published;
        }

        if (Input::get('draft')) {
            $o_product->status = Application::S_DRAFT;
        } else if (Input::get('pending')) {
            $o_product->status = Application::S_PENDING;
        } else if (Input::get('autosave')) {
            if ($o_product->status == Application::S_INIT) {
                $o_product->status = Application::S_DRAFT;
            }
        } else {
            //todo检查发表权限
            //没有就设为草稿
            $o_product->status = Application::S_PUBLISHED;
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
            $o_product->tags()->sync($tagids);
        }

        //分类处理
        if ($cids = Input::get('categories')) {
            $cids = is_array($cids) ? array_unique($cids) : array($cids);
            $o_product->categories()->sync($cids);
        }





        /* 商品links关联 */
        if ($links = Input::get('product_links')) {
            $links = new Illuminate\Database\Eloquent\Collection($links);
            foreach ($links as $link) {
                if (!empty($link)) {
                    $d = new ProductLink;

                    if (!isset($link['id'])) {
                        $d->fill($link);
                        $d->save();
                        // $o_product->productLinks()->associate($d);
                    } else {

                        $d = ProductLink::find($link['id']);
                        $d->fill($link);

                        if ($d->getDirty()) {
                            $d->save();
                            // $o_product->productLinks()->associate($d);
                        }
                    }
                }
            }
        }
        if ($o_product->getDirty()) {
            $o_product->modified = time();
        }

        $o_product->push();
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
        $product = Product::withCate()
                ->with('productLinks')
                ->with('tags')
                ->with('cover')
                ->find($id);
        if (is_null($product) || $product->status == Product::S_INIT) {
            return $this->msg(0, 'product not exists');
        }

        //动态设置隐藏域
        $product->setHidden([]);
        return $product;
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
                    $count = $this->changeStatus($ids, Product::S_PUBLISHED);
                    break;
                case 'refuse':
                    $count = $this->changeStatus($ids, Product::S_REFUSE);
                    break;
                case 'pending':
                    $count = $this->changeStatus($ids, Product::S_PENDING);
                    break;
                case 'delete':
                    $count = $this->changeStatus($ids, Product::S_RECYCLE);
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
            $c = Product::find($id);
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
        $article = Product::find($id);

        if (is_null($article)) {
            return array(
                'msg'     => "商品不存在或已删除.",
                'errCode' => 3,
            );
        }
        if ($article->status == Product::S_RECYCLE) {
            $article->delete();
        } else {
            $article->status = Product::S_RECYCLE;
            $article->save();
        }
        return [
            'success' => true,
            'msg'     => "product id:$id deleted.",
            'errCode' => 0,
        ];
    }




}
