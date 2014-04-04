<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta charset="utf-8">
        <title>
            @section('title')
                {{Option::get('sitename');}}
            @show
        </title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="{{asset('resource/js/lib/jquery/jquery-1.11.0.min.js')}}"></script>
        <script src="{{asset('themes/sspai2014_install/_res/js/main.js')}}"></script>
        <link rel="stylesheet" href="{{asset('themes/sspai2014_install/_res/css/style.css')}}" />
        <link rel="stylesheet" href="{{asset('themes/sspai2014_install/_res/css/typo.css')}}" />
        <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="{{asset('/feed')}}" />
        <link rel="alternate" type="text/xml" title="RSS .92" href="{{asset('/feed')}}" />
        <link rel="alternate" type="application/atom+xml" title="Atom 0.3" href="{{asset('/feed')}}" />
        @section('head')
            <meta name="description" content="{{Option::get('site::description')}}" />
            <meta name="keywords" content="{{Option::get('site::keywords')}}" />
        @show

    </head>

    <body>
        <!-- 頭部 R-HEADER -->
        @include('sspai2014_install.include.header')



        <!--主體 R-CONTAINER -->

        @section('container')
        @show





        <!--尾部 R-FOOTER -->
        @include('sspai2014_install.include.footer')
    </body>
</html>