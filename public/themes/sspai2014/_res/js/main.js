function isMobile(){
    var desktopWidth = 1024;
    if($(window).width() < desktopWidth){
        return true;
    }else {
        return false;
    }
}




$(document).ready(function() {

    // 缩放窗口事件
    $(window).resize(function(){

    });




    // 滚动事件
    $(document).scroll(function () {

        var document_scroll_top = $(document).scrollTop()

        // 让边栏App下载框始终浮动在边栏

        if ( $('.m-widget-app').length > 0 ) {

            var m_widget_app = $('.m-widget-app');
            var m_sidebar_switch_height = ($('.m-sidebar').height()) + ($('.r-header').height()) + 20;
            var m_widget_app_fixed_top = 65;


            // 如果边栏被滚动得没有东西了，那就悬浮显示应用信息
            if (document_scroll_top > m_sidebar_switch_height) {
                m_widget_app.addClass('m-widget-app-fixed');
                m_widget_app.css('top',m_widget_app_fixed_top);

            }else{
                m_widget_app.removeClass('m-widget-app-fixed');
                m_widget_app.css('top', 0);
            }




            var r_footer = $('.r-footer');

            // 悬浮显示的情况下，处理触底现象

            if ( ( m_widget_app.offset().top + m_widget_app.height() ) > r_footer.offset().top) {
                m_widget_app.css({
                    top: $(document).height() - ( $(document).scrollTop() + r_footer.height() + m_widget_app.height() + 20 )
                });

            }else {
                m_widget_app.css({ top: m_widget_app_fixed_top });
            }
        }



        var m_nav_top = $('.m-nav-top');
        var m_nav_bottom = $('.m-nav-bottom');
        var m_search = $('.m-search');

        if (document_scroll_top > m_nav_top.height()) {
            if(!m_nav_bottom.hasClass("m-nav-bottom-fixed")) {
                m_nav_bottom.addClass('m-nav-bottom-fixed');
                m_search.addClass('m-search-fixed');



            }
        }else{
            if(m_nav_bottom.hasClass('m-nav-bottom-fixed')) {
                m_nav_bottom.removeClass('m-nav-bottom-fixed');
                m_search.removeClass('m-search-fixed');
            }
        }














    });

});