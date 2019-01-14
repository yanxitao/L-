Component({
    properties: {
        propName: { // 属性名
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 'val', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        }
    },

    data: {
        currentData: 0, 
        selectPerson: true,

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
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
        var date = new Date();
        this.setData({  
            refreshTime: date.toLocaleTimeString()
        })
        this.requestData();
    },

    detached: function () {},

    bindchange: function(e) {
        const that = this;
        that.setData({
        currentData: e.detail.current
        })
    },
    //点击切换，滑块index赋值
    checkCurrent: function(e) {
        const that = this;

        if (that.data.currentData === e.target.dataset.current) {
        return false;
        } else {

        that.setData({
            currentData: e.target.dataset.current
        })
        }
    },

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        }
    },


    // onLoad: function () {
    //     // 监听页面加载的生命周期函数

    //     var date = new Date();
    //     this.setData({  
    //         refreshTime: date.toLocaleTimeString()
    //     })
    //     this.requestData();
    // },

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
});