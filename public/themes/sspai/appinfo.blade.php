<div class="m-appinfo">
    <div class="w-app-inner">
        <div class="icon downloads-total-{{count($app->appinfos)}}"><img src="{{$app->icon->thumbnail_path( array('w' => 90, 'h' => 90) )}}" alt="软件图标" width="90" height="90"></div>
        <h5>{{$app->name_cn or $app->name}}</h5>
        <div class="info-dowloads">
            <!-- 信息：START -->
            <ul class="info">
                @if(!$app->categories->isEmpty())
                <li>
                    <span class="key">分类：</span>
                    @foreach($app->categories as $category )
                    <a rel="category" title="查看所有关于 {{$category->name}} 的文章" href="/appwall/{{$category->slug}}">{{$category->name}}</a>
                    @endforeach
                </li>
                @endif
                <li>
                    <span class="key">适用：</span>
                    @foreach( $app->tags as $tag )
                    <a rel="tag" title="查看所有关于 {{$tag->name}} 的文章" href="/tag/{{$tag->name}}">{{$tag->name}}</a>
                    @endforeach
                </li>
            </ul>
            <!-- 信息：END -->
            <!-- 下载链接：START-->
            <ul class="downloads downloads-total-{{count($app->appinfos)}}">
                @foreach( $app->appinfos as $download )
                <li>
                    <span class="platform-name">{{$download->platform}}</span>
                    <a href="{{--$download->redirectURL()--}}" target="_blank" class="btn-download {{str_replace( ' ','-', strtolower($download->platform))}}"><span>
                            {{sprintf("￥%0.2f", $download->price) or '免费'}}
                        </span></a>
                </li>
                @endforeach
            </ul>
            <!-- 下载链接：END -->
        </div>
    </div>
    <!-- QRCODE: START -->
    <div class="w-qrcode">
        <div class="img-qrcode">
            <a href="{{$article->url()}}" title="扫描二维码进入手机版阅读文章">
                <img src="{{url('qrimage?url='.$article->url().'&size=86')}}" alt="二维码">
            </a>
        </div>
        <a href="http://sspai.com/qr" title="二维码是用某种特定的几何图形按一定规律在平面分布的黑白相间的图形记录数据符号信息。您可以用手机摄像头通过二维码扫描软件（如：快拍二维码）获取二维码信息。上方二维码为本文的网页链接。">什么是二维码</a>
    </div>
    <!-- QRCODE: END -->


    <script type="text/javascript">
        window.onload = function(){
        if (window.jiathis_config){
        window.jiathis_config.pic = '{{$article->banner_url()}}';
        } else{
        window.jiathis_config = {
        pic : "{{$article->banner_url()}}"
        };
        }
        }

    </script>
    <!-- 分享按钮区域: START -->
    <div class="w-share" onmouseover="setShare('{{$article->title}}', $('#share_sina_{{$article->id}}').val(), '{{$article->url()}}', '{{$article->id}}');">
        <div id="ckepop">
            <a class="jiathis_button_tsina">新浪微博</a>
            <a class="jiathis_button_qzone">QQ空间</a>
            <a class="jiathis_button_tqq">腾讯微博</a>
            <a class="jiathis_button_renren">人人网</a>
            <a href="http://www.jiathis.com/share?uid=1984" class="jiathis jiathis_txt jiathis_separator jtico jtico_jiathis" target="_blank">更多</a>
            <a class="jiathis_counter_style"></a>
        </div>
    </div>
    <!-- 分享按钮区域: END -->
</div>


