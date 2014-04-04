@foreach ($articles as $article)

<li class="m-post desktop-post" id="post_{{$article->id}}">

    <div class="m-post-header">
        <!-- 大标题前的文章分类，带颜色的。 -->
        @if(!$article->categories->isEmpty())
        <div class="catecolor {{$article->categories->first()->slug}}">
            <a title="查看 {{$article->categories->first()->name}} 分类的所有文章" href="{{--$article->categories->url()--}}">
                {{$article->categories->first()->name}}
            </a>
        </div>
        @endif

        <h1 class="title">
            <a href="{{$article->url()}}">{{{$article->title}}}</a>
        </h1>

        <!-- 文章留言条数 -->
        <div class="m-post-comnum">
            <a title="《{{{$article->title}}}》上的评论" class="num" href="{{$article->url()}}">
                <span class="ds-thread-count" data-thread-key="{{$article->id}}" data-lcount-type="comments">{{$article->comments}}</span>
            </a>
        </div>

        <div class="meta">
            <!--如果有是投稿，就顯示投稿用戶，不然就顯示本站編輯-->
            <a href="{{url("author/{$article->user_id}")}}" target="_blank" >
                @if ($article->author)
                {{$article->author}}
                @else
                {{{$article->username}}}
                @endif
            </a> /


            阅读: {{$article->views}} /
            <span class="time">{{date('Y-m-d,H:i',$article->published)}}</span>
            @if(Auth::check())
            @if(Auth::user()->can('submit_others_article') || $article->user_id == Auth::user()->id )
            <!--有编辑他人权限-->
            / <a href="{{url("edit/{$article->id}")}}">编辑此文</a>
            @endif
            @endif
        </div>
    </div>


    <div class="m-post-main">
        <div class="paper">
            <div class="banner">
                <a href="" title="{{{$article->title}}}">
                    <img src="{{$article->banner_url( array('mw' => 640, 'wm' => 1, 'wmp' => 3) )}}" alt="{{{$article->title}}}">
                </a>
            </div>

            @if (!$article->apps->isEmpty())
            <!-- 软件信息栏开始 -->
            @foreach ($article->apps as $app)
            <!-- 软件信息栏-->
            @include('sspai.appinfo')
            @endforeach
            <!-- 软件信息栏结束 -->
            @endif

            <div class="text">
                {{{$article->description}}}
            </div>
        </div>
    </div>

    <!-- 文章尾部 START -->
    <div class="m-post-footer">

        <div class="post-more">
            <!-- 文章分享 -->
        </div>
    </div>
    <!-- 文章尾部 END -->
</li>

@endforeach
