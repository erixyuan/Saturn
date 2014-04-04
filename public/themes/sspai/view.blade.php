@extends('sspai.layouts.master')

@section('title')
{{$article->title}} | 
@parent
@stop

@section('head')
<meta name="description" content="{{{$article->description}}}" />
<meta name="keywords" content="{{implode(',', $article->tags()->lists('name'))}}" />
@stop

@section('main')

<div class="w-main">

    <div class="m-post" id="post_{{$article->id}}" data-url="{{$article->url()}}">

        <!-- 评论数 -->
        <a href="{{$article->url()}}#js-weibo-comments" class="comment-count" id="js-goto-comment-box" title="《{{$article->title}}》上的评论" no-scroll>
            {{$article->comments}}
        </a>



        <!-- 标题 -->
        <h1 class="post-title">
            <a href="{{$article->url()}}">{{$article->title}}</a>
        </h1>

        <!-- 文章信息 -->
        <div class="meta">
            <!-- 作者链接 -->
            <a href='{{url("author/{$article->user_id}")}}' target="_blank" class="author">
                @if ($article->author)
                {{$article->author}}
                @else
                {{$article->user->username}}
                @endif
            </a>


            <!-- 多少天前 -->
            <span class="date">
                {{date('Y-m-d,H:i',$article->published)}}
            </span>


            <!-- 分类 -->
            @if(!$article->categories->isEmpty())
            <a title="查看 {{$article->categories->first()->name}} 分类的所有文章" class="category {{$article->categories->first()->slug}}" href="{{--$article->categories->url()--}}">
                发布于 {{$article->categories->first()->name}}
            </a>
            @endif

            <!-- 浏览数 -->
            <span class="views">热度：{{$article->views}}</span>

            @if(Auth::check())
            <!--有编辑他人权限-->
            / <a href="{{url("edit/{$article->id}")}}">编辑此文</a>
            @endif
        </div>




        @if($imgurl = $article->banner_url( array('mw' => 640, 'wm' => 1, 'wmp' => 3) ))
        <div class="banner">
            <a href="" title="{{{$article->title}}}">
                <img src="{{$imgurl}}" alt="{{{$article->title}}}">
            </a>
        </div>
        @endif



        <!-- 文章导航 -->
        <div class="post-inner-nav-top">
        </div>



        <div class="typo">
            {{$article->getContent(array('img_args' => array('mw' => 640, 'wm' => 0),'page'=>Input::get('page')))}}
        </div>

        @if ($pageinfo = $article->pageinfo(1))
        <div class="m-pages">
            @include('sspai.pager')
        </div>
        @endif
        <script type="text/javascript">
            // 延迟加载
            jQuery(document).ready(function($) {
                $(".typo img").lazyload({
                    effect: "fadeIn",
                    placeholder: "http://sspai.com/resource/_img/empty.gif"
                });
            });
        </script>
        <!-- 文章结束线 -->
        <div class="end-content-line"></div>





        @if(0)
        <!-- :TODO: 更多截图 需完善 -->

        <div class="screenshots">
        </div>
        @endif


        <!-- 文章导航 -->
        <div class="post-inner-nav-bottom">
            ????
        </div>



        <!-- 版权 -->
        <!-- 文章来源 [站名带链接]，原作者 [作者名] -->
        <div class="copyright">
            <span class="icon-copyright"></span>
            文章来源
            @if($article->source_name)

            @if($article->source_name || $article->source_url())
            <a href="{{$article->source_url()}}" title="{{$article->source_name}}" target="_blank">
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

        <!-- 分享 -->
        <div class="func-share">


        </div>


        <!-- 这个是短信分享的表单 -->
        <!-- 下面的webSrc可能会根据不同的页面做更换 -->
        <form>
        </form>





        <!-- 标签 -->
        <div class="tags">
            <label>标签:</label>

            @foreach ($article->tags as $tag)
            <a rel="tag" href="{{$tag->url()}}" title="查看所有关于 {{$tag->name}} 的文章">
                {{$tag->name}}
            </a>
            @endforeach

        </div>



        <!-- 上一篇文章和下一篇文章 -->
        <div class="post-nav">
            @if($next_post = $article->next())
            <a rel="next" class="prev" href="{{$next_post->url()}}">{{$next_post->title}}</a>
            <div class="inner">
                <img src="{{$next_post->banner_url( array('w' => 184, 'h' => 90) )}}" alt="{{$next_post->title}}" class="thumb">
                <div class="info">
                    <div class="date">{{date('Y-m-d,H:i',$next_post->published)}}</div>
                    <h4>{{$next_post->title}}</h4>
                </div>
            </div>
            @endif

            @if($previous_post = $article->previous())
            <a rel="previous" class="next" href="{{$previous_post->url()}}">{{$previous_post->title}}</a>
            <div class="inner">
                <img src="{{$previous_post->banner_url( array('w' => 184, 'h' => 90) )}}" alt="{{$previous_post->title}}" class="thumb">
                <div class="info">
                    <div class="date">{{date('Y-m-d,H:i',$previous_post->published)}}</div>
                    <h4>{{$previous_post->title}}</h4>
                </div>
            </div>
            @endif
        </div>



        <!-- 无觅 -->
        <div class="wumi fn-hide-mobile">
            <!-- 无觅的代码开始 -->
            <script type="text/javascript" id="wumiiRelatedItems"></script>
            <script type="text/javascript">
                var wumiiPermaLink = "http://sspai.com/{{$article->url()}}"; //请用代码生成文章永久的链接
                var wumiiTitle = "{{$article->title}}"; //请用代码生成文章标题
                var wumiiTags = "????"; //请用代码生成文章标签，以英文逗号分隔，如："标签1,标签2"
                var wumiiCategories = ["????"]; //请用代码生成文章分类，分类名放在 JSONArray 中，如: ["分类1", "分类2"]
                var wumiiSitePrefix = "http://sspai.com/";
                var wumiiParams = "&num=5&mode=2&pf=JAVASCRIPT";
            </script>
            <script type="text/javascript" src="http://widget.wumii.cn/ext/relatedItemsWidget"></script>
            <a href="http://www.wumii.com/widget/relatedItems" style="border:0;">
                <img src="http://static.wumii.cn/images/pixel.png" alt="无觅相关文章插件，快速提升流量" style="border:0;padding:0;margin:0;" />
            </a>
            <!-- 无觅的代码结束 -->
        </div>



    </div>
    <!-- 文章 END -->

