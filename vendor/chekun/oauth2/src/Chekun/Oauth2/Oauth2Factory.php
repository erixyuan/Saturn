<?php namespace Chekun\Oauth2;

class Oauth2Factory {

    public function make($provider)
    {
        $providerClass = 'Chekun\\Oauth2\\Provider\\' . ucfirst($provider);
        $config = \Config::get('oauth2::oauth2.' . strtolower($provider));
        return new $providerClass($config);
    }

}