<?php

class ManageUser extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    /**
     * 用户列表
     *
     * @return json $allUsers
     */
    public function index() {
        $params = Input::get();
        $user   = User::with('roles');
        if (isset($params['keyword'])) {
            $keywords = trim($params['keyword']);
            $user     = $user->where('username', 'LIKE', "%{$keywords}%");
        }
        if (isset($params['role'])) {
            $user = $user->whereHas('roles', function($q) use($params) {
                $q->where('roles.name', $params['role']);
            });
        }
        $allUsers = $user->paginate(20)->toArray(); //orderBy('id', 'DESC')->
        return array_merge($allUsers, $params);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        $new             = User::firstOrCreate(array(
                    'password' => '',
                    'enabled'  => 0,
        ));
        $new->registered = time();
        $new->save();
        return $new;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        if ($id = Input::get('id')) {
            $user = User::find($id);
        } else {
            $this->msg('require id', 1);
        }
        if (!$user) {
            $this->msg('user not exist', 2);
        }

        $rules = [
            'username'    => 'required|between:1,16', //唯一?
            'email'       => 'required|email',
            'enabled'     => 'in:1,0',
            'editor_type' => 'in:2,1,0',
            'editor_theme' => 'in:1,0'
        ];

        $validator = Validator::make(Input::get(), $rules);

        $validator->sometimes('password', 'required|min:6', function() use($user) {
            return empty($user->password);
        });
        $validator->sometimes('username', 'unique:users', function() use($user) {
            return empty($user->password);
        });
        $validator->sometimes('password2', 'required|same:password', function() {
            return Input::has('password');
        });
        $validator->sometimes('avatar_id', 'exists:attachments,id', function() {
            return (bool) Input::get('avatar_id');
        });

        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return $this->msg($messages, 1);
        }

        $inputs = Input::only(['username', 'password', 'email', 'enabled', 'editor_type','editor_theme', 'avatar_id']);
        if (!$inputs['password']) {
            unset($inputs['password']);
        }
        $user->fill($inputs);
        $user->save();
        if ($metas = Input::get('metas')) {
            if (!($metas = $user->metas)) {
                $metas = new UserMeta;
            }
            $inputs            = Input::get('metas');
            $inputs['user_id'] = $user->id;

            $metas->fill($inputs);
            $metas->save();
        }
        if ($roles = Input::get('roles')) {
            if ($exist_role = $user->roles) {
                $user->detachRoles($exist_role);
            }
            foreach ($roles as $r) {
                if (isset($r['id']))
                    if ($role = Role::find($r['id'])) {
                        $user->attachRole($role);
                    }
            }
        }
        return $this->msg('success', 0);
    }

    /**
     * 某个用户
     *
     * @param  int  $id
     * @return json $a_user
     */
    public function show($id) {
        $o_user = User::with('metas')
                ->with('roles')
                ->with('avatar')
                ->find($id);
        if (!$o_user) {
            return $this->msg('用户不存在或已删除', 1);
        }

        return $o_user;
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
        if (Auth::user()->id == $id) {
            return $this->msg('不能删除自己', 1);
        }
        if ($user = User::find($id)) {
            $user->delete();
            return $this->msg("user id:$id deleted", 0);
        }
        return $this->msg('用户不存在或已删除', 2);
    }

}
