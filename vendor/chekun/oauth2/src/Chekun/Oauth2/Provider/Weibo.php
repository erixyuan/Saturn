<?php

namespace Chekun\Oauth2\Provider;

use Chekun\Oauth2\Oauth2Provider;
use Chekun\Oauth2\Oauth2ProviderInterface;
use Chekun\Oauth2\Oauth2Exception;
use Chekun\Oauth2\Token\AccessToken;

class Weibo extends Oauth2Provider implements Oauth2ProviderInterface {

    const API_URL = 'https://api.weibo.com/2/';

    public $name   = 'weibo';
    public $human  = '新浪微博';
    public $uidKey = 'uid';
    public $method = 'POST';

    public function urlAuthorize() {
        return 'https://api.weibo.com/oauth2/authorize?client_id=3196502474&response_type=code&redirect_uri=http://sspai.com/loginwb';
    }

    public function urlAccessToken() {
        return 'https://api.weibo.com/oauth2/access_token';
    }

    public function getUserInfo(AccessToken $token) {
        $url  = static::API_URL . 'users/show.json?' . http_build_query(array(
                    'access_token' => $token->accessToken,
                    'uid'          => $token->uid,
        ));
        $user = json_decode($this->client->get($url)->getContent());
        if (array_key_exists("error", $user)) {
            throw new OAuth2Exception((array) $user);
        }
        return array(
            'via'           => 'weibo',
            'domain'        => $user->domain,
            'uid'           => $user->id,
            'name'          => $user->name,
            'screen_name'   => $user->screen_name,
            'gender'        => $user->gender,
            'location'      => $user->location,
            'profile_url'   => 'https://weibo.com/' . $user->profile_url,
            'description'   => $user->description,
            'image'         => $user->avatar_hd,
            'access_token'  => $token->accessToken,
            'expire_at'     => $token->expires,
            'refresh_token' => $token->refreshToken
        );
    }

}
