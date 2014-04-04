@extends('sspai2014_install.layouts.default')

@section('title')
    @parent
@stop

@section('head')
    @parent
@stop

@section('container')

    <div class="fn-clear r-container">
        <div class="wrap">
            <!-- 主要部分 m-main START -->
            <div class="m-main">

                <!-- 文章內容 START -->
                <div class="fn-clear g-box m-post-view">

                    <h1 class="title">
                        <a href="{{$article->url()}}">{{$article->title}}</a>
                    </h1>

                    <div class="comment-flag">
                        <a href="###">{{$article->comments}}</a>
                    </div>

                    <!-- 文章狀態 -->
                    <div class="fn-clear post-status">

                        <div class="author">
                            <a href='{{url("author/{$article->user_id}")}}' target="_blank">
                                @if ($article->author)
                                    {{$article->author}}
                                @else
                                    {{$article->user->username}}
                                @endif
                            </a>
                        </div>

                        <div class="date">
                            {{date('Y-m-d',$article->published)}}
                        </div>

                        <div class="view">
                            {{$article->views}}
                        </div>

                        <div class="comment">
                            32
                        </div>


                        <div class="edit">
                             @if(Auth::check())
                                <!--有编辑他人权限-->
                                <a href="{{url("edit/{$article->id}")}}">编辑此文</a>
                             @endif
                        </div>

                    </div>


                    <?php if (!empty($article->banner->id)): ?>
                        <!-- 題圖 -->
                        <div class="banner">
                            @if($imgurl = $article->banner_url( array('mw' => 640, 'wm' => 1, 'wmp' => 3) ))
                                <a href="" title="{{{$article->title}}}">
                                    <img src="{{$imgurl}}" alt="{{{$article->title}}}">
                                </a>
                            @endif
                        </div>
                    <?php endif;?>

                    <!-- 正文 -->
                    <div class="typo">
                        {{$article->getContent(array('img_args' => array('mw' => 640, 'wm' => 1, 'wmp' => 3)))}}
                    </div>


                    <!-- 版權 -->
                    <div class="copyright">
                         @if($article->source_name)

                            @if($article->source_name || $article->source_url)
                                <a href="{{$article->source_url}}" title="{{$article->source_name}}" target="_blank">
                                    {{$article->source_name}}
                                </a>
                            @else
                                少数派
                            @endif

                            @if($article->author)
                                ，原作者 {{$article->author}}
                            @endif

                        @else
                            除非特别声明，文章均为 少数派 原创报道，
                        @endif
                        转载请注明原文链接。
                    </div>


                    <!-- 文章分享 -->
                    <div class="fn-clear share">
                        <label>分享:</label>
                        <a href="" class="sina-weibo">新浪微薄</a>
                        <a href="" class="tencent-weibo">騰訊微薄</a>
                        <a href="" class="weixin">微信</a>
                        <a href="" class="yfx-sms">短信分享</a>
                    </div>


                    <div class="fn-clear category">
                        <label>分类:</label>
                        @if(!$article->categories->isEmpty())
                            <a title="查看 {{$article->categories->first()->name}} 分类的所有文章" href="{{$article->categories->first()->url()}}">
                                {{$article->categories->first()->name}}
                            </a>
                        @endif
                    </div>


                    <!-- 文章標籤 -->
                    <div class="fn-clear tag">
                        <label>标签:</label>
                        @foreach ($article->tags as $tag)
                            <a rel="tag" href="{{$tag->url()}}" title="查看所有关于 {{$tag->name}} 的文章">
                                {{$tag->name}}
                            </a>
                        @endforeach
                    </div>


                    <!-- 上一篇，下一篇 -->
                    <div class="fn-clear prev-next-post">
                        @if($next_post = $article->next())
                            <a rel="next" class="prev" href="{{$next_post->url()}}" title="{{$next_post->title}}">{{$next_post->title}}</a>
                        @endif

                        @if($previous_post = $article->previous())
                            <a rel="previous" class="next" href="{{$previous_post->url()}}" title="{{$previous_post->title}}">{{$previous_post->title}}</a>
                        @endif
                    </div>


                    <!-- 相關文章 -->
                    <div class="relation-post">

                    </div>

                </div>
                <!-- 文章內容 END -->

            </div>
            <!-- 主要部分 m-main END -->

            @include('sspai2014_install.include.sidebar')

        </div>
    </div>
@stop