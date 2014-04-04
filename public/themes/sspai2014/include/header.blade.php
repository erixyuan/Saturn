<div class="fn-clear r-header">


        <?php
        //    _  _____ _   __        __________  ___
        //   / |/ / _ | | / / ____  /_  __/ __ \/ _ \
        //  /    / __ | |/ / /___/   / / / /_/ / ___/
        // /_/|_/_/ |_|___/         /_/  \____/_/
        ?>
        <!-- 頂部狀態，TOP部分  -->
        <div class="fn-clear m-nav-top">
            <div class="wrap">

                <!-- 標誌 -->
                <div class="m-logo">
                    <a href="{{asset('/')}}" class="m-logo">少数派</a>
                </div>


                <div class="m-function">

                    <!-- 關注我們，鼠標hover上去會觸發事件 -->
                    <ul class="g-list m-fllow-our">
                        <li><a href="http://weibo.com/sspaime" target="_blank" class="sina fixpng-bg" title="在新浪微博关注少数派">新浪</a></li>
                        <li><a href="{{asset('/feed')}}" class="rss fixpng-bg" title="少数派RSS地址">RSS</a></li>
                        <li><a href="#" class="weixin fixpng-bg" id="js-header-qrcode">微信</a></li>
                    </ul>

                    <!-- 搜尋功能 -->
                    <form action="{{url('search')}}" method="POST" class="m-search search-box">
                        <div class="g-input-combo">
                            <input type="text" name="keyword" id="keywords" class="input-text" placeholder="搜索…" value=""/>
                            <button class="g-btn g-btn-danger">搜索</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>



        <?php
        //    _  _____ _   __        ___  ____  ________________  __  ___
        //   / |/ / _ | | / / ____  / _ )/ __ \/_  __/_  __/ __ \/  |/  /
        //  /    / __ | |/ / /___/ / _  / /_/ / / /   / / / /_/ / /|_/ /
        // /_/|_/_/ |_|___/       /____/\____/ /_/   /_/  \____/_/  /_/
        ?>
        <!-- 頂部狀態，BOTTOM部分 -->
        <div class="fn-clear m-nav-bottom">
            <div class="wrap">

                <?php
                    // 如果加入"->index()"，就根據 後臺分類 過濾未選中的分類
                    //
                    //本來$categories = 0 ~ 8，9個, 先輸出前5個。 文章第一个分类 $article->categories->first()->id
                    //
                    // 标题分类 $cate->id
                    //
                    // 导航条所有分类 $categories[$m_nav_num]->id

                    $categories = Category::type('subject')->index()->get();
                    $m_nav_count = count($categories);
                    $m_nav_num = 0;
                ?>


                <?php if($m_nav_count > 8 ): ?>


                    <!-- 導航條 -->
                    <ul class="g-list m-nav">
                        <li><a class="header-text cat-home" href="{{asset('/')}}">首页</a></li>

                        @for ($m_nav_num; $m_nav_num <= 2; $m_nav_num++)
                            <li class="{{$categories[$m_nav_num]->slug}}
                                {{
                                    (isset($cate) && ($categories[$m_nav_num]->id == $cate->id))
                                    ||
                                    (isset($article) && ($categories[$m_nav_num]->id == $article->categories->first()->id))
                                    ?
                                    'active':''
                                }}
                            ">
                                <a class="header-text cat-{{$categories[$m_nav_num]->slug}}" href="{{$categories[$m_nav_num]->url()}}">
                                    {{$categories[$m_nav_num]->name}}

                                </a>
                            </li>
                        @endfor
                    </ul>


                    <!-- 導航條2，本來只有一個m-nav即可，m-nav-ext收縮在手機辦上，作爲「更多」按鈕出現。 -->
                    <ul class="g-list m-nav-ext">
                        {{-- 輸出剩下的 --}}
                        @for ($m_nav_num; $m_nav_num < (count($categories)); $m_nav_num++)
                            <li class="
                                {{$categories[$m_nav_num]->slug}}
                                {{
                                    (isset($cate) && ($categories[$m_nav_num]->id == $cate->id))
                                    ||
                                    (isset($article) && ($categories[$m_nav_num]->id == $article->categories->first()->id))
                                    ?
                                    'active':''
                                }}
                            ">
                                <a class="header-text cat-{{$categories[$m_nav_num]->slug}}" href="{{$categories[$m_nav_num]->url()}}">
                                    {{$categories[$m_nav_num]->name}}
                                </a>
                            </li>
                        @endfor
                    </ul>


                <?php else: ?>

                   <!-- 導航條 -->
                    <ul class="g-list m-nav">
                        <li><a class="header-text cat-home" href="{{asset('/')}}">首页</a></li>

                        @for ($m_nav_num; $m_nav_num < $m_nav_count; $m_nav_num++)
                            <li class="{{$categories[$m_nav_num]->slug}}
                                {{
                                    (isset($cate) && ($categories[$m_nav_num]->id == $cate->id))
                                    ||
                                    (isset($article) && ($categories[$m_nav_num]->id == $article->categories->first()->id))
                                    ?
                                    'active':''
                                }}
                            ">
                                <a class="header-text cat-{{$categories[$m_nav_num]->slug}}" href="{{$categories[$m_nav_num]->url()}}">
                                    {{$categories[$m_nav_num]->name}}

                                </a>
                            </li>
                        @endfor
                    </ul>


                <?php endif; ?>










            </div>
        </div>

</div>