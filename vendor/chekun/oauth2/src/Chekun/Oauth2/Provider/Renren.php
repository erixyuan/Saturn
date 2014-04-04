<?php namespace Chekun\Oauth2\Provider;

use Chekun\Oauth2\Oauth2Provider;
use Chekun\Oauth2\Oauth2ProviderInterface;
use Chekun\Oauth2\Oauth2Exception;
use Chekun\Oauth2\Token\AccessToken;

class Renren extends Oauth2Provider implements Oauth2ProviderInterface {

    const API_URL = 'https://api.renren.com/restserver.do';

    public $name = 'renren';

    public $human = '人人';

    public $method = 'POST';

    public function urlAuthorize()
    {
        return 'https://graph.renren.com/oauth/authorize';
    }

    public function urlAccessToken()
    {
        return 'https://graph.renren.com/oauth/token';
    }

    public function getUserInfo(AccessToken $token)
    {
        $params = array(
            'access_token' => $token->accessToken,
            'format' => 'JSON',
            'v' => '1.0',
            'call_id' => time(),
            'method' => 'users.getInfo'
        );
        $user = json_decode($this->client->post(static::API_URL, $params)->getContent());

        if ( ! is_array($user) OR ! isset($user[0]) OR ! ($user = $user[0]) OR array_key_exists("error_code", $user))
        {
            throw new OAuth2Exception((array) $user);
        }

        return array(
            'via' => 'renren',
            'uid' => $user->uid,
            'screen_name' => $user->name,
            'name' => '',
            'location' => '',
            'description' => '',
            'image' => $user->tinyurl,
            'access_token' => $token->access_token,
            'expire_at' => $token->expires,
            'refresh_token' => $token->refresh_token
        );
    }
}