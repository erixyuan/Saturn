<div class="m-pager">

    <p><span class="pages">第 {{$pageinfo['current']}} 页，共 {{$pageinfo['last']}} 页</span></p>

    <!--<ul class="pagination pagination-lg">-->
        @if ($pageinfo['prev'])
        <li class='prev'><a class="previouspostslink" href="{{url(Request::url().'?page='.$pageinfo['prev'])}}">&laquo;上一页</a></li>
        @endif


        <span class="current">
            第<span class="num"> {{$pageinfo['current']}} </span>页
            <i><em></em><span></span></i>
        </span>
        {{-- */$prev_len = 2;/* --}}

        {{-- */$next_len = 2;/* --}}

        @if ($pageinfo['last'] > 2)

        {{-- */$loop_start = $pageinfo['current'] - $prev_len < 1 ? 1 : $pageinfo['current'] - $prev_len;/* --}}

        {{-- */$loop_end = $pageinfo['current'] + $next_len > $pageinfo['last'] ? $pageinfo['last'] : $pageinfo['current'] + $next_len;/* --}}


            @if ($loop_start > 1)
            <li class='ext'><span class="extend">...</span></li>
            @endif

            @for (; $loop_start <= $loop_end; $loop_start++)
            {{-- */$current = $pageinfo['current'] == $loop_start ? ' active ' : '';/* --}}
            <li class='num'><a class="page larger{{$current}}" href="{{url(Request::url().'?page='.$loop_start)}}">{{$loop_start}}</a></li>
            @endfor

            @if ($loop_start <= $pageinfo['last'])
            <li class='ext'><span class="extend">...</span></li>
            @endif

            @if ($pageinfo['next'])
            <li class='next'><a class="nextpostslink" href="{{url(Request::url().'?page='.$pageinfo['next'])}}">下一页&raquo</a></li>
            @endif

        @endif
</div>