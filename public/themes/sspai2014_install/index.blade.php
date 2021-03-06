@extends('sspai2014_install.layouts.default')

@section('title')
    @parent
@stop

@section('head')
    @parent
@stop

@section('container')




    <?php
        // 獲取廣告第一章圖片的背景顏色(color1)，這樣直接賦色，比js賦要快很多。
        $first_combo_bgcolor = (Ad::where('key','sspai_combo')->first()['items'][0]['color1']);
    ?>
    <div class="fn-clear r-combo" style="background-color: <?php echo $first_combo_bgcolor; ?>">
        <div class="wrap">
            <!-- 掛件內容 -->
            <div class="r-combo-container xx r-combo-container-hidden">
                <ul class="fn-clear g-list slides">
                    <?php $ads = Ad::where('key','sspai_combo')->first(); ?>
                    @if(isset($ads->items)&&is_array($ads->items))
                        @foreach($ads->items as $i)
                            <?php
                                if (isset($i['attachment_id']) && $i['attachment_id']) {
                                    if ($combo_img = Attachment::find($i['attachment_id'])) {
                                        $combo_img_url = $combo_img->thumbnail_path(array('wm' => 640 ));
                                    }
                                }
                            ?>

                            <li data-bgcolor="{{$i['color1']}}">
                                <a href="{{$i['link']}}">
                                    <img class="image" src="{{$combo_img_url}}" alt="{{$i['title']}}">
                                    <span class="text1" style="color:{{$i['color2']}}">{{$i['title']}}</span>
                                    <span class="text2" style="color:{{$i['color3']}}">{{$i['content']}}</span>
                                </a>
                            </li>
                        @endforeach
                    @endif
                </ul>
            </div>



            <script type="text/javascript">
               $(document).ready(function() {
                    $('.r-combo-container').flexslider({
                        // namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
                        // selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
                        animation: "slide",              //String: Select your animation type, "fade" or "slide"
                        easing: "swing",               //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
                        // direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
                        // reverse: false,                 //{NEW} Boolean: Reverse the animation direction
                        animationLoop: true,             //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
                        // smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
                        // startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
                        // slideshow: true,                //Boolean: Animate slider automatically
                        slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
                        animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
                        initDelay: 4,                   //{NEW} Integer: Set an initialization delay, in milliseconds
                        // randomize: false,               //Boolean: Randomize slide order

                        // // Usability features
                        // pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
                        // pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
                        useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
                        touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
                        // video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

                        // // Primary Controls
                        controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
                        // directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
                        prevText: "上一頁",           //String: Set the text for the "previous" directionNav item
                        nextText: "下一頁",               //String: Set the text for the "next" directionNav item

                        // // Secondary Navigation
                        keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
                        // multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
                        mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
                        // pausePlay: false,               //Boolean: Create pause/play dynamic element
                        // pauseText: 'Pause',             //String: Set the text for the "pause" pausePlay item
                        // playText: 'Play',               //String: Set the text for the "play" pausePlay item

                        // // Special properties
                        // controlsContainer: "",          //{UPDATED} Selector: USE CLASS SELECTOR. Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be ".flexslider-container". Property is ignored if given element is not found.
                        // manualControls: "",             //Selector: Declare custom control navigation. Examples would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
                        // sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
                        // asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

                        // // Carousel Options
                        // itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
                        // itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
                        // minItems: 0,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
                        // maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
                        // move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.

                        // // Callback API
                        // start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
                        // before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
                        // after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
                        // end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
                        // added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
                        // removed: function(){}           //{NEW} Callback: function(slider)


                        //以用PHP處理了這段
                        // start: function(){
                        //     var data_bgcolorx = $(".flex-active-slide").attr('data-bgcolor');
                        //     $('.r-combo').css('background-color', data_bgcolorx);
                        // },

                        start: function(){
                          $('.r-combo-container').removeClass('r-combo-container-hidden');
                        },

                        after: function(){
                            var data_bgcolor = $(".flex-active-slide").attr('data-bgcolor');
                            $('.r-combo').css('background-color', data_bgcolor);
                        }
                    });
                });
            </script>


        </div>
    </div>



    <div class="fn-clear r-container">
        <div class="wrap">


            <!-- 主要部分 -->
            <div class="m-main">

                <!-- 文章列表模块 -->
                <div class="fn-clear g-box m-post-list">

                    <!-- 文章列表模块-頭部 -->
                    <div class="fn-clear g-box-header">
                        <h5 class="fn-left">
                            最新推荐
                        </h5>
                    </div>

                    <!-- 文章列表模块-內容 -->
                    <div class="fn-clear g-box-container">
                        <ul class="g-list">
                            @include('sspai2014_install.include.post_list')
                        </ul>
                    </div>

                    <div class="m-pager">
                        {{$articles->links()}}
                    </div>
                </div>
            </div>

            @include('sspai2014_install.include.sidebar')


        </div>
    </div>

    <!-- 首頁幻燈片效果 -->
    <script src="{{asset('resource/js/lib/FlexSlider/jquery.flexslider.js')}}"></script>
    <script src="{{asset('resource/js/lib/jquery/plugin/jquery-easing/jquery.easing.compatibility.js')}}"></script>

@stop