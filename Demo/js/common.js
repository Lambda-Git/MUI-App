// var httpUrl = 'http://172.16.10.80:8096'; //测试环境
var httpUrl = 'http://192.168.1.102:8096'; //开发环境
// var httpUrl = 'http://192.168.1.100:8096'; //环境
var userInfo = JSON.parse(localStorage.getItem('userInfo'))||{}; //获取当前登录角色
if(mui('.username')[0]){
    mui('.username')[0].innerText = userInfo.name || '';
}
var num = GetQueryString('num') || '';
var nowlocation = '';//地理坐标
var ws = ''
//获取页面参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return unescape(r[2]);
    return null;
}
var taskName = ''
//获取任务详情
function getDetail(index){
    mui.ajax(httpUrl+'/task/getOne',{
        data:{
            num:GetQueryString('num'),
        },
        dataType:'json',//服务器返回json格式数据
        type:'post',//HTTP请求类型
        timeout:10000,//超时时间设置为10秒；
        headers:{'Content-Type':'application/json'},
        success:function(res){
            if(res.code == 0){
                if(res.data.record){
                    taskName = res.data.record.name||'--';
                    mui('.first-task-ul')[0].innerHTML = '<li class="mui-table-view-cell" style="background:#d9d9dc">任务信息</li>'+
                        '<li class="mui-table-view-cell taskId">任务编号： '+(res.data.record.num||'--')+'</li>'+
                        '<li class="mui-table-view-cell taskName">任务名称： '+(res.data.record.name||'--')+'</li>'+
                        '<li class="mui-table-view-cell planningStartTime">计划开始时间： '+(res.data.record.planningStartTime||'--')+'</li>'+
                        '<li class="mui-table-view-cell planningEndTime">计划结束时间： '+(res.data.record.planningEndTime||'--')+'</li>'+
                        // '<li class="mui-table-view-cell controlLevel">管控层级： '+(res.data.record.controlLevel||'--')+'</li>'+
                        // '<li class="mui-table-view-cell associatedUnits">关联作业单位： '+(res.data.record.associatedUnits||'--')+'</li>'+
                        '<li  class="mui-table-view-cell"><div>任务内容：</div>'+
                        '<div id="description" >'+(res.data.record.content.replace(/\r\n/g,"<br/>") || '--')+'</div></li>'
                }else{
                    taskName = '--;'
                    mui('.first-task-ul')[0].innerHTML = '<li class="mui-table-view-cell" style="background:#d9d9dc">任务信息</li>'+
                        '<li class="mui-table-view-cell taskId">任务编号： --</li>'+
                        '<li class="mui-table-view-cell taskName">任务名称： --</li>'+
                        '<li class="mui-table-view-cell planningStartTime">计划开始时间： --</li>'+
                        '<li class="mui-table-view-cell planningEndTime">计划结束时间： --</li>'+
                        // '<li class="mui-table-view-cell controlLevel">管控层级： '+(res.data.record.controlLevel||'--')+'</li>'+
                        // '<li class="mui-table-view-cell associatedUnits">关联作业单位： '+(res.data.record.associatedUnits||'--')+'</li>'+
                        '<li  class="mui-table-view-cell"><div>任务内容：</div>'+
                        '<div id="description" >--</div></li>'
                }

            }
        },
        error:function(xhr,type,errorThrown){
            //异常处理；
            console.log(type);
        }
    });
}
function getDetailAfter(index){
    mui.ajax(httpUrl+'/task/getOne',{
        data:{
            num:GetQueryString('num'),
        },
        dataType:'json',//服务器返回json格式数据
        type:'post',//HTTP请求类型
        timeout:10000,//超时时间设置为10秒；
        headers:{'Content-Type':'application/json'},
        success:function(res){
            if(res.code == 0){
                if(res.data.record){

                    taskName = res.data.record.name||'--';
                    mui('.first-task-ul')[0].innerHTML = '<li class="mui-table-view-cell" style="background:#d9d9dc">任务信息</li>'+
                        '<li class="mui-table-view-cell taskId">任务编号： '+(res.data.record.num||'--')+'</li>'+
                        '<li class="mui-table-view-cell taskName">任务名称： '+(res.data.record.name||'--')+'</li>'+
                        '<li class="mui-table-view-cell taskName">作业开始时间：'+(res.data.record.startTime||'--')+'</li>' +
                        '<li  class="mui-table-view-cell"><div>任务内容：</div>'+
                        '<div id="description" >'+(res.data.record.content.replace(/\r\n/g,"<br/>") || '--')+'</div></li>'
                    }else{
                        taskName = '--';
                        mui('.first-task-ul')[0].innerHTML = '<li class="mui-table-view-cell" style="background:#d9d9dc">任务信息</li>'+
                            '<li class="mui-table-view-cell taskId">任务编号： --</li>'+
                            '<li class="mui-table-view-cell taskName">任务名称： --</li>'+
                            '<li class="mui-table-view-cell taskName">作业开始时间：--</li>' +
                            '<li  class="mui-table-view-cell"><div>任务内容：</div>'+
                            '<div id="description" >--</div></li>'
                    }
            }
        },
        error:function(xhr,type,errorThrown){
            //异常处理；
            console.log(type);
        }
    });
}
mui.init({
    swipeBack:true, //启用右滑关闭功能
    keyEventBind: {
		backbutton: false,  //Boolean(默认true)关闭back按键监听
	},
});

