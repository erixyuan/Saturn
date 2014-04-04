@extends('sspai2014.layouts.default')

@section('title')
{{$author->metas->nickname}} 的所有文章
@stop

@section('head')
<meta name="description" content="{{$author->metas->nickname}}的文章" />
<meta name="keywords" content="{{$author->metas->nickname}},{{Option::get('site::keywords')}}" />
@stop

@section('container')
    <div class="fn-clear r-container">
        <div class="wrap">
            <!-- 主要部分 m-main START -->
            <div class="m-main">

                <!-- 文章列表模块 -->
                <div class="fn-clear g-box m-post-list">

                    <!-- 文章列表模块-頭部 -->
                    <div class="fn-clear g-box-header">
                        <h5 class="fn-left">
                            {{$author->metas->nickname}} 的所有文章
                        </h5>
                    </div>



                    <div class="block-content">
                        <!-- 头像 -->
                        <div class="avatar">
                            <?php if(!is_null($avatar->avatar)):?>
                                <img src="<?php echo $avatar->avatar->thumbnail_path(['w'=>100,'h'=>100,'c'=>1]); ?>" alt="">
                            <?php else: ?>
                                <img src="<?php echo asset('/resource/img/avatar/default.png'); ?>" alt="">
                            <?php endif; ?>
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
            <!-- 主要部分 m-main END -->

            @include('sspai2014.include.sidebar')

        </div>
    </div>
@stop