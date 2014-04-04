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

            </div>
        </div>

</div>