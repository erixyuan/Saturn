define([
    'underscore',
    'backbone'
    ],

function(_, Backbone){
    return Backbone.Model.extend({
        initialize:function(id){
            if (id) {
                this.url = Saturn.cmsPath+'ipa/user/'+id;
            }else{
                this.url = Saturn.cmsPath+'ipa/user/create';
            }

        },
        defaults: {
            username: "",
            email: "",
            enabled: 1,
            registered: '',
            logined: '',
            metas:{
                id: '',
                user_id: '',
                nickname: "",
                realname: '',
                sex: "",
                telphone: null,
                site: null,
                qq: null,
                weibo: "",
                address: null,
                zipcode: null,
                alipay: null,
                job: null,
                bio: ""
            },
            roles:[]
        },
        validate:function(attributes){

        },
        update:function(data,callback){
            $.ajax({
                url:Saturn.cmsPath+'ipa/user',
                data:JSON.stringify(data),
                type:"post",
                contentType : 'application/json',
                dataType: 'json',
                beforeSend:function(){
                    Saturn.beginLoading('更新中...');
                },
                success:function(data){
                    if(data.errCode == 0){
                        callback && callback(data);
                    }else{
                        alert(data.msg);
                    }

                    Saturn.afterLoading();
                }
            })
        }

    });
}

);