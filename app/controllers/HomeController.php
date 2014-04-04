<?php

class HomeController extends BaseController {
    /*
      |--------------------------------------------------------------------------
      | Default Home Controller
      |--------------------------------------------------------------------------
      |
      | You may wish to use controllers instead of, or in addition to, Closure
      | based routes. That's great! Here is an example controller method to
      | get you started. To route to this controller, just add the route:
      |
      |	Route::get('/', 'HomeController@showWelcome');
      |
     */

    public function showWelcome() {
        return View::make('hello');
    }

    /**
     * Login user with facebook
     *
     * @return void
     */
    public function login() {
        return View::make('login');
    }

    public function loginWithWeibo() {
        $code = Input::get('code');
        $fb   = Oauth2::make('weibo');
        if (!empty($code)) {

            $token  = $fb->access($code);
            $result = $fb->getUserInfo($token);
            $user   = User::whereHas('userOAuth', function($q) use($result) {
                        $q->where('uid', $result['uid'])->where('via', 'weibo');
                    })->first();
            if (!$user) {
                $user = $this->createSocialUser($result);
            }
            Auth::login($user);

            return Redirect::to(url('m'));
        } else {
            $url = $fb->urlAuthorize();
            return Redirect::to((string) $url);
        }
    }

    private function createSocialUser($userinfo) {
        $gender = ['m' => 'male', 'f' => 'female'];

        $userinfo         = (object) $userinfo;
        $user             = new User;
        $user->username   = $userinfo->name;
        $user->enabled    = 1;
        $user->email      = $userinfo->domain . '@' . $userinfo->via;
        $user->registered = time();
        $user->save();

        //metas
        $metas           = new UserMeta;
        $metas->user_id  = $user->id;
        $metas->nickname = $userinfo->name;
        $metas->sex      = $gender[$userinfo->gender];
        $metas->weibo    = $userinfo->profile_url;
        $metas->address  = $userinfo->location;
        $metas->bio      = $userinfo->description;
        $metas->save();

        //oauth
        $oauth            = new UserOAuth;
        $oauth->user_id   = $user->id;
        $oauth->token     = $userinfo->access_token;
        $oauth->uid       = $userinfo->uid;
        $oauth->via       = $userinfo->via;
        $oauth->expire_at = $userinfo->expire_at;
        $oauth->save();

        //head
        return $user;
    }

}
