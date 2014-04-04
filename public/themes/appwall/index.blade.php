@extends('appwall.layouts.master')

@section('title')
@parent
@stop

@section('head')
@parent
@stop

@section('main')
<div class="main clearfix">
    <div class="wrap">
        <div class="combo clearfix">
            <div id="slides">
                <div class="slides_container">
                    <div class="allinone rock">
                        {{-- */$categories = Category::type('application')->index()->where('parent_id',3551)->get();/* --}}

                        {{-- */$exists = [];/* --}}
                        @foreach($categories as $k=>$c)

                        @if(($k+1) % 4 == 0)
                        <div class="box last">
                            @else
                            <div class="box">
                                @endif
                                <a href="{{url('appwall/'.$c->slug)}}">
                                    <!--from=?-->
                                    <div class="title_{{$c->slug}} title"></div>
                                    <span class="title_more">
                                        更多
                                    </span>
                                </a>
                                <ul class="clearfix">
                                    {{-- */$apps = $c->apps()->with('icon')->get();/* --}}
                                    {{-- */$row_share = '';/* --}}
                                    @foreach ($apps as $app)

                                    @if (isset($exists[$app->id]))
                                    {{-- */continue;/* --}}
                                    @else
                                    {{-- */$exists[$app->id] = $app;/* --}}
                                    @endif
                                    <li id="app_{{$app->id}}" class="clearfix app">
                                        <a title="MiniSquadron" href="#w{{$app->id}}" data-toggle="modal">
                                            <span class="mask"></span>
                                            <img class="icon" alt="应用图标" src="{{$app->icon->thumb_url}}">
                                        </a>
                                        <a class="apptitle" title="应用详细" href="#w{{$app->id}}" data-toggle="modal">
                                            <h3>{{$app->name}}</h3>
                                        </a>
                                        <a title="MiniSquadron" href="#w{{$app->id}}" data-toggle="modal">
                                            <p id="yfx_content_post_{{$app->id}}">{{mb_substr(strip_tags(trim($app->description)), 0, 70, 'utf-8')}}
                                                @if (mb_strlen(trim($app->description), 'utf-8') > 70) 
                                                ...
                                                @endif
                                            </p>
                                        </a>

                                    </li>
                                    {{--$row_share .= "【{$app->name}】" . $app->articles()->first()->url()--}}
                                    <!--from-->
                                    @if (count($exists) % 4 == 0) 
                                    {{-- */break;/* --}}
                                    @endif
                                    @endforeach
                                </ul>

                            </div>
                            @if (($k+1) % 4 == 0 && ($k+1) < 8)
                        </div>
                        <div class="allinone rock">
                            @endif
                            @endforeach

                        </div>
                    </div>

                </div>
            </div>

            <div class="combo_hidden">

                @foreach ($exists as $app)
                <div id="w{{$app->id}}" class="modal hide fade" style="display: none; z-index:1000; position:absolute; top:280px; ">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">关闭</button>
                        <img src="{{$app->icon->thumb_url}}" alt="应用图标" class="icon"/>
                        <h3>{{$app->name}}</h3>
                    </div>

                    <div class="modal-body">
                        <div class="description">
                            <div class="screenshot screenshot_{{$app->id}} clearfix">
                            </div>

                            <div class="text">
                                <p>{{$app->description}}</p>
                            </div>
                        </div>


                        <script type="text/javascript">
                            $(".screenshot_{{$app->id}} a:has(img)").slimbox();
                        </script>


                        <div class="share clearfix">
                            <div class="qr">



                            </div>

                            <div class="sms">

                                <script type="text/javascript">
                                    function setContent(str) {
                                        str = str.replace(/<\/?[^>]*>/g, '');
                                        str = str.replace(/[ | ]*\n/g, '');
                                        str = str.replace(/\n[\s| | ]*\r/g, '');
                                        str = str.replace(/\s/g, '');
                                        return str;
                                    }
                                    $("#yfx_content_post_value_{{$app->id}}")[0].value = "{{"【" . $app->name . "】"}} " + setContent($('#yfx_content_post_{{$app->id}}').html()).substring(0, 100) + "http://sspai.me";
                                </script>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <p class="getqr"><strong>没有二维码扫描软件？</strong> 请编辑短信kp发送到10659468即可免费下载</p>
                    </div>
                </div>
                @endforeach
            </div>

            <script>
                $(function() {
                    $('#slides').slides({
                        preload: true,
                        play: 10000,
                        pause: 2500,
                        hoverPause: true,
                        generateNextPrev: true,
                        generatePagination: false,
                        animationStart: function() {
                        },
                        animationComplete: function(index) {
                            index = index - 1;
                            $(".header ul.current").removeClass('current');
                            $(".header ul:eq(" + index + ")").addClass('current');

                        },
                        slidesLoaded: function() {
                            $('.caption').animate({bottom: 0}, 10);
                            $(".header ul:eq(" + 0 + ")").addClass('current');
                        }


                    });
                });
            </script>


        </div>
    </div>

    @stop
