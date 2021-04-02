// pages/index.js
let API = require('../../utils/api.js');
let util = require('../../utils/util.js');
let http = require('../../utils/http.js');
let that = this;
Page({
    data: {
        files: [],
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        description: "",
        descriptionCount: 0
    },
    chooseImage() {
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: 1,
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let files = that.data.files;
                files[0] = res.tempFilePaths[0];
                that.setData({
                    files: files,
                    uploadIng:true
                });
                http._uploadFile({
                    url: '/api/addEventImage',
                    filePath: files[0],
                    progressFn: res => {
                        that.setData({
                            uploadProgress: res.progress
                        });
                    },
                    successFn: data => {
                        console.log(data);
                        that.eventImgUrl = data.data;
                        that.setData({
                            files: files,
                            uploadSuccess: true,
                            uploadIng:false
                        });
                    },
                    errorFn: data => {
                        that.setData({
                            uploadSuccess: false,
                            uploadIng:false
                        });
                    }
                });
            }
        })
    },
    inputTitle(e) {
        that.setData({
            title: e.detail.value
        });
    },
    bindStartDateChange(e) {
        that.setData({
            startDate: e.detail.value
        });
    },
    bindStartTimeChange(e) {
        that.setData({
            startTime: e.detail.value
        });
    },
    bindEndDateChange(e) {
        that.setData({
            endDate: e.detail.value
        });
    },
    bindEndTimeChange(e) {
        that.setData({
            endTime: e.detail.value
        });
    },
    inputLocation(e) {
        that.setData({
            location: e.detail.value
        });
    },
    inputDescription(e) {
        that.setData({
            description: e.detail.value,
            descriptionCount: e.detail.value.length
        });
    },
    submitEvent() {
        if (that.checkValueError(that.data.title, "活动标题不能为空！") ||
            that.checkValueError(that.data.location, "活动地址不能为空！") ||
            that.checkValueError(that.data.description, "活动介绍不能为空！") ||
            that.checkValueError(that.eventImgUrl, "活动图片未上传！") ||
            that.checkValueError(that.data.startDate, "活动开始日期不能为空！") ||
            that.checkValueError(that.data.startTime, "活动开始时间不能为空！") ||
            that.checkValueError(that.data.endDate, "活动结束日期不能为空！") ||
            that.checkValueError(that.data.endTime, "活动结束时间不能为空！")) {
            return;
        }
        let startTime = util.timeFormat(that.data.startDate + " " + that.data.startTime);
        let endTime = util.timeFormat(that.data.endDate + " " + that.data.endTime);
        if (that.checkValueError(startTime > endTime, "活动开始时间必须小于活动结束时间！")) {
            return;
        }


        wx.request({
            url: API.BASE_URL + '/api/addEvent',
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'cookie': wx.getStorageSync('cookie') //请求带cookie
            },
            data: {
                startTime: that.data.startDate + " " + that.data.startTime + ":00",
                endTime: that.data.endDate + " " + that.data.endTime + ":00",
                title: that.data.title,
                location: that.data.location,
                description: that.data.description,
                supplyName: "个人用户",
                eventScore: 1,
                maxnum: 10,
                tags: "",
                eventImgUrl: that.eventImgUrl
            },
            success: (res) => {
                console.log(res)
                if (res.data.statusCode === 401) {
                    wx.showModal({
                        content: res.data.msg,
                        success(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '/pages/login/login',
                                })
                            } else if (res.cancel) {
                                wx.redirectTo({
                                    url: '/pages/login/login',
                                })
                            }
                        }
                    })
                } else if (res.data.statusCode === 500) {
                    wx.showModal({
                        content: res.data.msg,
                        success(res) {
                            if (res.confirm) {
                                return
                            } else if (res.cancel) {
                                return
                            }
                        }
                    })
                }else if(res.data.statusCode === 200){
                    wx.showModal({
                        content: res.data.msg,
                        showCancel:false,
                        success(res) {
                            if (res.confirm) {
                                wx.navigateBack();
                                return
                            }
                        }
                    })
                }
            }
        })
    },
    checkValueError(value, errorMsg) {
        if (value === true || (typeof value == "string" && (value == null || value == "" || value.length == 0))) {
            that.setData({
                errorMsg: errorMsg,
                showTopTips: true
            });
            let showErrorT = setTimeout(() => {
                that.setData({
                    showTopTips: false
                });
                clearTimeout(showErrorT);
            }, 3000);
            return true;
        }
        return false;
    },
    onLoad() {
        that = this;
    }
})