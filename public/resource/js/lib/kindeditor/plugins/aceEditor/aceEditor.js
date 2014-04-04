KindEditor.plugin('aceEditor', function(K) {
        var self = this, name = 'aceEditor';

        var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;
        //给可视化编辑框绑定监听事件，如果有变化，马上更新textarea
        //但是图片或者文件插入的时候不更新
        iframeBody.onkeyup = function(e){
            KindEditor.query('#js_editor_textarea').value = iframeBody.innerHTML;
            console.info(iframeBody.innerHTML);
        }
        // 绑定textarea的粘贴事件
        var KNodeIframBody = KindEditor(iframeBody); // 把编辑器可视化编辑区区域实例化为Knode对象

        // 1.生成图标
        // 2.绑定图标事件
        // 工具栏,K.undef()，如果参数1没有定义，把参数2的值付给参数1
        var codetoolTags = K.undef( self.codetoolTags, {
            H : {
                h1 : {
                    text : 'H1',
                    prefix : '<h1>',
                    suffix : '</h1>\n'
                },
                h2 : {
                    text : 'H2',
                    prefix : '<h2>',
                    suffix : '</h2>\n'
                },
                h3 : {
                    text : 'H3',
                    prefix : '<h3>',
                    suffix : '</h3>\n'
                },
                h4 : {
                    text : 'H4',
                    prefix : '<h4>',
                    suffix : '</h4>\n'
                },
                h5 : {
                    text : 'H5',
                    prefix : '<h5>',
                    suffix : '</h5>\n'
                },
                h6 : {
                    text : 'H6',
                    prefix : '<h6>',
                    suffix : '</h6>\n'
                },
            },
            p : {
                    text : 'P<span title="單段落加P"></span>',
                    prefix : '<p>',
                    suffix : '</p>\n'
            },
            p2 : {
                    text : 'P<sup title="全段落加P">all</sup>',
                    prefix : '<p>',
                    suffix : '</p>\n'
            },
            s8 : '|',
            strong : {
                text : 'B',
                prefix : '<strong>',
                suffix : '</strong>',
                style : 'font-weight: bold;',
                options : { eachline : false }
            },
            em : {
                text : 'I',
                prefix : '<em>',
                suffix : '</em>',
                style : 'font-style:italic;',
                options : { eachline : false }
            },
            u : {
                text : 'U',
                prefix : '<u>',
                suffix : '</u>',
                style : ' text-decoration: underline;',
                options : { eachline : false }
            },
            del : {
                text : 'T',
                prefix : '<s>',
                suffix : '</s>',
                style : 'text-decoration:line-through;',
                options : { eachline : false }
            },
            s0 : '|',

            blockquote : {
                text : 'b-quote',
                prefix : '<blockquote>',
                suffix : '</blockquote>'
            },
            s2 : '|',
            ul : {
                text : 'ul',
                prefix : '<ul>\n',
                suffix : '\n</ul>\n',
                options : { eachline : false }
            },
            ol : {
                text : 'ol',
                prefix : '<ol>\n',
                suffix : '\n</ol>\n',
                options : { eachline : false }
            },
            s3 : '|',
            li : {
                text : 'li',
                prefix : '<li>',
                suffix : '</li>\n'
            },
            s4 : '|',
            code : {
                text : 'code',
                prefix : '<code>\n',
                suffix : '\n</code>\n'
            },
            s5 : '|',
            link : {
                text : 'link',
                prefix : '<a href="">',
                suffix : '</a>',
                full : true
            },
            s6 : '|',
            img : {
                text : 'img',
                prefix : '<img src="',
                suffix : '" alt="" />',
                full : true
            },
            s7 : '|',
            image : {
                title : '图片',
                pluginName : 'image'  //有name的代表是插件模式
            },
            insertfile : {
                title : '插入文件',
                pluginName : 'insertfile'
            },
            template : {
                title : '模板',
                pluginName : 'template'
            },
            pagebreak : {
                title : '插入分页符',
                pluginName : 'pagebreak'
            }
        });

        /*******************************
         * 创建按钮
         ******************************/
        self.toolbar.get('fullscreen')[0].className += ' ke-float-right';   //给全屏显示按钮设置加一个class
        KindEditor.each(codetoolTags, function( k, option ){
            //如果和分割线，创建span，加上样式，增加在工具栏的div后面
            if( option == '|' ){
                span = document.createElement('span');
                span.className = 'ke-inline-block ke-separator ke-codetool-separator';
                self.toolbar.div[0].appendChild(span);
            }
            else{
                var span = document.createElement('span');
                span.setAttribute('unselectable', 'on');
                span.setAttribute('title', option.title ? option.title : option.text);
                span.setAttribute('data-name', 'codetool-' + k);    //工具栏的click事件是通过data-name来获取相应的对象的
                span.className = 'ke-outline';

                if( option.pluginName ){
                    span.innerHTML = '<span unselectable="on" class="ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + option.pluginName + ' ke-icon-codetool-' + k + '"></span>';
                }
                //创建下拉的段落符号‘H’
                else if(k == 'H'){
                    span.innerHTML = '<span style="' + (option.style ? option.style : '') + '" unselectable="on" class="ke-toolbar-icon ke-toolbar-btn ke-icon-' + 'codetool-' + k + '">' + k + '</span>';
                }
                else{
                    span.innerHTML = '<span style="' + (option.style ? option.style : '') + '" unselectable="on" class="ke-toolbar-icon ke-toolbar-btn ke-icon-' + 'codetool-' + k + '">' + option.text + '</span>';
                }
                self.toolbar.div[0].appendChild(span);
            }
        });

        /**
         * 定义工具栏所有工具的功能
         * 1.像img这样的工具，就沿用他原来的
         * 2. p,h这些工具全部自定义
         */
        KindEditor.each(codetoolTags, function(toolName, option) {
            //加载插件
            if (codetoolTags[toolName].pluginName) {
                self.loadPlugin(codetoolTags[toolName].pluginName);
            };
            self.clickToolbar('codetool-' + toolName, function() {
                var options = codetoolTags[toolName].options;
                // 1.如果是插件就是加载插件使用
                if( codetoolTags[toolName].pluginName ){
                    self.handler( 'clickToolbar' + codetoolTags[toolName].pluginName );
                }
                // 2.如果有full，就直接插入字符串，不判断是否有选择区域
                else if( codetoolTags[toolName].full ){
                    aceEditor.insert(codetoolTags[toolName].prefix+codetoolTags[toolName].suffix);
                }
                else if(toolName == 'p2'){
                    // 获取选择区域的内容
                    var textRangeContent = aceEditor.session.getTextRange(aceEditor.getSelectionRange());
                    var textArr = textRangeContent.split('\n');
                    for (var i = 0; i < textArr.length; i++) {
                        textArr[i] = codetoolTags[toolName].prefix+textArr[i]+codetoolTags[toolName].suffix
                    };
                    var newContetn = textArr.join('\n');
                    aceEditor.insert(newContetn);
                }
                // 3.如果是H，有下拉
                else if(toolName == 'H'){
                    var blocks = {
                        h1:'标题1',
                        h2:'标题2',
                        h3:'标题3',
                        h4:'标题4',
                    };
                    var heights = {
                            h1 : 28,
                            h2 : 24,
                            h3 : 18,
                            H4 : 14,
                        };
                    var curVal = self.cmd.val('formatblock');
                    var menu = self.createMenu({
                            name : 'codetool-H',
                            width : self.langType == 'en' ? 200 : 150
                        });
                    KindEditor.each(blocks, function(key, val) {
                        var style = 'font-size:' + heights[key] + 'px;';
                        if (key.charAt(0) === 'h') {
                            style += 'font-weight:bold;';
                        }
                        menu.addItem({
                            title : '<span style="' + style + '" unselectable="on">' + val + '</span>',
                            height : heights[key] + 12,
                            click : function(e) {
                                //var key = this[0].getElementsByTagName('span')[0].innerHTML;
                                // 获取选择区域的内容
                                var textRangeContent = aceEditor.session.getTextRange(aceEditor.getSelectionRange());
                                // 组装
                                var newContetn = codetoolTags['H'][key].prefix + textRangeContent +codetoolTags['H'][key].suffix;
                                // 移除旧的
                                aceEditor.remove();
                                // 插入新的
                                aceEditor.insert(newContetn);
                                //根据尾部字符，插入
                                for (var i = 0; i < codetoolTags['H'][key].suffix.length; i++) {
                                    aceEditor.selection.moveCursorLeft();
                                };
                                self.hideMenu();
                            }
                        });
                    });
                }
                // 4.获取字符范围然后插入
                else{
                    // 获取选择区域的内容
                    var textRangeContent = aceEditor.session.getTextRange(aceEditor.getSelectionRange());
                    // 组装
                    var newContetn = codetoolTags[toolName].prefix + textRangeContent +codetoolTags[toolName].suffix;
                    // 移除旧的
                    aceEditor.remove();
                    // 插入新的
                    aceEditor.insert(newContetn);
                    //根据尾部字符，插入
                    for (var i = 0; i < codetoolTags[toolName].suffix.length; i++) {
                        aceEditor.selection.moveCursorLeft();
                    };
                }
                KindEditor.query('#js_editor_textarea').value = aceEditor.getValue();
            });

        });


        //保存系统自带的inserthtml
        self.cmd.inserthtml = self.oldInsertHtml = function(val, quickMode) {
            var self = this, range = self.range;
            if (val === '') {
                return self;
            }
            function pasteHtml(range, val) {
                val = '<img id="__kindeditor_temp_tag__" width="0" height="0" style="display:none;" />' + val;
                var rng = range.get();
                if (rng.item) {
                    rng.item(0).outerHTML = val;
                } else {
                    rng.pasteHTML(val);
                }
                var temp = range.doc.getElementById('__kindeditor_temp_tag__');
                temp.parentNode.removeChild(temp);
                var newRange = _toRange(rng);
                range.setEnd(newRange.endContainer, newRange.endOffset);
                range.collapse(false);
                self.select(false);
            }
            function insertHtml(range, val) {
                var doc = range.doc,
                    frag = doc.createDocumentFragment();
                K('@' + val, doc).each(function() {
                    frag.appendChild(this);
                });
                range.deleteContents();
                range.insertNode(frag);
                range.collapse(false);
                self.select(false);
            }
            //_IERANGE = !window.getSelection;
            if (!window.getSelection && quickMode) {
                try {
                    pasteHtml(range, val);
                } catch(e) {
                    insertHtml(range, val);
                }
                return self;
            }
            insertHtml(range, val);

            //插入后刷新textarea
            var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;
            KindEditor.query('#js_editor_textarea').value = iframeBody.innerHTML;
            return self;
        }
        //自定义inserhtml
        self.newInserHtml = function(val, quickMode){
            //从ACE获取插入的行列
            aceEditor.insert(val);
            KindEditor.query('#js_editor_textarea').value = aceEditor.getValue();
        };

        /**
         * [_nativeCommand 重写kindEditor中的方法，执行execCommands的命令]
         * @param  {[type]} doc [description]
         * @param  {[type]} key [description]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        KindEditor.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
            'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
            'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
            self.clickToolbar(name, function() {
                var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;
                KindEditor.query('#js_editor_textarea').value = iframeBody.innerHTML;
            });
        });


        self._handlers.clickToolbarformatblock[0] =  function() {
            var blocks = self.lang('formatblock.formatBlock'),
                heights = {
                    h1 : 28,
                    h2 : 24,
                    h3 : 18,
                    H4 : 14,
                    p : 12
                },
                curVal = self.cmd.val('formatblock'),
                menu = self.createMenu({
                    name : 'formatblock',
                    width : self.langType == 'en' ? 200 : 150
                });
            KindEditor.each(blocks, function(key, val) {
                var style = 'font-size:' + heights[key] + 'px;';
                if (key.charAt(0) === 'h') {
                    style += 'font-weight:bold;';
                }
                menu.addItem({
                    title : '<span style="' + style + '" unselectable="on">' + val + '</span>',
                    height : heights[key] + 12,
                    checked : (curVal === key || curVal === val),
                    click : function() {
                        self.select().exec('formatblock', '<' + key + '>').hideMenu();
                        //加入刷新
                        var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;
                        KindEditor.query('#js_editor_textarea').value = iframeBody.innerHTML;
                    }
                });
            });
        };


        /**
         * 编辑模式切换的事件
         */
        self.changeMode = function(){
            //点击按钮，首先切换模式
            if (self.designMode == false){
                self.designMode = true;
            }else{
                self.designMode = false;
            }
            //****如果是设计模式****
            if( self.designMode ){
                self.toolbar.disableAll(false);             //切换工具栏
                self.toolbar.enable('fullscreen');          //把全屏的按钮亮起来
                // 把代码模式的工具隐藏起来
                K.each(codetoolTags, function( k, option ){
                    self.toolbar.disable('codetool-' + k);
                });
                self.cmd.inserthtml = self.oldInsertHtml;   // 覆盖原来的插入html的方法
                var iframeBody = KindEditor.query('.ke-edit-iframe').contentWindow.document.body;
                iframeBody.innerHTML = KindEditor.query('#js_editor_textarea').value; //把textarea里面的东西丢到iframeBody
                KindEditor.query('.ke-edit').style.display = 'block';//隐藏1iframe(class="ke-edit")显示框
                KindEditor.query('.ke-statusbar').style.display = 'block';//隐藏下拉条
                KindEditor.query('#js_aceEditor').style.display = 'none';
            }
            //****如果是代码模式****
            else{
                self.toolbar.disable('fullscreen'); //把全屏的按钮暗掉
                self.toolbar.disableAll(true);
                //如果是代码模式，显示自定义的工具
                KindEditor.each(codetoolTags, function( k, option ){
                    self.toolbar.enable('codetool-' + k);
                });
                var html = KindEditor.query('#js_editor_textarea').value;
                aceEditor.setValue(html);   //把textarea的数据放入ACE中
                self.cmd.inserthtml = self.newInserHtml;
                KindEditor.query('.ke-edit').style.display = 'none';//隐藏1iframe(class="ke-edit")显示框
                KindEditor.query('.ke-statusbar').style.display = 'none';//隐藏下拉条
                KindEditor.query('#js_aceEditor').style.display = 'block';
                aceEditor.selection.selectFileStart();
            }
            //hide，隐藏className中有disabled，意思就是不显示多余的按钮
            KindEditor('span', self.div).each(function() {
                if( this.className.indexOf('disabled') >= 0 ){
                    KindEditor(this).hide();
                } else if( this.className.indexOf('ke-separator') >= 0 ) {
                    if ( this.className.indexOf('codetool') >= 0 ) {
                        self.designMode ? KindEditor(this).hide() : KindEditor(this).show();
                    } else {
                        self.designMode ? KindEditor(this).show() : KindEditor(this).hide();
                    }
                } else {
                    KindEditor(this).show();
                }
            });
        }

        self.changeMode();  //初始化才做

        //按钮触发程序入口 等于 self.clickToolbar('source', function() {})
        self._handlers.clickToolbarsource[0] = function(){
            self.changePagebeak(); //正则表达式，换页符
            self.changeMode();
        }

        KindEditor("form").unbind('submit');//解除submit的绑定
        //再重新绑定事件
        //当文件提交的时候，如果是设计模式，把内容里面的正则替换掉，代码模式不用处理
        $('#js_editor_textarea').parents('form')[0].onsubmit = function(){
            if (self.designMode == true) {
                self.changePagebeak(); //正则表达式，换页符
            };

        }

        // 判断如果是移动端，就显示文本编辑器
        if(!Saturn.IsPC()){
            $('#js_aceEditor').hide();
            $('#js_editor_textarea').css({
                'width': '98.5%',
                'min-height':'500px'
            })
            $('#js_editor_textarea').show();
            $('span[data-name=source]').hide();
            $('#js_editor_textarea').on('keyup click blur',function(){
                aceEditor.setValue($(this).val())
                console.log(getTextareaCursor('#js_editor_textarea'));
                aceEditor.moveCursorToPosition(getTextareaCursor('#js_editor_textarea'));
                aceEditor.clearSelection()
            })

            // 分析出光标在textarea中的位置
            // 包括换行符
            // dom.selectionStart()
        }else{
            // 事件监听， 当ace内容变化的时候，写入textarea
            aceEditor.getSession().on('change', function(e) {
                KindEditor.query('#js_editor_textarea').value = aceEditor.getValue();
            });
        }

        function getTextareaCursor(domId){
            var textLengh = $(domId)[0].selectionStart;
            var valueArr = $(domId).val().split('\n');
            var length = 0;
            var obj = {
                row:0,
                column:0
            }
            for(var i =0 ; i<valueArr.length; i++){
                if(textLengh < valueArr[i].length){
                    obj.row = i;   //确定行的位置
                    obj.column = textLengh;
                    return obj;
                }
                else if(textLengh == valueArr[i].length){
                    obj.row = i;
                    obj.column = textLengh;
                    return obj;
                }
                else{
                    textLengh -= (valueArr[i].length+1);
                }
            }

        }
});