$(function(){
    $('#js_loginBtn').click(function(){
        var username = $('#js_username').val();
        //var password = calcMD5($('#js_password').val());
        var password = $('#js_password').val();

        if(username === '' || password === ''){
            $('#js_warningText').html('账号密码不能为空');
            $('#js_warningText').css('display',"block");
            return false;
        }
        $.ajax({
            url:Saturn.cmsPath+'ipa/login/',
            type:"POST",
            data:'username='+username+'&password='+password,
            success:function(data){
                if(data.errcode === 0){
                    window.location.href = 'index.html';
                }else if(data.errcode === 1){
                    alert('发送方法不是post');
                }else if(data.errcode === 2){
                    alert('用户不存在');
                }else if(data.errcode === 3){
                    alert('密码错误');
                }
            }
        });
    });
});