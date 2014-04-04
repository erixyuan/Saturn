<?php namespace Chekun\Oauth2\Token;

class AuthorizeToken extends Token {

    protected $code = '';

    protected $redirectUri = '';

    public function __construct(array $options)
    {
        if ( ! isset($options['code'])) {
            throw new \Exception('Required option not passed: code');
        } elseif ( ! isset($options['redirect_uri'])) {
            throw new \Exception('Required option not passed: redirect_uri');
        }
        $this->code = $options['code'];
        $this->redirectUri = $options['redirect_uri'];
    }

    public function __toString()
    {
        return (string) $this->code;
    }

}