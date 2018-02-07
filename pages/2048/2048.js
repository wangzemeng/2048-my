var Board = require("./board.js");
var Main = require("./main.js");
Page({
  data: {
    hidden: false,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0,
    endMsg: '',
    over: false
  },
  onReady: function () {
    if (!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', 0);
    this.gameStart();
  },
  gameStart: function () {
    var main = new Main(4);
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;
    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid
    });
  },
  gameOver: function () {
    this.setData({
      over: true
    });
    if (this.data.score >= 2048) {
      this.setData({
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      });
    }
  },
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) {
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function (ev) {
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function () {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if (this.data.main.isOver()) {
      this.gameOver();
    } else if (this.touchStartX == this.touchEndX && this.touchStartY == this.touchEndY) {
      console.log(1)
    }
    else {
      console.log(this.touchStartX, this.touchEndX, this.touchStartY, this.touchEndY)
      if (Math.max(absdisX, absdisY) > 10) {
        this.setData({
          start: "重新开始",
        });
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);
        var data = this.data.main.move(direction);
        this.updateView(data);
      }
    }
  },
  updateView(data) {
    var max = 0;
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    this.setData({
      num: data,
      score: max
    });
  },
  onShareAppMessage: function () {
    return {
      title: '2048',
      desc: '你敢挑战吗？',
      path: '/page/user?id=123'
    }
  }
})