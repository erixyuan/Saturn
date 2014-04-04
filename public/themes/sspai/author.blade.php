@extends('sspai.layouts.master')

@section('title')
{{$author->metas->nickname}} 的所有文章 | 
@parent
@stop

@section('head')
<meta name="description" content="{{$author->metas->nickname}}的文章" />
<meta name="keywords" content="{{$author->metas->nickname}},{{Option::get('site::keywords')}}" />
@stop

@section('main')
<div class="w-main">
    <div class="m-block m-author">
        <h2><span class="title-icon-arrow"></span>{{$author->metas->nickname}}的文章</h2>
        <div class="block-content">
            <!-- 头像 -->
            <div class="avatar">
                <img src="{{--$author->getAvatarURL('m')--}}" alt="{{$author->metas->nickname}}">
            </div>
            <!-- 作者信息 -->
            <div class="info">
                <!--昵称 -->
                <h5>{{$author->metas->nickname}}</h5>
                <!-- 等级-->
                <i>

                    <!-- 职业 -->
                    @if ($role = $author->roles->first())
                    <span class="lv"> {{$role->display_name}}</span>
                    @if ($author->metas&&$author->metas->job)
                    <span class="lv"> / {{$author->metas->job}}</span>
                    @endif
                    @endif

                    <div class="social-link">
                        @if ($author->metas&&$author->metas->site)
                        <a class="icon-sina-weibo" target="_blank" href="{{$author->metas->site}}">新浪微博</a>
                        @endif
                    </div>
                </i>

                <p class="bio">
                    {{$author->metas->bio or null}}
                </p>
            </div>

            <div class="post-count">
                <span class="icon-book"></span>
                <span class="num">{{$articles->getTotal()}}</span>篇文章
            </div>

        </div>
    </div>

    <div class="m-block m-post-list">
        <!-- 頁中內容 START -->
        <ul class="block-content">
            @include('sspai.posts')
        </ul>
        <!-- 文章列表结束 -->
        <!-- 翻页器 -->
        {{$articles->links()}}
    </div>
    <!-- 文章列表模块结束 -->
</div>
@stop