// 扩展API加载完毕后调用onPlusReady回调函数
document.addEventListener( "plusready", onPlusReady, false );
// 扩展API加载完毕，现在可以正常调用扩展API
function onPlusReady() {
    geeelocation()
}
/*按钮加载效果*/
mui(document.body).on('tap', '.mui-btn', function(e) {
    mui(this).button('loading');
    setTimeout(function() {
        mui(this).button('reset');
    }.bind(this), 2000);
});

//退出登录
mui(document.body).on('tap', '#logout', function(e) {
    mui.confirm('确认退出登录？','',['退出','取消'],function(a){
        if(a.index == 0){
            mui.back = function() {  
                mui.openWindow({  
                    url:'../taskPrepareStage/login.html',  
                    createNew: true,
                    styles: {
                        cachemode:"noCache",
                    }
                })  
            }  
            mui.back()    
            if(ws){
                ws.close()
            }
            localStorage.removeItem('userInfo')
            localStorage.clear()
            if(mui.os.plus){
                plus.storage.removeItem('userInfo')
                plus.storage.clear();
            }
        }
    })
});


/*获取当前时间*/
function getNowDate() {
    var date = new Date();
    var sign1 = "-";
    var sign2 = ":";
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day  = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getSeconds() //秒
    var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
    var week = weekArr[date.getDay()];
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    // var currentDate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds + " " + week;
    var currentDate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds + " ";
    return currentDate;
}

/*长整型时间转换为 年月日时分秒*/
function getMyDate(str){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}

/*null 处理为--*/
function getNullString(e){
    if(e === null){
        e = '--';
    }
    return e;
}

//页面增加当前用户，和时间
function currentInfoAndTime(){
//     var str = '<ul class="mui-table-view">'+
//     '<li class="mui-table-view-cell">当前用户： '+userInfo.name+'</li>'+
//     '<li class="mui-table-view-cell">当前时间： '+ getNowDate()+ '</li>'+
//    '</ul>'
//     $('.mui-content').prepend(str)
}

// //获取定位
function geeelocation(){
    plus.geolocation.getCurrentPosition(function(p){
        nowlocation = p.coords.latitude+','+p.coords.longitude
    }, function(e){
        nowlocation = ''
    } );
}

function imageshow(data){
    for(var i = 0;i<data.length;i++){
        if(data[i].fileName.indexOf('img')>=0){
            getImages(data[i].key)
        }
        if(data[i].fileName.indexOf('table')>=0){
            gettableImages(data[i].key)
        }
    }
}


function getAttachments(status){
    mui.ajax(httpUrl+'/task/getAttachments',{
                data:{
                    num: num,
                    status:status,
                    // username:userInfo.username,
                },
                dataType:'json',//服务器返回json格式数据
                type:'post',//HTTP请求类型
                timeout:10000,//超时时间设置为10秒；
                headers:{'Content-Type':'application/json'},	              
                success:function(res){
                    if(res.code == 0){
                        var datali = res.data || []
                        if(datali.length>0){
                            for(var i =0;i<datali.length;i++){
                                if(datali[i].record.attachmentsDOS){
                                    imageshow(datali[i].record.attachmentsDOS)
                                }
                                if(userInfo.username == datali[i].record.username){
                                    mui('#uploadImage')[0].disabled = true;
                                }
                            }
                        }else{
                            mui('#uploadImage')[0].disabled = false;
                        }
                    }
                },
                error:function(xhr,type,errorThrown){
                    //异常处理；
                    console.log(type);
                }
    });
}