</div>










<div class="m-sidebar">





    <!-- 作者信息 START-->
    <!-- 作者信息 END -->






    <!-- 应用信息 START -->
    <!-- 应用信息 END -->






    <!-- 最新资讯 START -->
    <div class="m-widget list-textlink">
        <h4>
            <span class="title-icon-rss"></span>
            资讯
            <a href="/category/news" class="more">更多</a>
        </h4>
        <ul>
            <li><a href="/24822">太空射击新贵？Star Horizon最新官方预告片</a></li>
            <li><a href="/24824">解谜冒险游戏《火星矿藏Mines of Mars》 本周正式上架</a></li>
            <li><a href="/24815">传闻被证实！苹果发布iOS车载系统 Apple Carplay 官方网站</a></li>
            <li><a href="/24808">未上市即遭破解！Nokia X已成功移植安装Google Now Launcher</a></li>
            <li><a href="/24807">《真·女神转生》英文版即将上线：再也不用担心看不懂蝌蚪文</a></li>
        </ul>
    </div>
    <!-- 最新资讯 END -->






    <!-- 最新评测 START-->
    <div class="m-widget list-applink">
        <h4>
            <span class="title-icon-labs"></span>
            近期评测
            <a href="/category/review" class="more">更多</a>
        </h4>
        <ul>
            <li>
                <a href="/24796">
                    <img src="/thumbs/2014/02/27/28194420d152fc4353d4e819bfc0c352_w_55_h_55.png" alt="食色" class="app-icon">
                    <h5>食色</h5>
                    <div class="meta">
                        <!-- 排序 -->
                        <div class="rating">
                            <div class="count c-9"></div>
                        </div>

                        <!-- 下载链接 -->
                        <div class="list-dowload">
                            <span class="ios">iPhone</span>
                        </div>
                    </div>



                </a>
            </li>
            <li>
                <a href="/24750">
                    <img src="/thumbs/2014/02/25/701e9370540bb6b2757fd8f9092009ca_w_55_h_55.png" alt="Timery计时器" class="app-icon">
                    <h5>Timery计时器</h5>
                    <div class="meta">
                        <!-- 排序 -->
                        <div class="rating">
                            <div class="count c-8"></div>
                        </div>

                        <!-- 下载链接 -->
                        <div class="list-dowload">
                            <span class="android">Android</span>
                        </div>
                    </div>



                </a>
            </li>
            <li>
                <a href="/24760">
                    <img src="/thumbs/2014/02/21/92921faf3e4e9172f901d3f2c264a9c5_w_55_h_55.png" alt="Phoster" class="app-icon">
                    <h5>Phoster</h5>
                    <div class="meta">
                        <!-- 排序 -->
                        <div class="rating">
                            <div class="count c-10"></div>
                        </div>

                        <!-- 下载链接 -->
                        <div class="list-dowload">
                            <span class="ios">iPhone</span>
                        </div>
                    </div>



                </a>
            </li>
            <li>
                <a href="/24738">
                    <img src="/thumbs/2014/02/21/135c8d1b2160644b0b8eda3c0163a2d6_w_55_h_55.png" alt="Smooth" class="app-icon">
                    <h5>Smooth</h5>
                    <div class="meta">
                        <!-- 排序 -->
                        <div class="rating">
                            <div class="count c-8"></div>
                        </div>

                        <!-- 下载链接 -->
                        <div class="list-dowload">
                            <span class="android">Android</span>
                        </div>
                    </div>



                </a>
            </li>
            <li>
                <a href="/24725">
                    <img src="/thumbs/2014/02/15/e3668c4b232ab6fabc71ff3214345cef_w_55_h_55.png" alt="Unread" class="app-icon">
                    <h5>Unread</h5>
                    <div class="meta">
                        <!-- 排序 -->
                        <div class="rating">
                            <div class="count c-10"></div>
                        </div>

                        <!-- 下载链接 -->
                        <div class="list-dowload">
                            <span class="ios">iPhone</span>
                        </div>
                    </div>



                </a>
            </li>
        </ul>
    </div>
    <!-- 最新评测 END -->





    <!-- 热门推荐 START -->
    <div class="m-widget list-thumblink">
        <h4><span class="title-icon-heart"></span>热门</h4>
        <ul>
            <li>
                <a href="/24777">
                    <img src="http://sspai.com/thumbs/2014/02/24/33349e909eba71677299d2fc97e158b7_w_250_h_122.jpg" width="250" alt="iPad 变身 ThinkPad：Table 2 蓝牙键盘测评iPad 变身 ThinkPad：Table 2 蓝牙键盘测评">
                    <strong>
                        iPad 变身 ThinkPad：Table 2 蓝牙键盘测评                    </strong>
                </a>
            </li>
            <li>
                <a href="/24750">
                    <img src="http://sspai.com/thumbs/2014/02/20/0942c6adb3fe9940fb93128ffbe8da8c_w_250_h_122.png" width="250" alt="让时间的流动优雅起来：Timery让时间的流动优雅起来：Timery">
                    <strong>
                        让时间的流动优雅起来：Timery                    </strong>
                </a>
            </li>
            <li>
                <a href="/24729">
                    <img src="http://sspai.com/thumbs/2014/02/25/cde10036088c0b7354dcc9ae662f154d_w_250_h_122.png" width="250" alt="6144! 看高玩妹子的 Threes! 高分攻略与心得6144! 看高玩妹子的 Threes! 高分攻略与心得">
                    <strong>
                        6144! 看高玩妹子的 Threes! 高分攻略与心得                    </strong>
                </a>
            </li>
            <li>
                <a href="/24721">
                    <img src="http://sspai.com/thumbs/2014/02/23/f06283e88eb8240594aa620b2fdac0e7_w_250_h_122.jpg" width="250" alt="简约清新的Twitter客户端：Twitterrific 5简约清新的Twitter客户端：Twitterrific 5">
                    <strong>
                        简约清新的Twitter客户端：Twitterrific 5                    </strong>
                </a>
            </li>
        </ul>
    </div>
    <!-- 热门推荐 END -->

    <div class="sidebar-color">
        <a href="http://sspai.com/submit" target="_blank">
            <img src="/themes/sspai2014/_res/img/pic_join-me.png" alt="">
        </a>
    </div>







</div>





<!-- 手机用的悬浮跳转到APP栏位置用的图标 -->
<a href="#js-widget-appinfo" id="js-goto-app" class="m-mobile-fixed-app-icon">
    <img src="????" alt="????">
</a>

<!-- 中栏结束 -->


@stop



























