<?php namespace Chekun\Oauth2\Token;


class AccessToken extends Token {

    protected $accessToken = '';

    protected $expires = 0;

    protected $refreshToken = '';

    protected $uid = '';

    public function __construct(array $options = null)
    {
        if ( ! isset($options[$options['access_token_key']]))
        {
            throw new \Exception('Required option not passed: access_token'.PHP_EOL.print_r($options, true));
        }

        // if ( ! isset($options['expires_in']) and ! isset($options['expires']))
        // {
        // 	throw new \Exception('We do not know when this access_token will expire');
        // }
		
        $this->accessToken = $options[$options['access_token_key']];

        isset($options[$options['uid_key']]) and $this->uid = $options[$options['uid_key']];

        isset($options['x_mailru_vid']) and $this->uid = $options['x_mailru_vid'];

        isset($options['expires_in']) and $this->expires = time() + ((int) $options['expires_in']);

        isset($options['expires']) and $this->expires = time() + ((int) $options['expires']);

        isset($options['refresh_token']) and $this->refreshToken = $options['refresh_token'];
    }

    public function __toString()
    {
        return (string) $this->accessToken;
    }
}