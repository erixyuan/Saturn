# Oauth2 For Laravel 4

将下面一行加入app.providers

```
'Chekun\Oauth2\Oauth2ServiceProvider'
```

将下面一行加入app.aliases

```
'Oauth2'         => 'Chekun\Oauth2\Oauth2Facade'
```

使用方法

```
$provider = Oauth2::make('weibo');
```

> 本程序也可以用在其他框架和普通PHP下.
