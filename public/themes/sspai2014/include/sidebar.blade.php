<!-- 邊欄 -->
<div class="m-sidebar">


    <!-- 小掛件 作者（文章頁顯示） -->
    <?php
    //    ___  __  __________ ______  ___
    //   / _ |/ / / /_  __/ // / __ \/ _ \
    //  / __ / /_/ / / / / _  / /_/ / , _/
    // /_/ |_\____/ /_/ /_//_/\____/_/|_|
    ?>
    @if (isset($article) && $article->id)
    <div class="g-box m-widget m-widget-author">

        <!-- 掛件頭部 -->
        <div class="fn-clear g-box-header ">
            <h5 class="fn-left"><i class="fa fa-user"></i> 用戶信息</h5>
        </div>

        <!-- 掛件內容 -->
        <div class="fn-clear g-box-container">
            <div class="fn-clear author-info">
                <div class="avatar">
                    <?php if(!is_null($article->user->avatar)):?>
                        <img src="<?php echo $article->user->avatar->thumbnail_path(['w'=>100,'h'=>100,'c'=>1]); ?>" alt="">
                    <?php else: ?>
                        <img src="<?php echo asset('/resource/img/avatar/default.png'); ?>" alt="">
                    <?php endif; ?>
                </div>

                <div class="info">
                    <div class="name">
                        <a href="{{$article->user->id}}"></a> {{$article->user->metas->nickname}}
                    </div>

                    <div class="weibo">
                        <a href="{{$article->user->metas->weibo}}" target="_blank">
                            {{$article->user->metas->nickname}}的新浪微博
                        </a>
                    </div>
                </div>
            </div>

            <div class="author-bio">
                {{$article->user->metas->bio}}
            </div>
        </div>
    </div>
    @endif








    <!-- 小掛件 APP應用（文章頁顯示） -->
    <?php
    //    ___   ___  ___
    //   / _ | / _ \/ _ \
    //  / __ |/ ___/ ___/
    // /_/ |_/_/  /_/
    ?>
    @if (isset($article) && ($app=$article->apps->first()))
    <div class="g-box m-widget m-widget-app">

        <!-- 掛件頭部 -->
        <div class="fn-clear g-box-header">
            <h5 class="fn-left">
                <i class="fa fa-info"></i> 应用信息
            </h5>
        </div>

        <!-- 掛件內容 -->
        <div class="fn-clear g-box-container">
            <div class="app-icon">
                @if($icon = $app->icon)
                    <img src="{{$icon->thumbnail_path(['w'=>100,'h'=>100])}}" alt="">
                @endif

            </div>

            <div class="app-name">
                <strong>{{$app->name}}</strong>
            </div>

            <div class="app-category">
                @foreach($app->categories as $category)
                {{$category->name}}
                @endforeach
            </div>

            <div class="app-download">
                @foreach($app->appinfos as $appinfo)
                    <?php
                        // 判斷各種下載市場
                        if(!empty($appinfo->url)) {
                            if ( preg_match("/.*google\.com.*/", $appinfo->url) ) {
                                $market = 'market-coolapk';

                            }elseif ( preg_match("/.*itunes\.apple\.com.*/", $appinfo->url) ) {
                                $market = 'market-itunes';

                            }elseif ( preg_match("/.*gfan\.com.*/", $appinfo->url) ) {
                                $market = 'market-gfan';

                            }else{
                                $market = 'market-none';
                            }
                        }

                    ?>
                    <div class="fn-clear app-links ">
                        <a href="dl/a{{$appinfo->id}}" title="{{$appinfo->hits}}次下载" class="g-btn {{$appinfo->platform}} {{$market}} {{$appinfo->desc}}">
                            <strong>
                                {{$app->name}} for {{$appinfo->platform}}
                            </strong>

                            <span>
                                <?php
                                    if($appinfo->price > 0) {
                                        echo '￥'.$appinfo->price;
                                    }else{
                                        echo "免费";
                                    }
                                ?>
                            </span>
                        </a>

                    </div>
                @endforeach
            </div>

            <div class="app-qr">
                <img src="{{url('qrimage?url='.$article->url().'&size=86')}}" alt="二维码" title="{{$article->url()}}">
            </div>
            <div class="app-qr-tips">
                扫描二维码，通过手机下载该应用。
            </div>
        </div>
    </div>
    @endif








    <!-- 小掛件 資訊 -->
    <?php
    //    _  _______      ______
    //   / |/ / __/ | /| / / __/
    //  /    / _/ | |/ |/ /\ \
    // /_/|_/___/ |__/|__/___/
    ?>

    <?php if(Category::where('slug', 'news')->first()): ?>
    <div class="g-box m-widget m-widget-news">
        <?php
            // 沒用到的參數->orderby('published', 'desc')->status(Article::S_PUBLISHED)->distinct()
            // 先取分類。
            // 後取分類下的文章，這裡取10篇 :TODO: 這裡能不能只取發佈的
            $categories = Category::where('slug', 'news')->first();
            $posts = $categories->articles()->take(6)->orderBy('published','desc')->get();
        ?>

        <!-- 掛件頭部 -->
        <div class="fn-clear g-box-header">
            <h5 class="fn-left">
                <!-- 更具上面的分類取值，獲取分類標題 -->
                <i class="fa fa-rss"></i> {{$categories->name}}
            </h5>
        </div>

        <!-- 掛件內容 -->
        <div class="fn-clear g-box-container">
            <ul class="g-list">
                @foreach($posts as $post)
                <li class="fn-clear">
                    <a href="{{$post->url()}}">
                        {{$post->title}}
                    </a>

                    <span><?php echo helper::time_tran_day($post->published); ?></span>
                </li>
                @endforeach
            </ul>
        </div>
    </div>
    <?php endif; ?>

</div>