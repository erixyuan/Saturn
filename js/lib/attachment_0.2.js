// 附件總管
// eric 2014-1-9
// 整理js的時候給他命名_0.2.js


/**
 * SWFUploadManager
 *
 * @param mixed \settings Description.
 *
 * @access public
 *
 * @return mixed Value.
 */

// 如果没有indexOf 方法，加上,兼容IE8
if (!Array.prototype.indexOf) {
   Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}

// 上传图片的主要方法
function SWFUploadManager(settings)
{
    var defaultSettings = {
        baseURL : '/',
        debug : false
    };
    for(key in defaultSettings )
    {
        if( ! ( key in settings ) )
        {
            settings[key] = defaultSettings[key];
        }
    }


    var instance;
    // var fileList = document.getElementById(settings.fileListID);
    // fileList.innerHTML = '<ul class="clearfix"></ul>';
    // fileList = fileList.firstChild;
    var statuss = { success : '上传成功', pending : '等待上传', error : '未知错误', uploading : '上传中' };


    function SWFUploadFileProgress( file ){
        var swf_file = file;
        var fileDom;
        function status(){
            return fileDom.getAttribute('data-file-status');
        }

        function setName( name ){
            fileDom.childNodes[1].innerHTML = name;
        }

        function setSize( filesize ){
            var units = [ 'Bytes', 'K', 'M', 'G' ];
            unit_index = 0
            while( filesize >= 1024 )
            {
                filesize = filesize / 1024;
                unit_index++;
            }
            fileDom.childNodes[2].innerHTML = '(' + filesize.toFixed(2) + units[unit_index] + ')';
        }

        function setStatus( status ){
            if( status in statuss ){
                fileDom.setAttribute('data-file-status', status);

                if( status == 'success' )
                {
                    //fileDom.childNodes[4].childNodes[0].innerHTML = '确认';
                }

                status = statuss[status];
            }else{
                fileDom.setAttribute('data-file-status', 'error');
                status = '<em class="file-status-error">' + status + '</em>';
            }
            fileDom.childNodes[3].innerHTML = status;
        }

        function setProgress( percent ){
            fileDom.childNodes[3].innerHTML = '<span class="progress progress-striped active"><span class="bar" style="width: ' + percent + '%;"></span></span>';
        }

        this.setStatus = function( status ){
            setStatus(status)
        }

        this.setProgress = function( percent ){
            setProgress( percent );
        };

        function deleteFile(){
            var file_status = status();
            switch(file_status)
            {
                case 'uploading':
                case 'pending':
                    instance.cancelUpload(swf_file.id);
                    break;
                case 'success':
                case 'error':
                default:
                    removeProgress();
                    break;
            }
        }

        function removeProgress(){
            fileDom.parentNode.removeChild(fileDom);
        }

        this.removeProgress = function(){
            removeProgress();
        }

        function init(){
            fileDom = document.getElementById( file.id );

            if( ! fileDom )
            {
                fileDom = document.createElement("li");
                fileDom.id = file.id;
                fileDom.className = 'swfupload-list-file';
                fileDom.innerHTML =
                '<i class="icon-upload"></i><span class="filename"></span><span class="filesize"></span>' +
                '<span class="status"></span><span class="actions"><a class="delete" href="javascript:void(0);">删除</a></span>';
                setName(file.name);
                setSize(file.size);
                setStatus( 'pending' );
                //fileList.appendChild(fileDom);

                fileDom.childNodes[4].childNodes[0].onclick = function ( e ) {
                    deleteFile();
                    if (e && e.stopPropagation)
                        e.stopPropagation()
                    else
                        window.event.cancelBubble=true
                };
            }
        }
        init();
    }//SWFUploadFileProgress

    //handler

    function fileQueued(file) {
        new SWFUploadFileProgress(file);
    }

    function fileQueueError(file, errorCode, message) {
        try {
            if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
                return;
            }

            var progress = new SWFUploadFileProgress(file);
            progress.setError();
            progress.toggleCancel(false);

            switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                progress.setStatus("File is too big.");
                this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                progress.setStatus("Cannot upload Zero Byte files.");
                this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                progress.setStatus("Invalid File Type.");
                this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            default:
                if (file !== null) {
                    progress.setStatus("Unhandled Error");
                }
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    function fileDialogComplete(numFilesSelected, numFilesQueued) {
        instance.startUpload();
    }

    function uploadStart(file) {
        debugger;
        // var progress = new SWFUploadFileProgress(file);
        // progress.setStatus( 'uploading' );
        // return true;
    }

    function uploadProgress(file, bytesLoaded, bytesTotal) {
        var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
        var progress = new SWFUploadFileProgress(file);
        progress.setProgress(percent);
    }

    function uploadSuccess(file, result) {
        var progress = new SWFUploadFileProgress(file);
        try{
            result = eval( '(' + result + ')' );
        }
        catch(ex)
        {
            console.debug(result);
        }

        if( result.error )
        {
            progress.setStatus( result.error );
        }
        else
        {
            progress.setStatus( 'success' );
            if ( 'uploadSuccessCallback' in settings )
            {
                settings.uploadSuccessCallback(result);
            }
        }
    }

    function uploadError(file, errorCode, message) {
        try {
            var progress = new SWFUploadFileProgress(file);
            switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                progress.setStatus("Upload Error: " + message);
                this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                progress.setStatus("Upload Failed.");
                this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                progress.setStatus("Server (IO) Error");
                this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                progress.setStatus("Security Error");
                this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                progress.setStatus("Upload limit exceeded.");
                this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                progress.setStatus("Failed Validation.  Upload skipped.");
                this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                progress.setStatus("取消");
                setTimeout(function(){
                    progress.removeProgress();
                }, 500)
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                progress.setStatus("Stopped");
                break;
            default:
                progress.setStatus("Unhandled Error: " + errorCode);
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    function uploadComplete(file) {
        if (this.getStats().files_queued === 0) {
            if( 'uploadAllCompleteCallback' in settings )
                settings.uploadAllCompleteCallback();
        }
        else
        {
            instance.startUpload();
        }
    }

    // This event comes from the Queue Plugin
    function queueComplete(numFilesUploaded) {
        //var status = document.getElementById("divStatus");
        //status.innerHTML = numFilesUploaded + " file" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
    }

    this.startUpload = function()
    {
        instance.startUpload();
    }

    //end of handler

    function init()
    {
        debugger;
        instance = new SWFUpload({
            file_post_name : "file",
            upload_url : settings.baseURL + "ipa/attachment",    //处理上传文件的服务器端页面的url地址
            post_params: settings.post_params,                      //附加文章上传属性
            flash_url : settings.swfUrl,
            file_size_limit : "2000 MB" ,
            button_image_url: settings.btnImgUrl,
            button_width: "90",
            button_height: "22",
            button_placeholder_id: settings.uploadButtonID,
            button_cursor : SWFUpload.CURSOR.HAND,
            button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
            //button_text_left_padding: 12,
            //button_text_top_padding: 3
            //button_text : "<b>Click</b> <span class="redText">here</span>",
            //button_text_style : ".redText { color: #FF0000; }",
            //button_text_left_padding : 3,
            //button_text_top_padding : 2,

            file_queued_handler : fileQueued,
            // file_queue_error_handler : fileQueueError,
            file_dialog_complete_handler : fileDialogComplete,

            upload_start_handler : settings.uploadStart,
            upload_progress_handler : uploadProgress,
            upload_error_handler : uploadError,
            upload_success_handler : uploadSuccess,

            upload_complete_handler : uploadComplete,
            queue_complete_handler : queueComplete,  // Queue plugin event

            debug : settings.debug
        });
    }

    init();
}


function AttachmentList( settings )
{
    var defaultSettings = {
        baseURL : '/'
    };
    for(key in defaultSettings )
    {
        if( ! ( key in settings ) )
        {
            settings[key] = defaultSettings[key];
        }
    }

    var APIURL = {
        list : settings.baseURL + 'attachment/list',
        remove : settings.baseURL + 'attachment/remove'
    }
    var _attachments;
    var self = this;

    if( 'window' in settings ){

        var windowID = 'AttachmentList' + ( parseInt( Math.random()*(99999-10000)+10000 ) );
        var windowDom = document.createElement('div');
        windowDom.className = 'modal hide fade in';
        windowDom.id = windowID;
        windowDom.innerHTML =
            '<div class="modal-body" id="' + windowID + '-body"></div>' +
            '<div class="modal-footer">' +
                '<a href="javascript:void(0);" class="btn">刷新</a>' +
                '<a href="javascript:void(0);" data-dismiss="modal" class="btn btn-primary">确定</a>' +
            '</div>';

        windowDom.childNodes[1].childNodes[0].onclick = function(){
            refresh();
        }
        document.getElementsByTagName('body')[0].appendChild(windowDom);
        settings.parentID = windowID + '-body';
    }



    var listDom = document.getElementById(settings.parentID);
    listDom.appendChild(document.createElement('ul'));
    listDom = listDom.firstChild;
    listDom.className = "clearfix attachment-list attachment-list-" + ( settings.style ? settings.style : 'line' );

    function addAttachment( attachment )
    {
        switch(settings.style)
        {
            case 'cell':
                addCellAttachment(attachment);
                break;
            case 'icon':
                addIconAttachment(attachment);
                break;
            default:
                settings.style = 'line';
                addLineAttachment(attachment);
                break;
        }
    }

    function addCellAttachment(attachment)
    {
        var attachmentDom = document.createElement("li");
        attachmentDom.id = settings.parentID + '-attachment-' + attachment.id;
        attachmentDom.setAttribute("data-attachment-id", attachment.id);

        attachmentDom.innerHTML =
        '<img src="' + attachment.url + '" alt="" /><span class="bottom"><span class="filename">' + attachment.filename + '</span>' +
        '<span class="actions"></span></span>';

        if( 'picked' in settings && attachment.id == settings.picked() )
        {
            attachmentDom.className = 'pick';
        }

        listDom.appendChild(attachmentDom);



        var actionsParentDom = attachmentDom.childNodes[1].childNodes[1];
        //delete
        var deleteADom = document.createElement("a");
        deleteADom.innerHTML = '删除';
        deleteADom.className = "delete";
        deleteADom.href = "javascript:vold(0);";

        deleteADom.onclick = function ( e ) {
            if( confirm('确定删除附件?') )
            {
                deleteAttachment( attachment );
            }
            if (e && e.stopPropagation)
                e.stopPropagation()
            else
                window.event.cancelBubble=true
            return false;
        };
        actionsParentDom.appendChild(deleteADom);

        //pick
        appendPickButton( attachment, attachmentDom );

        //insert
        appendInsertButton( attachment, actionsParentDom );
    }

    function addLineAttachment( attachment )
    {
        var attachmentDom = document.createElement("li");
        attachmentDom.id = settings.parentID + '-attachment-' + attachment.id;
        attachmentDom.setAttribute("data-attachment-id", attachment.id);
        attachmentDom.innerHTML =
        '<i class="icon-file"></i><span rel="tooltip" class="filename">' + attachment.filename + '</span><span class="filesize">' + formatFileSize(attachment.filesize) + '</span>' +
        '<span class="type"></span><span class="actions"></span>';

        if( 'picked' in settings && attachment.id == settings.picked() )
        {
            attachment.className = 'pick';
        }

        listDom.appendChild(attachmentDom);

        //delete
        var deleteADom = document.createElement("a");
        deleteADom.innerHTML = '删除';
        deleteADom.className = "delete";
        deleteADom.href = "javascript:vold(0);";

        deleteADom.onclick = function ( e ) {

            if( confirm('确定删除附件?') )
            {
                deleteAttachment( attachment );
            }
            if (e && e.stopPropagation)
                e.stopPropagation()
            else
                window.event.cancelBubble=true
            return false;
        };
        attachmentDom.childNodes[4].appendChild(deleteADom);

        //pick
        appendPickButton( attachment, attachmentDom );
        //insert
        appendInsertButton( attachment, attachmentDom.childNodes[4] );
    }


    function addIconAttachment(attachment)
    {
        var attachmentDom = document.createElement("li");
        attachmentDom.id = settings.parentID + '-attachment-' + attachment.id;
        attachmentDom.setAttribute("data-attachment-id", attachment.id);

        attachmentDom.innerHTML =
        '<img src="' + attachment.thumb_url_1 + '" alt="" /><span class="bottom"><span class="filename">' + attachment.filename + '</span>' +
        '<span class="actions"></span></span>';

        if( 'picked' in settings && attachment.id == settings.picked() )
        {
            attachmentDom.className = 'pick';
        }

        listDom.appendChild(attachmentDom);



        var actionsParentDom = attachmentDom.childNodes[1].childNodes[1];
        //delete
        var deleteADom = document.createElement("a");
        deleteADom.innerHTML = '删除';
        deleteADom.className = "delete";
        deleteADom.href = "javascript:vold(0);";

        deleteADom.onclick = function ( e ) {

            if( confirm('确定删除附件?') )
            {
                deleteAttachment( attachment );
            }
            if (e && e.stopPropagation)
                e.stopPropagation()
            else
                window.event.cancelBubble=true
            return false;
        };
        actionsParentDom.appendChild(deleteADom);

        //pick
        appendPickButton( attachment, attachmentDom );

        //insert
        appendInsertButton( attachment, actionsParentDom );
    }

    function appendPickButton( attachment, attachmentDom )
    {
        if( 'pick' in settings )
        {
            attachmentDom.onclick = function( e ){
                pick(this, attachment, settings.pick);
                if (e && e.stopPropagation)
                    e.stopPropagation();
                else
                    window.event.cancelBubble=true;
            }
        }
    }

    function appendInsertButton( attachment, actionsParentDom )
    {
        if( 'insert' in settings )
        {
            var insertADom = document.createElement("a");
            insertADom.innerHTML = '插入';
            insertADom.className = "insert";
            insertADom.href = "javascript:vold(0);";

            insertADom.onclick = function( e ){
                settings.insert( attachment );
                if (e && e.stopPropagation)
                    e.stopPropagation()
                else
                    window.event.cancelBubble=true
                return false;
            }

            if(actionsParentDom.firstChild){
                actionsParentDom.insertBefore( insertADom, actionsParentDom.firstChild );
            } else {
                actionsParentDom.appendChild( insertADom );
            }
        }
    }

    function pick( attachmentDom, attachment, callback )
    {
        if( attachmentDom.className.split(' ').indexOf('pick') >= 0 )
        {
            attachmentDom.className = attachmentDom.className.replace('pick', '');
            callback( null );
        }
        else
        {
            for(var i in listDom.childNodes)
            {
                if( listDom.childNodes[i].className )
                {
                    var exist_classname = listDom.childNodes[i].className.split(' ');
                    var exist_index = exist_classname.indexOf('pick');
                    if( exist_index >= 0 )
                    {
                        exist_classname.splice( exist_index, 1 );
                        listDom.childNodes[i].className = exist_classname.join(' ');
                    }
                }
            }
            attachmentDom.className += ' pick';

            callback( attachment );
        }
    }

    function removeAttachmentDom( attachment_id )
    {
        var dom = document.getElementById( settings.parentID + "-attachment-" + attachment_id );
        if( dom.className.split(' ').indexOf('pick') >= 0  )
        {
            settings.pick(null);
        }
        dom.parentNode.removeChild(dom);
    }

    function deleteAttachment( attachment )
    {
        $.post( APIURL.remove, { id : attachment.id }, function( data ){
            if( data.error_code )
            {
                alert(data.error);
            }
            else
            {
                removeAttachmentDom( attachment.id );
            }
        }, 'json' );
        return false;
    }

    function formatFileSize( filesize )
    {
        filesize = parseInt(filesize);
        var units = [ 'Bytes', 'K', 'M', 'G' ];
        unit_index = 0
        while( filesize >= 1024 )
        {
            filesize = filesize / 1024;
            unit_index++;
        }
        return filesize.toFixed(2) + units[unit_index];
    }

    this.show = function (){
        this.refresh();
        if( windowDom )
        {
            $(windowDom).modal({
                backdrop:true,
                keyboard:true,
                show:true
            });
        }
    }

    function refresh()
    {
        var params = { parent_type : settings.parent_type, parent_id : settings.parent_id };

        if( 'parent_relation' in settings )
        {
            params.parent_relation = settings.parent_relation;
        }

        $.post( APIURL.list, params, function( attachments ){


            _attachments = attachments;
            listDom.innerHTML = '';

            var attachment;
            for(var k=0;k < attachments.length ; k++)
            {
                attachment = attachments[k];
                addAttachment( attachment );
            }

        }, 'json' );
    }

    this.getAttachments = function(){
        return _attachments;
    }

    this.refresh = function(){
        refresh();
    }

    this.deleteAllAttachment = function()
    {
        var attachments = this.getAttachments();
        if( confirm('确定删除附件?') )
        {
            for(var k in attachments)
            {
                deleteAttachment(attachments[k])
            }
            return true;
        }
        return false;
    }

    refresh();
}

