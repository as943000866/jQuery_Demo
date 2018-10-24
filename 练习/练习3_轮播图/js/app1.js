//相当于 window.onload 当页面中元素都加载完后调用
$(function () {
    var $container = $('#container')
    var $list = $('#list')
    var $points = $('#pointsDiv>span')
    var $prev = $('#prev')
    var $next = $('#next')

    var offset = 600 //翻页的总的偏移量
    var time = 400 //翻页总的时间 Time
    var itemTime = 20 //翻页分段时间 itemTime
    var imgCount = $points.length
    var index = 0
    /*
     功能说明:
     1. 点击向右(左)的图标, 平滑切换到下(上)一页
     2. 无限循环切换: 第一页的上一页为最后页, 最后一页的下一页是第一页
     3. 每隔3s自动滑动到下一页
     4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
     5. 切换页面时, 下面的圆点也同步更新
     6. 点击圆点图标切换到对应的页

     bug: 快速点击时, 翻页不正常

 */
    //无限循环切换: 第一页的上一页为最后页, 最后一页的下一页是第一页
    var intervalId =setInterval(function () {

        nextPage(true)
    },1000)

    //当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
    $container.hover(function () {
        clearInterval(intervalId)
    },function () {
        intervalId =setInterval(function () {
            nextPage(true)
        },1000)
    })
    $prev.click(function () {

        nextPage(false)
    })
    $next.click(function () {

        nextPage(true)
    })
    // 点击圆点图标切换到对应的页
    $points.click(function () {
        //获取目标圆点的下标
        var targetIndex =$(this).index()
        //根据目标圆点切换到目标页面
        nextPage(targetIndex)
    })
    /**
     * 平滑翻页
     * @param flag
     * true 下一页
     * false 上一页
     */
    function nextPage(flag) {
        var currentOffect = $list.position().left

        //点击向右(左)的图标, 平滑切换到下(上)一页
        //翻页总的时间 time
        //翻页分段时间 itemTime
        //翻页的总的偏移量
        //翻页分段偏移量

        var targetOffect = currentOffect + (flag?-offset:offset)

        //循环移动分段偏移量, 直到到达指定位置
        var intervalId = setInterval(function () {

            //目标偏移量
            var itemOffect = offset/(time/itemTime)
            currentOffect += (flag?-itemOffect:itemOffect)

            if(currentOffect === targetOffect){
                clearInterval(intervalId)
                //如果当前位置到达 最后一张图片img1的位置 当前位置和第二张图片 img1 交换位置
                //如果当前位置到达 第一张图片img5的位置 当前位置和倒数第二张img5图片 交换位置
                if(currentOffect === -(imgCount+1) * offset){
                    currentOffect = -offset
                }else if(currentOffect === 0){
                    currentOffect = -(imgCount * offset)
                }

            }
            $list.css('left',currentOffect)
        },itemTime)
        updatePoints(flag)

    }

    // 切换页面时, 下面的圆点也同步更新
    function updatePoints(flag) {
        var targetIndex
        //获取目标圆点的下标
        if(flag){ //[0-imgCount-1]
            targetIndex = index + 1
            if(targetIndex === imgCount-1){
                targetIndex = 0
            }

        }else {
            targetIndex = index - 1
            if(targetIndex === 0){
                targetIndex = imgCount-1
            }
        }
        //去掉当前圆点的样式
        $points.eq(index).removeClass('on')

        //给目标圆点添加样式
        $points.eq(targetIndex).addClass('on')

        //更新当前圆点下标为目标圆点
        index = targetIndex
    }
})