tableFixed
==========

基于jQuery的表头表尾固定组件

==========
table的表头表尾fixed效果,使用浏览器滚动条。兼容IE6
要求表头表尾必须在thead tfoot内
by esky 2014-02-13

* 步骤1：table加入外部布局容器e-tbWrap, 并生成最外层包裹容器e-tableFixedWrap
* 步骤2：将table中的thead或tfoot克隆放入e-theadWrap或e-tfootWrap中(与e-tbWrap同级)
* 步骤3：必要的话调整克隆后的列宽度
* 步骤4：加入scroll事件处理，克隆后的表头表尾在滚动边界时fixed显示(即始终可见)
* 注意1：克隆的表头尾将掩盖原来的，即原来的不可见。交互操作都在克隆的表头尾上。
* 注意2：最好给表头各列定义固定宽度，固定宽度后表格内容要合适不可溢出
* 注意3：当table-layout=fixed 时 最好使用<colgroup><col width=90></col></colgroup>固定列宽度
* 注意4：td中最好别使用定位元素，否则IE678容易出现兼容问题。
