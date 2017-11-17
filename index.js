//'Client-ID': 'q443o8gke0lrzh0bhvlzhv4wd1kw6v' 感谢hanjinjun提供的client_id  引用地址:https://github.com/FreeCodeCampChina/freecodecamp.cn/issues/77
var anchors = ["freecodecamp", "failverde", "donbingweihan", "zxcv323215", "n00biesuzikinz", "kana000089", "fanvivi","minerva8018","VeRsuta","CinCinBear","aphrolin1107","blair0823"];//主播列表
jQuery(document).ready(function(){
    $("#title p").click(function(){
        $("#title p").removeClass("active");
        $(this).addClass("active");
        $(".detail").attr({"style":"display:none"});
        // console.log(this.id);
        switch(this.id){
            case "every":
                $(".list").attr({"style":"display:block;cursor:pointer"});
                break;
            case "online":
                $(".offline").attr({"style":"display:none"});
                $(".online").attr({"style":"display:block;cursor:pointer"});
                break;
            case "offline":
                $(".online").attr({"style":"display:none"});
                $(".offline").attr({"style":"display:block;cursor:pointer"});
                break;
        }
    })
    var anchorData = [];
    for(var i = 0;i<anchors.length;i++){
        $.ajax({
            type:"get",
            async:true,
            url:"https://api.twitch.tv/kraken/channels/"+anchors[i]+"?client_id=q443o8gke0lrzh0bhvlzhv4wd1kw6v",
            dataType: "jsonp",
            jsonp: "callback",
            success:function(data){
                var anchor = {}
                anchor.name = data.name;
                anchor.url = data.url;
                anchor.followers = data.followers;
                anchor.views = data.views;
                anchor.language = data.language;
                anchor.logo = data.logo;
                anchor.displayName = data.display_name;
                anchorData.push(anchor);
                keep(anchorData);
            },
            error: function(err){
                console.log("访问channels接口出错,错误:"+err);
            }
        });
    }
    function keep(anchorData){
        if(anchorData.length == anchors.length){
            //console.log(anchorData);
            for(var j = 0;j < anchorData.length;j++){
                $.ajax({
                    type:"get",
                    async:true,
                    url:"https://wind-bow.glitch.me/twitch-api/streams/" + anchorData[j].name,
                    dataType:"jsonp",
                    success:function(data1){
                        //console.log(data1);
                        var ind = anchorData.findIndex(function(element){
                            var self = data1._links.self.split("/");
                            return element.name==self[self.length-1];
                        });
                        // console.log(ind);
                        if(data1.stream == null){
                            anchorData[ind].status = 0;
                        }else{
                            anchorData[ind].status = 1;
                            anchorData[ind].viewers = data1.stream.viewers;
                            anchorData[ind].time = data1.stream.created_at;
                            anchorData[ind].screen = data1.stream.preview.medium;
                        }
                        ok(anchorData);
                    },
                    error:function(err1){
                        console.log("访问stream接口出错,错误:"+err1);
                    }
                });
            }
        }else{
            return 0;
        }
    }
});
function ok(data){
    //
    if(data.every(function(element){
            return element.status!==undefined;
        })){//全了
        // console.log(data);
        $("#loading").attr("style","display:none");
        data.forEach(function(element){
            var ss="";
            element.status?ss="online":ss="offline";
            var list = document.createElement("div");
            $(list).attr({"class":"list "+ss,"id":element.name,"style":"cursor:pointer"});
            var img = document.createElement("img");
            $(list).append($(img).attr({"class":"avatar","src":element.logo,"alt":"nope"}));
            var name = document.createElement("p");
            $(list).append($(name).attr("class","nickname").text(element.displayName));
            var status = document.createElement("p");
            $(list).append($(status).attr("class","circle").text("●"));
            var statusText = document.createElement("p");
            $(list).append($(statusText).attr("class","status").text(ss));
            $(list).click(function(){
                $("#"+this.id+"D").toggle(600);
            });
            $("#board").append(list);
            var detail = document.createElement("div");
            $(detail).attr({"class":"detail","id":element.name+"D","style":"display:none"});
            if(element.status){
                var screen = document.createElement("img");
                $(detail).append($(screen).attr({"class":"screen","src":element.screen,"alt":"nope"}));
                var p3 = document.createElement("p");
                $(detail).append($(p3).text("主播粉丝数:"+element.followers));
                var p4= document.createElement("p");
                $(detail).append($(p4).text("总浏览量:"+element.views));
                var p5= document.createElement("p");
                $(detail).append($(p5).text("直播语言:"+element.language));
                var p6= document.createElement("p");
                $(detail).append($(p6).text("直播开始时间:"+element.time));
            }else{
                var p1 = document.createElement("p");
                $(detail).append($(p1).text("主播未在直播"));
            }
            var p2 = document.createElement("p");
            $(detail).append($(p2).html('<a href="'+element.url+'" target="_blank">进入直播间>></a>'));
            $("#board").append(detail);
        });
    }else{//没全
        console.log("进行中....");
    }
}
