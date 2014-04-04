@extends('sspai.layouts.master')

@section('title')
文章归档 | 
@parent
@stop

@section('head')
@parent
@stop

@section('main')
<div class="w-main">
    <div class="m-block m-post-list">
        <h2>
            <span class="title-icon-tasks"></span>
            文章归档
        </h2>
        <ul class="block-content" style="padding: 0 20px; margin-top: 0px;">
            @foreach ($articles_by_month as $month=>$as)
            <h2>{{date('Y年m月', $month)}}</h2>
            <ul>
            @foreach ($as as $subject)
            <li style="margin: 5px 0;">
                <a href="{{$subject->url()}}">
                    {{$subject->title}}
                </a>
            </li>
            @endforeach
            </ul>
            @endforeach
        </ul>


    </div>
    <!-- 文章列表模块结束 -->
</div>
@stop