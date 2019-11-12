
        var api_url = 'http://show.aitc88.com';
        var type=0;
        var content="";
        var page=1;
        var pdfSrc=""
        var wrapper=document.querySelector('.refresh-wrapper');
        var scroll= new BScroll(wrapper,{
            probeType: 3,
            click:false,
            tap:'click'
            });

    $(".header-tags").click(function(){
        $(".sele-block").slideToggle(200);
    });

    function scanFile(obj){
        var file=$(obj).attr("file-src");
        if(file){
            window.location.href='viewer.html?pdfSrc='+file;
            // var u=navigator.userAgent;
            // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; 
            // var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            
            // if (isAndroid) {
            //     pdfSrc=file;
            //     window.location.href='viewer.html?pdfSrc='+file;
            //  }else if (isIOS) {
            //     window.location.href=file;
            //  }else{
            //     pdfSrc=file;
            //     window.location.href='viewer.html?pdfSrc='+file;
            //  }
        }
    }

   
    function playVideo(obj){
        var video_src=$(obj).attr("data-src");
        $.post(api_url+"/video/Upload/getVideoInfo",{video_id:video_src,all:1},function(data){
            var video_option=JSON.parse(data);
            $(".video-player").show();
            $("#player").attr('src',video_option.playUrl);
            $("#player").attr('poster',video_option.cover);
            document.getElementById("player").play();    
        })
      
    }
   
    
 

    function getData(){
        var postData={
            content,
            type,
            page
        }
        $.post(api_url+'/video/Imp/data_list',postData).then(function(data){
            if(data.code==200){
                var list=data.data.data;
                var html="";
                if(page==1){
                    if(!list.length){
                        $(".loading-hook").text('暂无数据');
                    }else{
                        if(list.length<13){
                            $(".loading-hook").text('暂无更多数据');
                        }else{
                            $(".loading-hook").text('加载更多');
                        }
                        
                    }
                }
                list.map(function(item){
                    if(item.video_word_type=='1'){
                        html+='<li><span class="file-icon"><img src="img/video.png" alt=""></span>'+
                        '<span class="file-contents">'+item.video_title+'</span>'+
                        '<a href="javascript:" class="seek-btn fr"  data-src="'+item.video_ossid+'" video_id="'+item.video_id+'" onClick="playVideo(this)">播放</a></li>'
                    }else{
                        html+='<li><span class="file-icon"><img src="img/doc.png" alt=""></span>'+
                        '<span class="file-contents">'+item.video_title+'</span>'+
                        '<a href="javascript:" class="seek-btn fr"  file-src="'+item.video_url+'" onClick="scanFile(this)">查看</a></li>'
                    }
                    
                })
                $(".file-list").append(html);
                $(".bottom-tip").show();
                page++;
                scroll.refresh();
            }else{
                $(".loading-hook").text('网络错误');
                $(".bottom-tip").show();
            }
        })
    }


    getData();

    setTimeout(function(){
        var bottomTip = document.querySelector('.loading-hook');
        var topTip = document.querySelector('.refresh-hook');
        var alerts = document.querySelector('.alert-hook');
        var tags=false;
        scroll.refresh();
        var H=$(".file-block").height();
        var h=$(".refersh").outerHeight();
        if(h<H){
            $(".loading-hook").text("暂无更多数据");
        }else{
            $(".loading-hook").text("加载更多");
        }
        scroll.on('scroll', function (position) {
            if(position.y > 30) {
                topTip.innerText = '释放立即刷新';
            }
        });
        // 滑动结束
        scroll.on('touchend', function (position) {
            if (position.y > 30) {
                tags=true;
                setTimeout(function () {
                    topTip.innerText = '下拉刷新';
                    if(tags){
                        refreshAlert('刷新成功');
                    }
                    scroll.refresh();
                }, 1000);
            }else if(position.y < (this.maxScrollY - 30)) {
                bottomTip.innerText = '加载中...';
                $(".loading-block").show();
                setTimeout(function () {
                    bottomTip.innerText = '查看更多';
                    getData();
                    scroll.refresh();
                }, 1000);
            }
            function refreshAlert(text) {
                text = text || '操作成功';
                alerts.innerHtml = text;
                alerts.style.display = 'block';
                setTimeout(function(){
                    alerts.style.display = 'none';
                    page=1;
                    $(".file-list").html("");
                    getData();
                },1000);
            }
            });
    },500)

    $(".sele-list li").click(function(){
        $(this).addClass("on").siblings().removeClass("on");
        var doc_type=$(this).attr("types");
        type=doc_type;
        $(".bottom-tip").hide();
        page=1;
        $(".file-list").html("");
        getData();
    })

    $(".closeVideo").click(function(){
        $(".video-player").hide();
        // $("#player").attr('src',"");
    });
    $(".closeDoc").click(function(){
        $(".pdfContainer").hide();
        $("#pdfContainer").html("");
    })

    $(".search-input").keyup(function(e){
        $(".sele-list li").eq(0).addClass("on").siblings().removeClass("on");
        content=$(this).val();
        $(".file-list").html("");
        page=1;
        type=0;
        getData();
    })

   
