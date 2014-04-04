<?php namespace Chekun\Oauth2\Token;

abstract class Token {


    public static function factory($name = 'access', array $options = null)
    {
        $name = ucfirst(strtolower($name));

        $class = '\Chekun\Oauth2\Token\\' . $name . 'Token';

        return new $class($options);
    }


    public function __get($key)
    {
        return $this->$key;
    }


    public function __isset($key)
    {
        return isset($this->$key);
    }
}