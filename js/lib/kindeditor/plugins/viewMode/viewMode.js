KindEditor.plugin('viewMode', function(K) {
        var self = this, name = 'viewMode';
        //self.toolbar.disable('viewMode'); //把可视化的图标暗掉
        var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;

        //给可视化编辑框绑定监听事件，如果有变化，马上更新textarea
        //但是图片或者文件插入的时候不更新
        iframeBody.onblur = iframeBody.onkeyup = function(e){
            console.info(iframeBody.innerHTML);
            KindEditor.query('#editor_textarea').value = iframeBody.innerHTML;
        }
        // 点击图标时执行
        self.clickToolbar(name, function() {
            if (self.designMode == true){
                return false;
            }else{
                self.designMode = true;
            }
            self.toolbar.disableAll(false);             //切换工具栏
            self.toolbar.enable('fullscreen');          //把全屏的按钮亮起来
            self.changeMode();                          //转化模式的方法，在aceEditor.js中定义
            self.cmd.inserthtml = self.oldInsertHtml;
            var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;
            iframeBody.innerHTML = KindEditor.query('#editor_textarea').value; //把textarea里面的东西丢到iframeBody


            KindEditor.query('.ke-edit').style.display = 'block';//隐藏1iframe(class="ke-edit")显示框
            KindEditor.query('.ke-statusbar').style.display = 'block';//隐藏下拉条
            KindEditor.query('#aceEditor').style.display = 'none';
        });
});