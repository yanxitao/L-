Page({
    tip() {
        swan.showToast({
            title: '我是标题',
            duration: 1000,
        });
        // console.log('获取滚动事件的详细信息e.detail：');

    },

    refresh: function(e){
        var self = this;
        setTimeout(function(){
            console.log('下拉刷新');
            var date = new Date();
            self.setData({
                currentPage: 1,
                refreshTime: date.toLocaleTimeString(),
                hideHeader: false
            })
            self.requestData();
        },1000);
    },
    
	lower() {

        var self = this;
        // 当前页是最后一页
        console.log('当前页数：', self.data.currentPage);
        console.log('总页数：', self.data.allPages);

        if (self.data.currentPage >= self.data.allPages){
            this.setData({
                loadMoreData: '已经到顶'
            })

            // swan.showToast({
            //     title: '没有更多了',
            //     duration: 1000,
            // });
            return;
        }

        console.log('上拉加载更多');
            // self.requestData();  
            var tempCurrentPage = self.data.currentPage;
            tempCurrentPage = tempCurrentPage + 1;
            self.setData({
                currentPage: tempCurrentPage,
                hideBottom: false  
            })
        self.requestData(); 
        // setTimeout(function(){
        //     console.log('上拉加载更多');
        //     // self.requestData();  
        //     var tempCurrentPage = self.data.currentPage;
        //     tempCurrentPage = tempCurrentPage + 1;
        //     self.setData({
        //         currentPage: tempCurrentPage,
        //         hideBottom: false  
        //     })
        //     self.requestData();  
        // },0);
    },

    data: {

        hideHeader: true,
        hideBottom: true,
        refreshTime: '', // 刷新的时间 
        contentlist: [], // 列表显示的数据源
        allPages: '',    // 总页数
        currentPage: 1,  // 当前页数  默认是1
        shareTitle: '',
        loadMoreData: '加载更多……' ,

        result: [],
        src: "../../images/WechatIMG1.jpeg",


        currentTab:0,
        flag:0,
    },

    switchNav:function (e) {
        console.log(e);
        var page = this;
        var id = e.target.id;
        if(this.data.currentTab == id) {
            return false;
        }else {
            page.setData({currentTab:id});
        }
        page.setData({flag:id});
    },


    requestData: function () {
        var self = this;
        var pageIndex = this.data.currentPage;

        // this.setData('loading', true);

        console.log('pageIndex :', pageIndex);

        swan.showLoading({
            title: '加载中',
            mask: 'true'
        });

        swan.request({
            url: 'https://duapi.eoemarket.com/v1/article_list',
            data: {
                pn: pageIndex,
                ps: 10,
                app_id: 14925487,
            },
            success: res => {
                swan.hideLoading();
                // swan.showToast({
                //     title: '请求成功',
                //     icon: 'success'
                // });
                console.log('request success', res);

                console.log('resultCode:', res.statusCode);
                var dataModel = res.data;
                var shareInfoModel = res.data.shareInfo;
                console.log('数据解析:', dataModel);
                // console.log('shareInfoModel:', shareInfoModel);

                if (res.statusCode == 200){
                    if (dataModel.status == 1){
                        if(pageIndex == 1){ // 下拉刷新
                            this.setData({
                                allPages: dataModel.page_cnt,
                                contentlist: dataModel.article_list,
                                shareInfo: dataModel.share_info,
                                hideHeader: true
                            })
                            console.log('shareInfo:', this.data.shareInfo);
                            // console.log('shareTitle:', this.data.shareTitle);
                        }else{ // 加载更多
                            console.log('加载更多');
                            var tempArray = this.data.contentlist;
                            tempArray = tempArray.concat(dataModel.article_list);
                            this.setData({
                                allPages: dataModel.page_cnt,
                                contentlist: tempArray,
                                shareInfo: dataModel.share_info,
                                hideBottom: true
                            })
                            console.log('shareInfo:', this.data.shareInfo);
                        }
                    }
                }

            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
            complete: () => {
                // this.setData('loading', false);
            }
        });
    },

    onLoad: function () {
        // 监听页面加载的生命周期函数

        var date = new Date();
        this.setData({  
            refreshTime: date.toLocaleTimeString()
        })
        this.requestData();
    },

    navigateTo(e) {
        swan.navigateTo({
            url: '../nav2/nav2?article_id=44'
        });
    },
    
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
        return {
            title: this.data.shareInfo.title,
            content: this.data.shareInfo.content,
            path: this.data.shareInfo.image_url,
            path: 'pages/gameCenterList/gameCenterList',
            success(res) {
                // 分享成功
                console.log('分享成功');

            },
            fail(err) {
                // 分享失败
                console.log('分享失败原因：',err);
            }
        };
    }
});