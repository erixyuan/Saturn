// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {
  $(function(){



    // IE10 viewport hack for Surface/desktop Windows 8 bug
    //
    // See Getting Started docs for more information
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement("style");
      msViewportStyle.appendChild(
        document.createTextNode(
          "@-ms-viewport{width:auto!important}"
        )
      );
      document.getElementsByTagName("head")[0].
        appendChild(msViewportStyle);
    }


    var $window = $(window)
    var $body   = $(document.body)

    var navHeight = $('.r-header').outerHeight(true) -30;

    $body.scrollspy({
      target: '.bs-sidebar',
      offset: navHeight
    });


    $window.on('load', function () {
      $body.scrollspy('refresh');
    });



    $('.bs-docs-container [href=#]').click(function (e) {
      e.preventDefault()
    })

    // back to top

    setTimeout(function () {
      var $sidebar = $('.bs-sidebar > .nav');

      if($sidebar.length == 0){
        return;
      }
      //保存原来的宽度
      var srcWidth,bottomOffset,srcOffsetTop ;
      var wMain = $(".act-page");
      // 结构 必须是 .row > xxxx > .nav
      var sParent = $sidebar.parents(".row:first");
      var $sidebarParent = $sidebar.parent();

      function saveEnv(){
        //保存原来的宽度
          $sidebar.attr("style","");
          $sidebarParent.attr("style","");

          srcWidth = $sidebar.width();
          $sidebar.width(srcWidth );
          srcOffsetTop = wMain.offset().top;
          // 保存原来的高度
          $sidebarParent.height(sParent.height());
          bottomOffset = wMain.height() - $sidebar.height();
      }

      function resetSyle (){
          window.isMobileVal = window.isMobile();
          if (window.isMobileVal){
                //清除设置
                $sidebarParent.css({height: "initial"});
                $sidebar.css({width:"initial", position:"static"});
          }else{
              saveEnv();
          }
      }

      // 判断是否是手机版
      window.isMobileVal = window.isMobile();
      if (!window.isMobileVal){
            //不是手机版的时候就获取设置
            saveEnv();
      }

      resetSyle();

      $(window).resize(function(){
          resetSyle();
      });

      $(window).scroll(function(){
          //判断是否是是手机版
          if(window.isMobileVal){
              return;
          }

          var wTop = $(window).scrollTop();
          var to = wTop - srcOffsetTop;
          if(to > 0){
              if(to > bottomOffset){
                  $sidebar.addClass("affix-bottom").removeClass("affix");
              }else{
                  $sidebar.addClass("affix").removeClass("affix-bottom");
              }

          }else{
              $sidebar.removeClass("affix-bottom affix");
          }
      });
     /*
      $sidebar.affix({
        offset: {
          top: function () {
            return $('.bs-page').offset().top;
          }
        , bottom: function () {
            var bottom = $(".m-page-comment").outerHeight(true);
            if(bottom == 0){
              bottom = $('.w-footer').outerHeight(true);
            }else{
              bottom = $('.w-footer').outerHeight(true) + $(".m-page-comment").outerHeight(true);
            }

            return bottom;
          }
        }

      })*/
    }, 100);

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100);


    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    $('.bs-docs-navbar').tooltip({
      selector: "a[data-toggle=tooltip]",
      container: ".bs-docs-navbar .nav"
    })

    // popover demo
    $("[data-toggle=popover]")
      .popover()

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })

    // carousel demo
    $('.bs-docs-carousel-example').carousel()
})

}(window.jQuery)
