<?php

class ManageEntry extends BaseController {

    public function login() {
        $userdata = array(
            'username' => Input::get('username'),
            'password' => Input::get('password')
        );
        $remember = Input::has('remember');
        $user     = User::where('username', $userdata['username'])->first();
        if (!$user) {
            return $this->msg('user no exist', 2);
        }
        $credential = ($user->getAuthPassword() === md5($userdata['password']));
        if (!$credential) {
            //在这里做次数限制
            return $this->msg('wrong psw', 3);
        }
        Auth::login($user, $remember);
        $user->logined = time();
        $user->save();
        return $this->msg('success', 0);
    }

    public function checkAuth() {
        if (Auth::check()) {
            if ($avatar = Auth::user()->avatar) {
                $avatar = $avatar->thumb(['w' => 100, 'h' => 100, 'c' => 1]);
            }
            if ($roles = Auth::user()->roles) {
                $roles = implode(',', $roles->lists('display_name'));
            }
            return array(
                'msg'      => 'success',
                'errCode'  => 0,
                'username' => Auth::user()->username,
                // 添加userid SolidZORO
                'userid' => Auth::user()->id,
                'roles'    => $roles,
                'avatar'   => $avatar,
            );
        } else {
            return $this->msg('fail', 1);
        }
    }

    public function logout() {
        Auth::logout();
        return $this->msg('success', 0);
    }

}
