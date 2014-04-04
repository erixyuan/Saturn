@extends('sspai.layouts.master')

@section('title')
@parent
@stop

@section('head')
@parent
@stop

@section('main')
    <!-- 頁中內容 START -->
    <div class="m-content">
        <ul  class="m-post-list">
            @include('sspai.posts')
        </ul>

        <div class="m-pages">
            {{$articles->links()}}
        </div>
    </div>
    <!-- 頁中內容 END -->
@stop