<div class="r-header">
    <div class="top">
        <div class="wrap">
            <a href="#" class="m-logo">少数派</a>
        </div>
    </div>
    <div class="bottom">
        <!-- Logo 只在电脑版置顶模式的时候才显示 内容为手机版的Logo的图形部分-->
        <a href="#" class="m-logo">少数派</a>

        <ul class="menu imp">
            <li><a class="header-text cat-home" href="##">首页</a></li>
            {{-- */$categories = Category::type('subject')->index()->get();/* --}}
            @foreach($categories as $c)
            <li class="{{isset($cate)&&($c->id==$cate->id)?'active':''}}"><a class="header-text cat-{{$c->slug}}" href="{{$c->url()}}">{{$c->name}}</a></li>
            @endforeach
        </ul>

        <a href="##" class="more" id="js-mobile-btn-menu">更多</a>
        <!-- 手机里的更多菜单 桌面表现为和普通菜单一样 -->
        <div class="mobile-ext-menu">
            <div class="menu-content" id="js-mobile-nav-content">
                <ul class="menu ext">
                    <li>

                    </li>
                </ul>
                <!-- 功能菜单 -->
                <div class="func">
                    <!-- 社交链接 -->
                    <ul class="social-links">
                        <li><a href="http://weibo.com/sspaime" target="_blank" class="sina fixpng-bg" title="在新浪微博关注少数派">新浪</a></li>
                        <li><a href="#" class="rss fixpng-bg" title="少数派RSS地址">RSS</a></li>
                        <li><a href="#" class="weixin fixpng-bg" id="js-header-qrcode">微信</a></li>
                    </ul>

                    <!-- 搜索框 -->
                    <form action="{{url('search')}}" method="POST" class="search-box">
                        <div class="g-input-combo">
                            <input type="text" name="keyword" id="keywords" class="input-text" placeholder="搜索…" value=""/>
                            <button class="g-btn g-btn-danger">搜索</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
