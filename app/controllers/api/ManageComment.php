<?php

class ManageComment extends \BaseController {

    /**
     * 网址过滤规则
     *
     * @var string
     */
    const URL_PATTERN = '(^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$)';

    /**
     * 英文爱好者过滤
     *
     * @var string
     */
    const ENG_PATTERN = '(((\b[a-zA-Z0-9,.]+?\b\s?){1,2}){5})';

    /**
     * 评论列表
     *
     * @return Response
     */
    public function index() {
        $comments = Comment::with('article');
        if ($status   = trim(Input::get('status'))) {
            $comments = $comments->status($status);
        }
        if (Input::has('uid')) {
            $comments = $comments->where('user_id', Input::get('uid'));
        }
        if (Input::has('sid')) {
            $comments = $comments->where('object_id', Input::get('sid'))
                    ->where('object_type', 'subject');
        }
        $o_comments = $comments->orderBy('created', 'DESC')->paginate(20);

        $counter_sql  = "SELECT count(`status` or null) AS 'all',
            count(`status` =1 or null) AS publish,
            count(`status` =0 or null) AS pending,
            count(`status` =-1 or null) AS refuse,
            count(`status` =-99 or null) AS recycle FROM comments";
        $query_result = DB::select($counter_sql);
        $query_result = isset($query_result[0]) ?
                $query_result[0] : json_decode('{"all":0,"publish":0,"pending":0,"refuse":0,"recycle":0}');

        return array_merge($o_comments->toArray(), ['count' => $query_result]);
//        $p_comments = $o_comments->toArray();
//        foreach ($o_comments as $pos => $o_comment) {
//            $p_comments[$pos]['post_url']   = $o_comment->subject->url();
//            $p_comments[$pos]['url']        = $p_comments[$pos]['post_url'] . '#comment-id-' . $o_comment->id;
//            $p_comments[$pos]['post_title'] = $o_comment->subject->title;
//        }
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


        $inputs = Input::only(['object_id', 'object_type', 'email', 'author', 'content', 'captcha']);
        $rules  = [
            //必须存在已发布的文章的id
            'object_id'   => 'exists:subjects,id,status,1',
            'object_type' => 'in:subject,application',
            'email'       => 'required|email',
            'author'      => 'required|min:1',
            'content'     => 'required|min:1',
        ];


        $comment            = new Comment;
        $comment->parent_id = 0;
        $comment->user_id   = 0;

        helper::clean_xss($inputs['author'], 1);
        helper::clean_xss($inputs['content'], 1);
        $comment->fill($inputs);

        if (Auth::check()) {
            unset($rules['email']);
            unset($rules['author']);
            $comment->user_id = Auth::user()->id;
            $comment->author  = Auth::user()->username;
        }
        $validator = Validator::make($inputs, $rules);
        $validator->sometimes('captcha', 'required|captcha', function() {
            return (bool) Option::get(comment_default::captcha);
        });

        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return [
                'success' => FALSE,
                'msg'     => $messages,
                'errCode' => 1
            ];
        }



//            $last_message = Comment::where('object_id=?', $comment->object_id)->take(1)->get();
//            if ($last_message->id && ($last_message->content == $comment->content)) {
//                $err_msg = '请不要提交重复内容。';
//                break;
//            }


        $spam_flag = 0;
        if ($comment->email) {
            $api_key = Config::get('app.akismet_api_key');

            $blog       = 'http://www.zoopda.com';
            $user_agent = 'Saturn'; //WordPress/3.1.1 | Akismet/2.5.3
            $akismet    = new MicroAkismet($api_key, $blog, $user_agent);
            $data       = array(
                'user_ip'         => $this->request->ip(),
                'comment_content' => $comment->content);
            $spam_flag  = $akismet->check($data);
        }

        $url_flag = preg_match(self::URL_PATTERN, $comment->content);

        $eng_flag = preg_match(self::ENG_PATTERN, $comment->content);

        if ($spam_flag || $url_flag || !Option::get('comment_default::enable') || $eng_flag) {
            $err_msg         = '您的评论需要审核才能发布，感谢您的参与。';
            $comment->status = 0;
            $comment->save();
            return array('success' => FALSE, 'errmsg' => $err_msg);
        } else {
            $comment->status = 1;
            $comment->save();
            $err_msg         = '发布成功，感谢您的参与。';
            return array('success' => TRUE, 'errmsg' => $err_msg, 'comment' => $comment->toArray());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        //
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
                    $count = $this->changeStatus($ids, Comment::S_PUBLISHED);
                    break;
                case 'refuse':
                    $count = $this->changeStatus($ids, Comment::S_REFUSE);
                    break;
                case 'delete':
                    $count = $this->changeStatus($ids, Comment::S_RECYCLE);
                    break;
                default:
                    break;
            }
            $require = count($ids);
            return [
                'success' => true,
                'msg'     => "request {$require} ,deal {$count}.",
                'errCode' => 0,
            ];
        }
        return array(
            'msg'     => "require ids.",
            'errCode' => 1,
        );
    }

    function changeStatus($ids, $status) {
        $i = 0;
        foreach ($ids as $id) {
            $c = Comment::find($id);
            
            if ($c) {
                if ($status == Comment::S_RECYCLE && $c->status == Comment::S_RECYCLE) {
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
        if ($comment = Comment::find($id)) {
            if ($comment->status == Comment::S_RECYCLE) {
                $comment->delete();
            } else {
                $comment->status = Comment::S_RECYCLE;
                $comment->save();
            }
            return [
                'success' => true,
                'msg'     => "comment id:$id deleted.",
                'errCode' => 0,
            ];
        }
        return array(
            'msg'     => "评论不存在或已删除.",
            'errCode' => 3,
        );
    }

}
