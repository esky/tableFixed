/*
* table的表头表尾fixed效果,使用浏览器滚动条。兼容IE6
* 要求表头表尾必须在thead tfoot内
* by esky 2014-02-13
*/
// 步骤1：table加入外部布局容器e-tbWrap, 并生成最外层包裹容器e-tableFixedWrap
// 步骤2：将table中的thead或tfoot克隆放入e-theadWrap或e-tfootWrap中(与e-tbWrap同级)
// 步骤3：必要的话调整克隆后的列宽度
// 步骤4：加入scroll事件处理，克隆后的表头表尾在滚动边界时fixed显示(即始终可见)
// 注意1：克隆的表头尾将掩盖原来的，即原来的不可见。交互操作都在克隆的表头尾上。
// 注意2：最好给表头各列定义固定宽度，固定宽度后表格内容要合适不可溢出
// 注意3：当table-layout=fixed 时 最好使用<colgroup><col width=90></col></colgroup>固定列宽度
// 注意4：td中最好别使用定位元素，否则IE678容易出现兼容问题。
(function ($) {
    var isIE=!!window.ActiveXObject;
    var isIE6=isIE&&!window.XMLHttpRequest;
    // var isIE8=isIE&&!!document.documentMode;
    // var isIE7=isIE&&!isIE6&&!isIE8;
    $.fn.extend({
        tableFixed: function (opt) {
            //表头表尾均fixed
            opt = $.extend({
                layout: '',
                head: true,
                foot: true
            }, opt);
            return this.each(function () {
                var $me = $(this),
                    $thead = $('thead', $me),
                    $tfoot = $('tfoot', $me),
                    $Box,
                    $tbWrap,
                    $theadWrap,
                    $tfootWrap,
                    pos,
                    ofs,
                    _$clone,
                    // fixed开关
                    isFixed = true
                ;
                if(!$thead[0]){ opt.head = false; }
                if(!$tfoot[0]){ opt.foot = false; }
                opt.layout && $me.css('table-layout', opt.layout);
                $me.wrap('<div class="e-tbWrap"></div>');
                $tbWrap = $me.parent();
                $Box = $tbWrap.wrap('<div class="e-tableFixedWrap"></div>').parent();
                $Box.css({ 'position': 'relative' });
                pos = $tbWrap.position();
                if(opt.head){
                    //在table父级容器前插入表头容器
                    $theadWrap = $('<div class="e-theadWrap"></div>');
                    $theadWrap.width($tbWrap.width());
                    _$clone = $me.clone(true);
                    _$clone.find('tbody').remove();
                    _$clone.find('tfoot').remove();
                    _$clone.appendTo($theadWrap);
                    updateWidth($('thead', $theadWrap), $thead);
                    $theadWrap.insertBefore($tbWrap);
                    absHead();
                }
                if(opt.foot){
                    $tfootWrap = $('<div class="e-tfootWrap"></div>');
                    $tfootWrap.width($tbWrap.width());
                    _$clone = $me.clone(true);
                    _$clone.find('tbody').remove();
                    _$clone.find('thead').remove();
                    _$clone.appendTo($tfootWrap);
                    updateWidth($('tfoot', $tfootWrap), $tfoot);
                    $tfootWrap.insertAfter($tbWrap);
                    absFoot();
                }
                
                isIE6 && $me.css('zoom', 1);
                ofs = $tbWrap.offset();
                // 窗体滚动事件
                var $win = $(window),
                    winH,
                    headTop,
                    footTop
                ;
                $win.resize(function(e) {
                    // // 更新窗体高度
                    scrollFn();
                });
                $win.scroll(function(e) {
                    scrollFn();
                });
                scrollFn();
                // 开启或取消fixed
                $Box.delegate('.J_fixedIpt', 'click', function(e) {
                    if($(this).is(':checked')){
                        isFixed = true;
                        scrollFn();
                    }else{
                        isFixed = false;
                        opt.head && absHead();
                        opt.foot && absFoot();
                    }
                });
                // 列表数据变化时需手动触发
                $Box.bind('viewChange', function(e) {
                    scrollFn();
                });
                function scrollFn(scrollTop){
                    if(!isFixed) {
                        opt.head && absHead();
                        opt.foot && absFoot();
                        return;
                    };
                    scrollTop = scrollTop || $win.scrollTop();
                    ofs = $tbWrap.offset();
                    winH = $win.height();
                    // 表头
                    if(opt.head){
                        headTop = $thead.offset().top;
                        if(scrollTop>headTop && scrollTop < headTop+$tbWrap.height()-$tfoot.height()){
                            fixedHead(scrollTop);
                        }else{
                            absHead();
                        }
                    }
                    // 表尾
                    if(opt.foot){
                        footTop = $tfoot.offset().top;
                        // 极少情况下，IE7存在边界问题，footTop可能突然变得很大(例如tfoot的TD中使用了相对定位等复制布局)
                        if(winH+scrollTop < footTop+$tfoot.height()  && winH+scrollTop > headTop+$tfoot.height()){
                            fixedFoot(scrollTop);
                        }else{
                            absFoot();
                        }
                    }
                }
                function absHead(){
                    // hpos = $thead.position();
                    $theadWrap.css({
                        'position': 'absolute',
                        'left': pos.left,
                        'top': pos.top,
                        'z-index': 10
                    });
                }
                function fixedHead(scrollTop){
                    $theadWrap.css({
                        'position': isIE6?'absolute':'fixed',
                        'top': 0,
                        'z-index': 10
                    });
                    isIE6 && $theadWrap.css('top', scrollTop-ofs.top);
                    !isIE6 && $theadWrap.css('left', ofs.left);
                }
                function absFoot(){
                   var tpos = $tfoot.position();
                   $tfootWrap.css({
                       'position': 'absolute',
                       'left': pos.left,
                       'top': tpos.top,
                       'z-index': 10
                   });
                }
                function fixedFoot(scrollTop){
                    $tfootWrap.removeAttr('style');
                    if(isIE7){
                        //IE8会导致body下的定位浮层不能显示
                        $tfootWrap.width($tfoot.width()); 
                    }
                    $tfootWrap.css({
                        'position': isIE6?'absolute':'fixed',
                        'bottom': 0,
                        'z-index': 10
                    });
                    !isIE6 && $tfootWrap.css('left', ofs.left);
                    // $tfootWrap.show();
                    // document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-463
                    isIE6 && $tfootWrap.css('top', scrollTop+document.documentElement.clientHeight-$tfootWrap.height()-ofs.top);
                }
            });
        }
    });
    // 表头表尾与原来的表格分离，需要修正宽度问题
    function updateWidth($cur, $org){
        var $curTds, $orgTds, $orgTrs, w;
        $orgTrs = $org.find('tr');
        $cur.find('tr').each(function(i) {
            $curTds = $(this).children();
            $orgTds = $orgTrs.eq(i).children();
            $curTds.each(function(j) {
                // 保证双方宽度一致，防止宽度溢出
                w = $orgTds.eq(j).width();
                $(this).width(w);
                $orgTds.eq(j).width(w);
            });
        });
    }
})(jQuery);
