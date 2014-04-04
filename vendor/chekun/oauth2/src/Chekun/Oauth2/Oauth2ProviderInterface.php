<?php namespace Chekun\Oauth2;

use Chekun\Oauth2\Token\AccessToken;

interface Oauth2ProviderInterface {

    public function urlAuthorize();

    public function urlAccessToken();

    public function getUserInfo(AccessToken $token);

}