@extends('sspai2014_install.layouts.default')

@section('title')
    @parent
@stop

@section('head')
    @parent
@stop

@section('container')








    <div class="fn-clear r-container">
        <div class="wrap">


            <!-- 主要部分 -->
            <div class="m-main">

                <!-- 文章列表模块 -->
                <div class="fn-clear g-box m-post-list">






        <!-- 文章內容 START -->
        <div class="fn-clear m-post-search">

            <!--搜索表单开始 -->
            <form action="{{url('search')}}" method="POST">
                <div class="keyword-input">
                    <input type="text" name="keyword" value="{{$keyword}}" class="input-text" id="keywords">
                    <button type="submit" class="g-btn g-btn-danger">搜索</button>
                </div>
                <!-- 搜索选项开始 -->
                <div class="search-options">
                    <div class="search-option">
                        <label class="checkbox"><input type="checkbox" name="withappname" value="1" {{isset($flag['app'])&&$flag['app']? 'checked="checked"':''}}>搜索应用名</label>
                    </div>
                    <div class="search-option">
                        <label class="checkbox"><input type="checkbox" name="withtag" value="1"  {{isset($flag['tag'])&&$flag['tag']? 'checked="checked"':''}}>搜索文章标签</label>
                    </div>
                    <div class="search-option">
                        <label>筛选分类：</label>
                        <script>
                            var cid = {{$flag['cid'] or 0}};
                                    $.get("{{url('ipa/category?type=subject')}}", function(data, status) {
                                    for (var i in data['data']) {
                                    if (data.data[i].id == cid){
                                    $('#categorylist').append('<option selected="selected" value="' + data.data[i].id + '">' + data.data[i].name + '</option>');
                                    } else{
                                    $('#categorylist').append('<option value="' + data.data[i].id + '">' + data.data[i].name + '</option>');
                                    }
                                    }
                                    });
                        </script>
                        <select name="categoryid" id="categorylist">
                            <option value="0">全部</option>
                        </select>
                    </div>
                </div>
                <!-- 搜索选项结束 -->
            </form>
            <!-- 搜索表单结束 -->
        </div>
        <!-- 文章內容 END -->





        @if (!isset($articles))
            <div class="not-found">
                <p class="message">
                    很抱歉，没有找到您需要的内容。
                </p>
            </div>
        @else
            @if (isset($appinfo))
                <div class="count-app-result">
                    <span class="icon-store"></span>
                    <span class="num">{{$keyword}}</span>相关应用
                </div>

                <!-- app 列表 -->
                <div class="m-app-list">
                    <ul class="list">
                        <!-- 单项app -->
                        <li class="item-app">
                            @include('sspai.appinfo', array('app'=>$appinfo,'article'=>$articles->first()))
                        </li>
                        <!-- 单项app结束 -->
                    </ul>
                </div>
                <!-- app 列表结束 -->
            @endif



            <!-- 文章列表模块 -->
            <div class="fn-clear m-post-list">

                    <!-- 文章列表模块-頭部 -->
                    <div class="fn-clear g-box-header">
                        <h5 class="fn-left">
                            搜索到 {{$articles->getTotal()}} 篇文章
                        </h5>
                    </div>



                    <!-- 文章列表模块-內容 -->
                    <div class="fn-clear g-box-container">
                        <ul class="g-list">
                            @include('sspai2014_install.include.post_list')
                        </ul>
                    </div>

                    <div class="m-pager">
                        {{$articles->appends([
                            'keyword'=>$keyword,
                            'withappname'=>$flag['app'],
                            'withtag'=>$flag['tag'],
                            'categoryid'=>$flag['cid'],
                        ])->links()}}
                    </div>
            </div>





        @endif














                </div>
            </div>

            @include('sspai2014_install.include.sidebar')


        </div>
    </div>



@stop
