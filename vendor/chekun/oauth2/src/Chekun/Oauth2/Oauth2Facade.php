<?php namespace Chekun\Oauth2;

use Illuminate\Support\Facades\Facade;

class Oauth2Facade extends Facade {

    protected static function getFacadeAccessor() { return 'oauth2'; }

}