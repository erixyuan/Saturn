<?php namespace Chekun\Oauth2\Provider;

use Chekun\Oauth2\Oauth2Provider;
use Chekun\Oauth2\Oauth2ProviderInterface;
use Chekun\Oauth2\Oauth2Exception;
use Chekun\Oauth2\Token\AccessToken;

class Tweibo extends Oauth2Provider implements Oauth2ProviderInterface {

    const API_URL = 'https://open.t.qq.com/api/';

    public $name = 'tweibo';

    public $human = '腾讯微博';

    public $uidKey = 'openid';

    public $method = 'POST';

    public function urlAuthorize()
    {
        return 'https://open.t.qq.com/cgi-bin/oauth2/authorize';
    }

    public function urlAccessToken()
    {
        return 'https://open.t.qq.com/cgi-bin/oauth2/access_token';
    }

    public function getUserInfo(AccessToken $token)
    {
        $url = static::API_URL . 'user/info?'.http_build_query(array(
                'access_token' => $token->accessToken,
                'oauth_consumer_key' => $this->clientId,
                'openid' => $token->uid,
                'clientip' => $_SERVER['REMOTE_ADDR'],
                'oauth_version' => '2.a'
            ));
        $user = json_decode($this->client->get($url)->getContent());
        if ($user->ret)
        {
            throw new OAuth2Exception((array) $user);
        }

        return array(
            'via' => 'tweibo',
            'uid' => $user->data->openid,
            'screen_name' => $user->data->nick,
            'name' => $user->data->name,
            'location' => '',
            'description' => $user->data->introduction,
            'image' => $user->data->head.'/100',
            'access_token' => $token->access_token,
            'expire_at' => $token->expires,
            'refresh_token' => $token->refresh_token
        );
    }
}