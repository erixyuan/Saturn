<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" lang="zh"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <title>
            @section('title')
            {{Option::get('sitename');}}
            @show
        </title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="{{asset('themes/sspai/_res/style/main.css')}}" />
        <link rel="stylesheet" href="{{asset('themes/sspai/_res/style/typo.css')}}" />

        <script src="js/Saturn.js"></script>
        <script src="{{asset('resource/js/lib/jquery/jquery-1.10.2.min.js')}}"></script>
        <!--<script data-main="js/main" src="js/lib/require.js"></script>-->
        <!--<base href="" />-->
        <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="{{url('feed')}}" />
        <link rel="alternate" type="text/xml" title="RSS .92" href="{{url('feed')}}" />
        <link rel="alternate" type="application/atom+xml" title="Atom 0.3" href="{{url('feed')}}" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">

        <script type="text/javascript">
var SSP_SERVER_TIME = new Date('{{date('Y / m / d H:i:s')}}').getTime();
        </script>

        @section('head')
        <meta name="description" content="{{Option::get('site::description')}}" />
        <meta name="keywords" content="{{Option::get('site::keywords')}}" />
        @show
    </head>
    <body>
        @include('sspai.layouts.header')

        <div class="wrap r-container">
            @section('main')
            @show
        </div>

        @include('sspai.layouts.footer')
    </body>
</html>