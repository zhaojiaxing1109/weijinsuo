$(function () {
    bannerRender();
    initTabSwipe();
    /*初始化工具提示*/
    $('[data-toggle="tooltip"]').tooltip();
});
var bannerRender = function () {
    /*1. 同时加载了两种图片  影响页面渲染效率 耗流量 */
    /*2. 页面解析的时候 遇见 url src 都会去加载资源 不管当前元素是不是隐藏的 */
    /*3. 不加属性url src ，干脆html结构不显示 */
    /*4. js操作 按照屏幕大小 去追加对应的html内容  $(window).width() */

    /*需求：*/
    /*1. 准备数据  ajax 后台获取数据  json格式（字符串） */
    /*2. 获取数据  异步获取 ajax */
    /*3. 获取成功  根据数据转换成html结构 (模板渲染 artTemplate ) 根据当前设备去转 */
    /*4. 渲染页面  把html代码追加到页面 html() */
    var renderHtml = function () {
        /*判断设备 移动端  非移动端*/
        var isMobile = $(window).width() < 768;
        /*模板渲染 */
        /* artTemplate 两种语法：简洁语法 原生语法 */
        /*1. 准备模板  去判断那块内容需要动态渲染 */
        /*2. 把数据传给模板 返回HTML格式的字符串*/
        /*3. 把字符串插入页面*/
        $('.carousel-indicators').html(template('pointTemplate', window.data));
        $('.carousel-inner').html(template('imageTemplate', {list: window.data, isM: isMobile}));
    }
    var render = function () {
        if (window.data) {
            /*渲染 使用缓存数据*/
            renderHtml();
        } else {
            $.ajax({
                type: 'get',
                url: 'js/data.json',
                data: {},
                dataType: 'json',
                success: function (data) {
                    window.data = data;
                    /*渲染 使用的是第一次请求的数据*/
                    renderHtml();
                }
            });
        }

    }
    render();
    /*5. 测试 模拟切换浏览器尺寸 按需加载图片 resize*/
    $(window).on('resize', function () {
        /*使用render页面尺寸改变的时候不停的去发请求*/
        /*去避免请求 特点：请求的数据一样*/
        /*缓存数据  页面加载的时候请求一次  以后页面的渲染都用它*/
        /*缓存一个数据 每次渲染的时候去判断如果有缓存数据就用它没有就请求*/
        render();
    });
    /*6. 移动端手势切换轮播图*/
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    /* jquery绑定移动端touch事件 返回的是封装后的事件对象 如果想去拿原生js的事件对象 originalEvent */
    $('.wjs_banner').on('touchstart', function (e) {
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove', function (e) {
        var moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    }).on('touchend', function (e) {
        /*构建手势*/
        if (isMove && Math.abs(distanceX) > 50) {
            /*满足手势条件*/
            if (distanceX > 0) {
                /*右滑手势*/
                /*切换上一张*/
                console.log('prev');
                $('#carousel-example-generic').carousel('prev');
            } else {
                /*左滑手势*/
                /*切换下一张*/
                console.log('next');
                $('#carousel-example-generic').carousel('next');
            }
        }
        startX = 0;
        distanceX = 0;
        isMove = false;
    });
}

var initTabSwipe = function () {
    /*需求. 在移动设备  页签放不下  ---》滑动的标签页 */
    /*1. 获取所有的子页签  求出宽度的和 */
    /*2. 把页签容器设置成你的宽度 出现滚动条*/
    /*3. 准备一个容器装 页签容器 溢出隐藏*/
    /*4. 大容器套一个长的子容器 初始化成区域滚动*/

    var $tab = $('.wjs_product .nav-tabs');
    var $tabChild = $tab.children();
    var width = 0;
    $tabChild.each(function (i, item) {
        width += $(item).outerWidth(true);
        /*width()  内容*/
        /*innerWidth() 内容+内边距 */
        /*outerWidth() 内容+内边距+边框 */
        /*outerWidth(true) 内容+内边距+边框+外边距*/
    });
    $tab.width(width);
    new IScroll('.nav-tabs-parent', {
        scrollX: true,
        scrollY: false,
        click: true
    });
}