const http = require('http')
const Request = require('request')
const URL = require('url')
const server = http.createServer()
server.on('request',  async (request, response)=>{
    let res = null
    // 获取轮播图信息
    if (request.url === '/swiperlist') {
        await Request('https://api.bilibili.com/x/web-show/res/loc?jsonp=jsonp&pf=7&id=1695', function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                res = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                response.end(body)
            }
        });
    }
    // 获取推荐信息
    let recomList = null
    if (request.url === '/recomList') {
        await Request('https://api.bilibili.com/x/web-interface/ranking?rid=160&day=3&jsonp=jsonp', function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                recomList = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                response.end(recomList)
            }
        });
    }
    // 获取详情页评价
    let commentList = null
    let requrl = URL.parse(request.url, true)
    if (requrl.pathname === '/detail/usercomments') {
        await Request('https://api.bilibili.com/x/v2/reply?type=1&sort=2&oid=' + requrl.query.aid + '&pn=1&nohot=1', function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                commentList = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                response.end(commentList)
            }
        });
    }
    // 获取详情页相关视频列表
    let relatedList = null
    if (requrl.pathname === '/detail/relatedList') {
        await Request('https://api.bilibili.com/x/web-interface/archive/related?aid=' + requrl.query.aid, function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                relatedList = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                response.end(relatedList)
            }
        });
    }
    // 获取电影详情页相关视频列表
    let pgcRecomList = null
    if (requrl.pathname === '/detail/pgcRecomList') {
        await Request('https://api.bilibili.com/pgc/web/recommend/related/recommend?season_id=' + requrl.query.aid + '&from_pc=0', function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                pgcRecomList = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                // console.log(pgcRecomList) // Show the HTML for the baidu homepage.
                response.end(pgcRecomList)
            }
        });
    }

    // 获取搜索热词 https://s.search.bilibili.com/main/hotword
    let hotWordList = null
    if (requrl.pathname === '/search/hotWordList') {
        await Request('https://s.search.bilibili.com/main/hotword', function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                hotWordList = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                response.end(hotWordList)
            }
        });
    }
    // 获取搜索框占位符 https://api.bilibili.com/x/web-interface/search/default
    let searchPlaceholder = null
    if (requrl.pathname === '/search/Placeholder') {
        await Request('https://api.bilibili.com/x/web-interface/search/default', function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                searchPlaceholder = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                response.end(searchPlaceholder)
            }
        });
    }
    // 获取UP粉丝及视频信息 https://api.bilibili.com/x/relation/stat?jsonp=jsonp&vmid=444982684
    let UPerInfo = null
    if (requrl.pathname === '/upPage/UPerInfo') {
        await Request('https://api.bilibili.com/x/relation/stat?jsonp=jsonp&vmid=' + requrl.query.vmid, function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                UPerInfo = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                // console.log(UPerInfo,'2333')
                response.end(UPerInfo)
            }
        });
    }
    // 获取UP上传视频列表 https://api.bilibili.com/x/space/arc/search?pn=1&ps=100&order=click&keyword=&mid=479842095
    let UPPostedInfo = null
    if (requrl.pathname === '/upPage/UPPostedInfo') {
        let {pn,ps,order,keyword,mid} = requrl.query
        await Request('https://api.bilibili.com/x/space/arc/search?pn=' + pn + '&ps=' + ps + '&order=' + order + '&keyword=' + keyword + '&mid=' + mid, function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                UPPostedInfo = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                // console.log(UPPostedInfo,'2333')
                response.end(UPPostedInfo)
            }
        });
    }
    // 获取搜索结果 https://m.bilibili.com/search/searchengine
    let searchResultList = null
    if (requrl.pathname === '/search/searchengine') {
        let body = {...requrl.query}
        await Request.post({url:'https://m.bilibili.com/search/searchengine',
            json: true,
            headers: {
                "Content-Type": "application/json",
                "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
            },
            body: body
        }, function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                searchResultList = body
                response.setHeader('Content-Type','application/json;charset=utf-8')
                // console.log('+++',searchResultList) // Show the HTML for the baidu homepage.
                response.end(JSON.stringify(searchResultList))
            }
        });
    }
    // 获取视频资源 https://m.bilibili.com/video/av74263287.html?spm_id_from=333.400.b_766964656f5f35.1
    let videoURL = null
    if (requrl.pathname === '/detail/videoURL') {
        await Request({url:'https://m.bilibili.com/video/av' + requrl.query.aid + '.html',
            headers: {"Cookie":'_uuid=E1056DCF-29EE-B913-AD39-B95F6C7D63F454155infoc; buvid3=A3CDBA9B-A1F8-4331-ADE3-30F8B7169AC7190943infoc; LIVE_BUVID=AUTO7915698346571620; CURRENT_FNVAL=16; stardustvideo=1; rpdid=|(um|kl|)YlJ0J\'ulYm)JR~|J; UM_distinctid=16d8280888e7f7-0957f4fc47f0b8-67e1b3f-1fa400-16d8280888f6e4; bg_view_28586=289217; stardustpgcv=0606; abtestExpire=1573027961052',
                "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
            }
        }, function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                videoURL = body
                response.setHeader('Content-Type','text/html')
                let startPost = videoURL.indexOf('initUrl')
                videoURL = videoURL.slice(startPost,-1)
                let endPost = videoURL.indexOf('status')
                videoURL = videoURL.slice(10,endPost-3)
                videoURL = videoURL.replace('https:','').toString()
                response.end(videoURL)
            }
        });
    }
    // 获取影视或动漫视频url------------------------------------------------------------------------------------------
    if (requrl.pathname === '/detail/movieURL') {
        await Request({url:'https://m.bilibili.com/bangumi/play/ss' + requrl.query.id,
            headers: {"Cookie":'_uuid=E1056DCF-29EE-B913-AD39-B95F6C7D63F454155infoc; buvid3=A3CDBA9B-A1F8-4331-ADE3-30F8B7169AC7190943infoc; LIVE_BUVID=AUTO7915698346571620; CURRENT_FNVAL=16; stardustvideo=1; rpdid=|(um|kl|)YlJ0J\'ulYm)JR~|J; UM_distinctid=16d8280888e7f7-0957f4fc47f0b8-67e1b3f-1fa400-16d8280888f6e4; bg_view_28586=289217; stardustpgcv=0606; abtestExpire=1573027961052',
                "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
            }
        }, async function (error, resp, body) {
            if (!error && response.statusCode === 200) {
                videoURL = body
                response.setHeader('Content-Type','text/json')
                let startStr = 'window.__INITIAL_STATE__='
                let endStr = 'function'
                let startPost = videoURL.indexOf(startStr)
                videoURL = videoURL.slice(startPost + 15,-1)
                let endPost = videoURL.indexOf(endStr)
                videoURL = videoURL.slice(10,endPost- 2)
                console.log(videoURL,233)
                // return

                let ep_id = JSON.parse(videoURL).epInfo.id
                // 获取视频真实地址
                await Request('https://api.bilibili.com/pgc/player/web/playurl/html5?ep_id=' + ep_id + '&bsource=', function (error, resp, body) {
                    if (!error && response.statusCode === 200) {
                        let movieURL = body
                        response.setHeader('Content-Type','application/json;charset=utf-8')
                        let tempArr = {videoInfo: JSON.parse(videoURL),movieURL: JSON.parse(movieURL)}
                        response.end(JSON.stringify(tempArr))
                        return false
                    }
                });
                // console.log('233',tempArr,typeof tempArr,'4444444444',JSON.parse(videoURL).epInfo.id) // Show the HTML for the baidu homepage.
            }
        });
    }


    console.log('收到客户端的请求了')
})
server.listen(3000, ()=>{
    console.log('服务器启动成功了233')
})
