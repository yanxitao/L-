var app = getApp();
var bdParse = require('../../bdParse/bdParse.js');

Page({
    data: {
        detailModel: '',
        nodes: '<p><span style="font-family: 宋体; font-size: 10.5pt;">在战舰世界闪击战中，若要使用航母进行战斗，就必须要使用到飞机了，其中大部分作战时间其实都是都是操作着航母上面的舰载机，一些新手玩家们刚刚使用航母的时候发现并没有能够发挥出应有的作用，所以说对于舰载机的操作技术是否熟练那么就很重要了，那么下面就为玩家们介绍舰载机的操作。</span><br /></p><p style="text-align: center;"><span style="font-family: 宋体; font-size: 10.5pt;"><image src="http://c13.eoemarket.net/upload/images/seocms/20181129/1003385bff48fa8cb95.jpg" alt="" /><br /></span></p><p><span style="font-family:宋体;font-size:10.5000pt;"><span style="font-family:宋体;">首先就需要了解的航母的基本操作，移动和射击的按键其实相差无几，只是在界面的右下角你可以看见多了一个飞机按钮，然后点进去就是上帝视角了，在左下角显示着飞行编队的按钮，上面分列着各种不同类型的飞机，然后派遣出你需要的飞机组成一个战斗群进行战斗。合理的利用各种飞机不同的特点对敌人的战舰造成一定的压制和损害同时抢夺制空权，主导整一个战局的走向。</span></span></p><p style="text-align: center;"><span style="font-family:宋体;font-size:10.5000pt;"><span style="font-family:宋体;"><image src="http://c16.eoemarket.net/upload/images/seocms/20181129/1003595bff490fb5bc3.jpg" alt="" /><br /></span></span></p>',
        content: '',
        shareInfo: '',

        // nodes: [{
        //     name: 'div',
        //     attrs: {
        //         class: 'div_class',
        //         style: 'line-height: 60px; color: red;'
        //     },
        //     children: [{
        //         type: 'text',
        //         text: '',
        //     }]
        // }]

    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        var that = this;
        console.log('options' , options);

        swan.showLoading({
            title: '加载中',
            mask: 'true'
        });
        swan.request({
            url: 'https://duapi.eoemarket.com/v1/article_detail',
            data: {
                app_id: 14925487,
                id: options.article_id,
                
            },
            success: res => {
                swan.hideLoading();
 
                console.log('request success', res);

                if (res.data.status=1) {
                    this.setData({
                        detailModel: res.data,
                        shareInfo: res.data.share_info,
                        // content: app.convertHtmlToText(res.data.content)
                        // htmlContent: res.
                        content:bdParse.bdParse('article', 'html', res.data.content, that, 15), 
                    });
                    console.log('detailModel' , this.data.detailModel);
                    console.log('content' , this.data.content);
                }
      
            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
            complete: () => {
                this.setData('loading', false);
            }
        });
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        console.log('onShow');

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
            imageUrl: this.data.shareInfo.image_url,
            path: 'pages/gameCenterDetail/gameCenterDetail?article_id='+this.data.detailModel.article_id,
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