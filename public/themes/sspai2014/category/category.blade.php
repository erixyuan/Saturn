@extends('sspai2014.layouts.default')

@section('title')
    @parent
@stop

@section('head')
    @parent
@stop


@section('container')
        <!-- ■■■■■ 主體 CONTAINER START -->
        <div class="fn-clear r-container">

            <div class="wrap">

                <!-- 主要部分 -->
                <div class="m-main">

                    <!-- 文章列表模块 -->
                    <div class="fn-clear g-box m-post-list">

                        <!-- 文章列表模块-頭部 -->
                        <div class="fn-clear g-box-header">
                            <h5 class="fn-left">
                                最新推荐
                            </h5>
                        </div>

                        <!-- 文章列表模块-內容 -->
                        <div class="fn-clear g-box-container">
                            <ul class="g-list">
                                @include('sspai2014.include.post_list')
                            </ul>
                        </div>

                        <div class="m-pager">
                            {{$articles->links()}}
                        </div>

                    </div>

                </div>

                @include('sspai2014.include.sidebar')

            </div>
        </div>
        <!-- ■■■■■ 主體 CONTAINER END -->



@stop