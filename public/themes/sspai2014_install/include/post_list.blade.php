@foreach ($articles as $article)
<li>


    <!-- 標題 -->
    <h2 class="title">
        <a href="{{$article->url()}}">{{{$article->title}}}</a>
    </h2>




    <?php if (!empty($article->banner->id)): ?>
        <!-- 題圖 -->
        <div class="thumb">
            @if($imgurl = $article->banner_url( array('mw' => 640, 'wm' => 1, 'wmp' => 3) ))
                <a href="{{$article->url()}}">
                    <img src="{{$article->banner_url( array('mw' => 640) )}}" alt="{{{$article->title}}}">
                </a>
            @endif
        </div>
    <?php endif;?>




    <!-- 分類 -->
    @if(!$article->categories->isEmpty())
    <div class="category {{$article->categories->first()->slug}}">
        <a title="查看 {{$article->categories->first()->name}} 分类的所有文章" href="{{--$article->categories->url()--}}">
            {{$article->categories->first()->name}}
        </a>
    </div>
    @endif


    <!-- 引言 -->
    <div class="intor">
        {{{$article->description}}}
    </div>


    <!-- 狀態 -->
    <div class="fn-clear post-status">
        <!-- 作者 -->
        <div class="author">
            <!--如果有是投稿，就顯示投稿用戶，不然就顯示本站編輯-->
            <a href="{{url("author/{$article->user_id}")}}" target="_blank" >
                @if ($article->author)
                    {{$article->author}}
                @else
                    {{{$article->username}}}
                @endif
            </a>
        </div>

        <!-- 瀏覽量 -->
        <div class="view">
            {{$article->views}}
        </div>

        <!-- 評論數 -->
        <div class="comment">
            <a href="{{$article->url()}}">
                 {{$article->comments}}
            </a>
        </div>

        <?php if(0): ?>
            <!-- 日期 -->
            <div class="date">
                {{date('Y-m-d',$article->published)}}
            </div>
        <?php endif; ?>

        @if(Auth::check())
            @if(Auth::user()->can('submit_others_article') || $article->user_id == Auth::user()->id )
                <!-- 編輯 -->
                <div class="edit">
                    <a href="{{url("edit/{$article->id}")}}">编辑</a>
                </div>
            @endif
        @endif
    </div>


</li>
@endforeach