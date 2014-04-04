@extends('sspai.layouts.master')

@section('title')
login
@stop

@section('head')
@stop

@section('main')
<form action="{{url()}}" method="POST">
    <div class="logo">
        Saturn
    </div>

    <div class="section">
        <div class="field username">
            <input type="text" class="input-text" name="username" id="js_username" placeholder="用戶名"/>
        </div>

        <div class="field password">
            <input type="password" class="input-text" name="passpword" id="js_password" placeholder="密碼"/>
        </div>

        <div class="field submit">
            <input type="button" class="g-btn g-btn-primary g-btn-block" value="登录" name="username" id="js_loginBtn"/>
        </div>

        <a href="{{url('loginwb')}}">用微博登陆</a>
        <div class="field help">
            <a href="##">需要幫助？</a>
        </div>
    </div>


</form>
@stop