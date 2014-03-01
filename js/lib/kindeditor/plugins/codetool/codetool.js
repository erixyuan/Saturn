/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('codetool', function(K) {
    var self = this;
    var name = 'codetool';
    var oldInsertHtml, eleLast;

    var textarea_helper;
    var state = [];

    //工具栏,K.undef()，如果参数1没有定义，把参数2的值付给参数1
    var codetoolTags = K.undef( self.codetoolTags, {
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

        p : {
            text : 'P',
            prefix : '<p>',
            suffix : '</p>\n'
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

        s1 : '|',

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
            name : 'image'
        },
        insertfile : {
            title : '插入文件',
            name : 'insertfile'
        },
        template : {
            title : '模板',
            name : 'template'
        },
        pagebreak : {
            title : '插入分页符',
            name : 'pagebreak'
        },
        image:{
            title:'我的',
            name:'image'
        }
    } );





    /****/
    function TextareaHelper( textarea ){

        /**
         * 编辑器命令
         */
        this.command = function( prefix, suffix, settings )
        {
            var defaultSettings = { rule : 'normal' , eachline : true, clearBR : false };
            if(settings){
                for( k in defaultSettings){
                    if(settings[k] == undefined){
                        settings[k] = defaultSettings[k];
                    }
                }
            }
            else{
                settings = defaultSettings;
            }
            var rangeData = this.cursorPosition.get();
            var start = rangeData.start;
            var resultText = rangeData.text;
            if(settings.clearBR){
                resultText = resultText.replace(/\n/g, " ");
            }
            if(settings.rule == 'replace'){
                resultText = '';
            }

            selectedTextLengh = resultText.length;
            var lines = resultText.split("\n");


            if(settings.eachline && lines.length > 1){
                for(var n in lines){
                    if(K.trim(lines[n]).length > 0){
                        lines[n] = prefix + K.trim(lines[n]) + suffix;
                    }
                }
                resultText = lines.join("\n");
            }
            else{
                resultText = prefix + resultText + suffix;
            }

            this.cursorPosition.insert(rangeData, resultText, selectedTextLengh == 0 ? -suffix.length : 0);
            return true;
        }

        this.cursorPosition = {};
        this.cursorPosition.get = function() {
            var rangeData = { text: "", start: 0, end: 0 };

            //兼容IE和其他浏览器
            if (textarea.setSelectionRange) { // W3C
                textarea.focus();
                rangeData.start = textarea.selectionStart;  //选择区域的开始位置，
                rangeData.end = textarea.selectionEnd;      //选择区域的结束位置
                //如果选择区域数值，就获取，没有就返回''
                rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
            } else if (document.selection) { // IE
                textarea.focus();
                var i,
                oS = document.selection.createRange(),
                // Don't: oR = textarea.createTextRange()
                oR = document.body.createTextRange();
                oR.moveToElementText(textarea);

                rangeData.text = oS.text;
                rangeData.bookmark = oS.getBookmark();
                // object.moveStart(sUnit [, iCount])
                // Return Value: Integer that returns the number of units moved.
                for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                    // Why? You can alert(textarea.value.length)
                    if (textarea.value.charAt(i) == '\r') {
                        i++;
                    }
                }
                rangeData.start = i;
                rangeData.end = rangeData.text.length + rangeData.start;
            }
            return rangeData;
        }

        this.cursorPosition.set = function(rangeData){
            var oR, start, end;
            if (!rangeData) {
                alert("You must get cursor position first.")
            }
            textarea.focus();
            if (textarea.setSelectionRange) { // W3C

                textarea.setSelectionRange(rangeData.start, rangeData.end);
            } else if (textarea.createTextRange) { // IE
                oR = textarea.createTextRange();
                // Fixbug : ues moveToBookmark()
                // In IE, if cursor position at` the end of textarea, the set function don't work
                if (textarea.value.length === rangeData.start) {
                    //alert('hello')
                    oR.collapse(false);
                    oR.select();
                }
                else if(rangeData.bookmark !== undefined) {
                    oR.moveToBookmark(rangeData.bookmark);
                    oR.select();
                }
                else
                {
                    oR.collapse(true);
                    oR.moveEnd('character', rangeData.start);
                    oR.moveStart('character', rangeData.end);
                    oR.select();
                }
            }
        }
        this.cursorPosition.insert = function (rangeData, text, offsetFocus) {
            var oValue, nValue, oR, sR, nStart, nEnd, st;
            this.set(rangeData);

            if (textarea.setSelectionRange) { // W3C
                oValue = textarea.value;
                nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                nStart = nEnd = rangeData.start + text.length;
                st = textarea.scrollTop;
                textarea.value = nValue;
                // Fixbug:
                // After textarea.values = nValue, scrollTop value to 0
                if (textarea.scrollTop != st) {
                    textarea.scrollTop = st;
                }
                nStart += offsetFocus;
                nEnd += offsetFocus;
                textarea.setSelectionRange(nStart, nEnd);
            } else if (textarea.createTextRange) { // IE
                sR = document.selection.createRange();
                sR.text = text;
                sR.setEndPoint('StartToEnd', sR);
                if(offsetFocus)
                {
                    sR.collapse(true);
                    sR.moveStart('character', offsetFocus);
                    sR.moveEnd('character', offsetFocus);
                }
                sR.select();
            }
        }
    }

    /*******************/

    function afterCreate()
    {

        //創建按鈕
        self.toolbar.get('fullscreen')[0].className += ' ke-float-right';   //给全屏显示按钮设置加一个class

        K.each(codetoolTags, function( k, option ){

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
                span.setAttribute('data-name', 'codetool-' + k);
                span.className = 'ke-outline';

                if( option.name ){
                    span.innerHTML = '<span unselectable="on" class="ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + option.name + ' ke-icon-codetool-' + k + '"></span>';;
                }
                else{
                    span.innerHTML = '<span style="' + (option.style ? option.style : '') + '" unselectable="on" class="ke-toolbar-icon ke-toolbar-btn ke-icon-' + 'codetool-' + k + '">' + option.text + '</span>';;
                }
                self.toolbar.div[0].appendChild(span);
            }

        });

        //
        textarea_helper = new TextareaHelper( self.edit.textarea[0] );

        //K('head',self.edit.iframe[0].contentWindow.document).append('<link rel="stylesheet" type="text/less" href="/themes/sspai/_res/typo.less" media="all" />');
        var eleScript = document.createElement('script');
        K('head',self.edit.iframe[0].contentWindow.document).append(eleScript);


        if( self.edit.textarea.val().length < 2 ){
            //self.edit.textarea.val('<br />');
        }
    }

    function afterModelChange(){

        if( self.designMode ){
            //如果是设计模式，隐藏自定义的工具，就是给每个span，加上ke-display
            K.each(codetoolTags, function( k, option ){
                self.toolbar.disable('codetool-' + k);  //这样的写法
            });
            //inserthtml
            if( oldInsertHtml ){
                self.cmd.inserthtml = oldInsertHtml;
            }
        }
        else{
            //如果是代码模式，显示自定义的工具
            K.each(codetoolTags, function( k, option ){
                self.toolbar.enable('codetool-' + k);
            });

            //inserthtml
            oldInsertHtml = self.cmd.inserthtml;

            //给cmd加入插入代码的方法
            self.cmd.inserthtml = function(val, quickMode){
                console.debug(val);
                if (!self.isCreated) {
                    return self;
                }
                val = self.beforeSetHtml(val);
                console.debug(val);
                textarea_helper.command( '', val, {} );
                return self;
            }
        }
        //hide，隐藏className中有disabled，意思就是不显示多余的按钮
        K('span', self.div).each(function() {
            if( this.className.indexOf('disabled') >= 0 ){
                K(this).hide();
            } else if( this.className.indexOf('ke-separator') >= 0 ) {
                if ( this.className.indexOf('codetool') >= 0 ) {
                    self.designMode ? K(this).hide() : K(this).show();
                } else {
                    self.designMode ? K(this).show() : K(this).hide();
                }
            } else {
                K(this).show();
            }
        });

    }



    afterCreate();
    afterModelChange();


    /*self.handler('afterCreate', function(){
        afterCreate();
        afterModelChange();
    })*/

    //模式切換事件
    self.clickToolbar('source', function() {
        afterModelChange();
    });

    //给每个自定义的按钮都绑定事件
    K.each(codetoolTags, function(name, option) {
        self.clickToolbar('codetool-' + name, function() {
            var options = codetoolTags[name].options;
            if( codetoolTags[name].name ){
                self.loadPlugin(codetoolTags[name].name, function() {
                    self.handler( 'clickToolbar' + codetoolTags[name].name );
                });
            }
            else if( codetoolTags[name].full ){
                textarea_helper.command( codetoolTags[name].prefix , codetoolTags[name].suffix, options);
            }
            else{
                var rangeData = textarea_helper.cursorPosition.get();

                if( rangeData.text.length ){
                    textarea_helper.command( codetoolTags[name].prefix, codetoolTags[name].suffix, options );
                }
                else{
                    if( state[name] ){
                        delete(state[name])
                        textarea_helper.command( codetoolTags[name].suffix, '', options );
                    }
                    else{
                        state[name] = true;
                        textarea_helper.command( codetoolTags[name].prefix, '', options );
                    }
                }
            }
        });

    });
    //*/
});
