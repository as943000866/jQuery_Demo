/*
 1. 鼠标移入显示,移出隐藏
 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)

 9. 点击向右/左, 移动当前展示商品的小图片
 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */
$(function () {
  showhide ()
  hoverSubMenu()
  showLargeImg()
  search()
  share()
  address()
  clickTabs()
  minicart()
  clickProductTabs()
  moveMiniImg()
  hoverMiniImg()
  // 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
  function showLargeImg() {
    var $mediumImg = $('#mediumImg')
    var $mask = $('#mask')
    var $maskTop = $('#maskTop')
    var $largeImgContainer = $('#largeImgContainer')
    var $loading = $('#loading')
    var $largeImg = $('#largeImg')
    var maskWidth = $mask.width()
    var maskHeight = $mask.height()
    var maskTopWidth = $maskTop.width()
    var maskTopHeight = $maskTop.height()
      $maskTop.hover(function () {
      $mask.show()
      //显示大图
      $largeImgContainer.show()
      $loading.show()
      var src = $mediumImg.attr('src').replace('-m.','-l.')
      $largeImg.attr('src',src)
      //绑定图片加载完成监听
      $largeImg.on('load',function () {
        var largeImgWidth = $largeImg.width()
        var largeImgHeight = $largeImg.height()
        $largeImgContainer.width(largeImgWidth/2)
        $largeImgContainer.height(largeImgHeight/2)

        $largeImg.show()

        //鼠标移动的监听
        $maskTop.mousemove(function (event) {
          //1.设置小黄块样式变化
          var left = 0
          var top = 0
          var eventLeft = event.offsetX
          var eventTop = event.offsetY

          left = eventLeft - maskWidth/2
          top = eventTop - maskHeight/2

          //left的范围 [0 , maskTopWidth - maskWidth]
          //top 的范围 [0 , maskTopHeight - maskHeight]

          if(left<0){
            left = 0
          }else if(left>maskTopWidth - maskWidth){
            left = maskTopWidth - maskWidth
          }

          if(top<0){
            top = 0
          }else if(top>maskTopHeight - maskHeight){
            top = maskTopHeight - maskHeight
          }
          $mask.css({
            left:left,
            top:top
          })
          //1.设置大图样式变化
          left = -left * largeImgWidth/maskTopWidth
          top = -top * largeImgHeight/maskTopHeight
          $largeImg.css({
            left:left,
            top:top
          })
        })
        $loading.hide()
      })



    },function () {
      $mask.hide()
      $largeImgContainer.hide()
      $largeImg.hide()
    })
  }

  // 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
  function hoverMiniImg() {
    var $lis = $('#icon_list>li')
    $lis.hover(function () {
      this.children[0].className = 'hoveredThumb'
      var $img = $(this).children()
      //$img.addClass('hoveredThumb')

      var src = $img.attr('src').replace('.jpg','-m.jpg')
      $('#mediumImg').attr('src',src)
    },function () {
      var $img = $(this).children()
      $img.removeClass('hoveredThumb')
    })
  }
  // 9. 点击向右/左, 移动当前展示商品的小图片
  function moveMiniImg() {
    var $backward = $('#preview>h1>a').first()//向左的a标签
    var $forward = $('#preview>h1>a').last()//向右的a标签
    var $ul = $('#icon_list')//图片所在的ul
    var imgCount = $ul.children().length //图片个数
    var SHOWCOUNT = 5 //显示的图片个数
    var imgWidth = $ul.children().first().width()//一个li的宽度
    var moveCount = 0 //向右移动为正,向左移动为负

    //判断向右的a标签是否可以点击
    if(imgCount>SHOWCOUNT){
      $forward.attr('class','forward')
    }
    //向右移动的点击事件
    $forward.click(function () {
      //右边图片已经显示到最后一张图片为不可点击
      if(moveCount === imgCount - SHOWCOUNT){
        return
      }
      moveCount++
      //更新向左的a标签
      $backward.attr('class','backward')
      //更新向右的a标签(若移动后右边图片已经显示到最后一张图片)
      if(moveCount === imgCount - SHOWCOUNT){
        $forward.attr('class','forward_disabled')
      }
      //移动ul
      $ul.css({
        left: - moveCount * imgWidth
      })
    })

    //向左移动的点击事件
    $backward.click(function () {
      //左边图片已经显示第一张图片为不可点击
      if(moveCount === 0){
        return
      }
      moveCount--
      //更新向右的a标签
      $forward.attr('class','forward')
      //更新向左的a标签(若移动后左边图片已经显示到第一张图片)
      if(moveCount === 0){
        $backward.attr('class','backward_disabled')
      }
      //移动ul
      $ul.css({
        left: - moveCount * imgWidth
      })
    })
  }
  // 8. 点击切换产品选项 (商品详情等显示出来)
  function clickProductTabs() {
    var $lis = $('#product_detail>ul>li')
    var $contents = $('#product_detail>div:gt(0)')
    $lis.click(function () {
      $lis.removeClass('current')
      $(this).addClass('current')
      //this.className = 'current'

      $contents.hide()
      var index = $(this).index()
      $contents.eq(index).show()
      // $contents[index].style.display = 'block'
    })
  }
  // 7. 鼠标移入移出切换显示迷你购物车
  function minicart() {
    $('#minicart').hover(function () {
      this.className = 'minicart'
      $(this).children(':last').show()

    },function () {
      this.className = ''
      $(this).children(':last').hide()
    })
  }
  // 6. 点击切换地址tab
  function clickTabs() {
    $('#store_tabs>li').click(function () {
      $(this).siblings().removeClass('hover')
      $(this).addClass('hover')
    })
  }
  // 5. 鼠标移入移出切换地址的显示隐藏
  function address() {
    var $store = $('#store_select')
    $store.hover(function () {
      $(this).children(':gt(0)').show()
    },function () {
      $(this).children(':gt(0)').hide()
    })
      .children(':last')
      .click(function () {
        $store.children(':gt(0)').hide()
      })

  }
  // 4. 点击显示或者隐藏更多的分享图标
  function share() {
    var $share = $('#shareMore')
    var $parent = $share.parent()
    var $as = $share.prevAll('a:lt(2)')
    var $b = $share.children()
    var isOpen = false
    $('#shareMore').click(function () {
      if(isOpen){
        $parent.css('width',155)
        $as.css('display','none')
        $b.removeClass('backword')
      }else {
        $parent.css('width',200)
        $as.css('display','block')
        $b.addClass('backword')
      }
      isOpen = !isOpen
    })
  }

  //3. 输入搜索关键字, 列表显示匹配的结果
  function search() {
    $('#txtSearch')
      .on('foucs keyup',function () {
        var text = this.value.trim()
        if (text){
          $('#search_helper').show()
        }
      })
      .blur(function () {
        $('#search_helper').hide()
      })
  }

  // 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
  function hoverSubMenu() {
    $('#category_items>.cate_item').hover(function () {
        $(this).children(':last').show()
    },function () {
        $(this).children(':last').hide()
    })
  }

  /*
   1. 鼠标移入显示,移出隐藏
   目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
   */
  function showhide () {
    $('[name=show_hide]').hover(function () { // 显示
      var id = this.id + '_items'
      $('#'+id).show()
    }, function () {// 隐藏
      var id = this.id + '_items'
      $('#'+id).hide()
    })
  }


})