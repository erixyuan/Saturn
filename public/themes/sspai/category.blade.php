@extends('sspai.layouts.master')

@section('title')
「{{$cate->name}}」分类 | 
@parent
@stop

@section('head')
@parent
@stop

@section('main')
<div class="w-main">

    <!-- 文章列表 -->
    <div class="m-block m-post-list">
        <h2><span class="title-icon-arrow"></span>{{$cate->name}} </h2>

        <!-- 过滤器 -->
        <div class="m-filter">
            <label>筛选机型：</label>
            <a class="{{empty($subtag)?'active':''}}" href="{{url()}}">所有机型</a>
            <a class="{{is_array($subtag)&&in_array('android',$subtag)?'active':''}}" href="{{Request::url().'?subtag=Android'}}">Android</a>
            <a class="{{is_array($subtag)&&in_array('ios',$subtag)?'active':''}}" href="{{Request::url().'?subtag=iOS,iPhone,iPad'}}">IOS</a>
            <a class="{{is_array($subtag)&&in_array('windows phone',$subtag)?'active':''}}" href="{{Request::url().'?subtag=Windows Phone'}}">Windows Phone</a>
        </div>
        <!-- 頁中內容 START -->
        <ul class="block-content">
            @include('sspai.posts')
        </ul>
        <!-- 文章列表结束 -->
        <!-- 翻页器 -->
        @if($subtag)
        {{$articles->appends('subtag',implode(',',$subtag))->links()}}
        @else
        {{$articles->links()}}
        @endif
    </div>
</div>
@stop