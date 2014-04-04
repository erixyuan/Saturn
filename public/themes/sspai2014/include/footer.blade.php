<div class="fn-clear r-footer">



        <!-- 鏈接部分 -->
        <div class="fn-clear links">
            <div class="wrap">

                <?php
                //    __ ______  _________  ___   ___  _______
                //   / // / __ \/_  __/ _ \/ _ | / _ \/ __/ _ \
                //  / _  / /_/ / / / / ___/ __ |/ ___/ _// , _/
                // /_//_/\____/ /_/ /_/  /_/ |_/_/  /___/_/|_|
                ?>

                <?php if(Ad::where('key','sspai_footer_hottopic')->first()): ?>
                <!-- 熱門文章 -->
                <div class="m-section m-section-hottopic">
                    <?php
                        $ads = Ad::where('key','sspai_footer_hottopic')->first();
                     ?>

                    <!-- 掛件頭部 -->
                    <div class="fn-clear m-section-header">
                        <h5 class="">{{$ads->name}}</h5>
                    </div>

                    <!-- 掛件內容 -->
                    <div class="fn-clear m-section-container">
                        <ul class="g-list g-list-ul">
                            @if(isset($ads->items)&&is_array($ads->items))
                                @foreach($ads->items as $i)
                                    <li>
                                        <a href="{{$i['link']}}">
                                            {{$i['title']}}
                                        </a>
                                    </li>
                                @endforeach
                            @endif
                        </ul>
                    </div>
                </div>
                <?php endif; ?>



                <?php
                //    _______  _________  _____  ____
                //   / __/ _ \/  _/ __/ |/ / _ \/ __/
                //  / _// , _// // _//    / // /\ \
                // /_/ /_/|_/___/___/_/|_/____/___/
                ?>
                <?php if(Ad::where('key','sspai_footer_links')->first()): ?>
                <!-- 友情鏈接 -->
                <div class="m-section m-section-friends">
                    <?php
                        $ads = Ad::where('key','sspai_footer_links')->first();
                     ?>

                    <!-- 掛件頭部 -->
                    <div class="fn-clear m-section-header">
                        <h5 class="">{{$ads->name}}</h5>
                    </div>

                    <!-- 掛件內容 -->
                    <div class="fn-clear m-section-container">
                        <ul class="g-list g-list-ul">
                            @if(isset($ads->items)&&is_array($ads->items))
                                @foreach($ads->items as $i)
                                    <li>
                                        <a href="{{$i['link']}}">
                                            {{$i['title']}}
                                        </a>
                                    </li>
                                @endforeach
                            @endif
                        </ul>
                    </div>
                </div>
                <?php endif; ?>


                <?php
                //    ___   ___  ____  __  ________
                //   / _ | / _ )/ __ \/ / / /_  __/
                //  / __ |/ _  / /_/ / /_/ / / /
                // /_/ |_/____/\____/\____/ /_/
                ?>
                <?php if(Ad::where('key','sspai_footer_mobile')->first()): ?>
                <!-- 關於我們 -->
                <div class="m-section m-section-about fn-right">
                    <?php
                        $ads = Ad::where('key','sspai_footer_mobile')->first();
                     ?>

                    <!-- 掛件頭部 -->
                    <div class="fn-clear m-section-header">
                        <h5 class="">{{$ads->name}}</h5>
                    </div>

                    <!-- 掛件內容 -->
                    <div class="fn-clear m-section-container">
                        <ul class="g-list g-list-ul">
                            @if(isset($ads->items)&&is_array($ads->items))
                                @foreach($ads->items as $i)
                                    <li>
                                        <a href="{{$i['link']}}">
                                            {{$i['title']}}
                                        </a>
                                    </li>
                                @endforeach
                            @endif
                        </ul>
                    </div>
                </div>
                <?php endif; ?>

            </div>
        </div>








        <!-- 版權 -->
        <div class="copyright">
            <div class="wrap">
                <div class="site-info">
                    Copyright © 2011-2014 少数派 <span class="ver">/ 版本 ver2.17</span>
                </div>

                <div class="gov-info">
                    煮客网络旗下网站 <span class="ipc"><a href="http://www.miitbeian.gov.cn/">(粤ICP备09013378号-5）</a></span>
                </div>
            </div>
        </div>

</div>