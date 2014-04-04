/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('pagebreak', function(K) {
	var self = this;
	var name = 'pagebreak';
	//var pagebreakHtml = K.undef(self.pagebreakHtml, '<hr style="page-break-after: always;" class="ke-pagebreak" />');
	var pagebreakHtml = K.undef(self.pagebreakHtml, '<div style="page-break-after:always;height:auto;font-size:100%;text-align:center; background:#333; border-radius:1000px;border:none;color:#fff; margin:2px 0;" class="ke-pagebreak" >PageTitle</div>');
	var pagebreakTag = K.undef(self.pagebreakTag, '##page_break_tag##');;

	self.changePagebeak = function(){
		var textContent = KindEditor.query('#js_editor_textarea').value;
		//因为切换的时候，这个函数先跑，所以点击source的时候，这里的模式还是当前模式，没有切换
		if(self.designMode == true){
			//当现在是设计模式，把textarea的内容正则改变
			//var reg = /<div style="[^"]*" class="ke-pagebreak" >(.*)<\/div><br>/ig;
			//var reg1 = /<div style="[^"]*" class="ke-pagebreak" >(((?!<\/div>).)*)<\/div>/ig;
			var reg1 = /<div.*?pagebreak.*?>(.*?)<\/div>/ig;
			KindEditor.query('#js_editor_textarea').value = textContent.replace(reg1,
				function(){
					return '<!--' + pagebreakTag +arguments[1] +pagebreakTag + '-->'
				}
			);
		}else{
			var reg = new RegExp( '<\!\-\-' + pagebreakTag + '(((?!' + pagebreakTag + ').)*)' + pagebreakTag + '\-\-\>', 'igm' );
			KindEditor.query('#js_editor_textarea').value = textContent.replace(reg, function($1){
				var _reg = new RegExp( '<\!\-\-' + pagebreakTag + '(((?!' + pagebreakTag + ').)*)' + pagebreakTag + '\-\-\>', 'im' );
				return pagebreakHtml.replace('PageTitle', $1.match(_reg)[1] );
			});
		}
	}


	self.clickToolbar(name, function() {
		var tail = self.newlineTag == 'br' || K.WEBKIT ? '' : '<p id="__kindeditor_tail_tag__"></p>';
		if( self.designMode ){
			self.insertHtml(pagebreakHtml + tail);
		}
		else
		{
			self.insertHtml(
				'<!--' + pagebreakTag +
				'pagetitle' +
				pagebreakTag + '-->'
			);
		}
	});
});
