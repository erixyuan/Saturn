@extends('sspai.layouts.master')

@section('title')
「{{$keyword}}」搜索结果 | 
@parent
@stop

@section('head')
@parent
@stop
@section('main')

<div class="w-main">
    <div class="m-block m-search">
        <h2>搜索</h2>
        <div class="block-content">
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



            <div class="count-post-result">
                <span class="icon-book"></span>
                <span class="num">{{$articles->getTotal()}}</span>篇文章
            </div>
            <!-- 文章列表 -->

            <div class="m-post-list">
                <ul>
                    @include('sspai.posts')
                </ul>
            </div>
            {{$articles->appends([
                    'keyword'=>$keyword,
                    'withappname'=>$flag['app'],
                    'withtag'=>$flag['tag'],
                    'categoryid'=>$flag['cid'],
                    
                ])->links()}}

            <!-- 文章列表结束-->
            @endif
        </div>
        <!-- 搜索内容结束 -->
    </div>
    <!-- 搜索模块结束 -->
</div>
@stop


@section('sidebar')
@stop