<?php namespace Chekun\Oauth2\Provider;

use Chekun\Oauth2\Oauth2Provider;
use Chekun\Oauth2\Oauth2ProviderInterface;
use Chekun\Oauth2\Oauth2Exception;
use Chekun\Oauth2\Token\AccessToken;

class Qq extends Oauth2Provider implements Oauth2ProviderInterface {

    const API_URL = 'https://graph.qq.com/oauth2.0/';

    public $name = 'qq';

    public $human = 'QQ';

    public $uidKey = 'openid';

    public $method = 'POST';

    public function urlAuthorize()
    {
        return static::API_URL . 'authorize';
    }

    public function urlAccessToken()
    {
        return static::API_URL . 'token';
    }

    public function getUserInfo(AccessToken $token)
    {
        $url = static::API_URL . '/me?'.http_build_query(array(
                'access_token' => $token->accessToken
            ));
        $response = $this->client->get($url)->getContent();

        $response = $this->parseResponse($response);

        $me = json_decode($response);

        if (isset($me->error))
        {
            throw new OAuth2Exception((array) $me);
        }

        $url = 'https://graph.qq.com/user/get_user_info?'.http_build_query(array(
                'access_token' => $token->accessToken,
                'openid' => $me->openid,
                'oauth_consumer_key' => $this->clientId
            ));
        $response = $this->client->get($url);
        $user = json_decode($response);

        if (isset($user->error))
        {
            throw new OAuth2Exception((array) $user);
        }
        return array(
            'via' => 'qq',
            'uid' => $me->openid,
            'screen_name' => $user->nickname,
            'name' => '',
            'location' => '',
            'description' => '',
            'image' => $user->figureurl,
            'access_token' => $token->accessToken,
            'expire_at' => $token->expires,
            'refresh_token' => $token->refreshToken
        );
    }
}