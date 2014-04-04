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
                if(data.errCode === 0){
                    window.location.href = 'index.html';
                }else{
                    alert(data.msg);
                }
            }
        });
    });
});