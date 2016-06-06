function Table() {

  this.screenWidth = document.body.clientWidth;
  this.screenHeight = document.body.clientHeight;
  this.canvas = null;
  this.context = null;
  this.canvasBg = null;
  this.timer = null;
  this.todayData = null;
  this.yesterdayData = null;
  this.maxPv = 0; // 单点最大的访问量
  this.lineNum = 0; // 每块高度容乃的访问量
  this.oneRectWidth = 0; // 单个矩形的宽度
  this.oneRectHeight = 0; // 单个矩形的高度
  this.allRectNum = 15; // 一共多少行
  this.allRectListNum = 24; // 一共多少列

  // 默认参数
  this.settings = {
    time: 1000, // 时间
    off: true, // 是否自动生成假数据
    canvasId: 'canvas', // 绘制折线图画图Id
    canvasWidth: 900, // canvas宽度
    canvasHeight: 400, // canvas高度
    lineColor: '#ccc', // 背景线条颜色
    fontColor: '#000', // 字体颜色
    hoverBack: 'rgba(0,0,0,.7)', // 鼠标悬停背景颜色
    hoverFontColor: '#fff', // 鼠标字体颜色
    hoverFont: '12px Microsoft Yahei', // 鼠标悬停字体大小以及颜色
    hoverRectWidth: 240, // 悬停方块宽度
    hoverRectHeight: 30, // 悬停方块高度
    brokenLine: 2, // 折线图线的宽度
    yesterdayColor: 'green', // 昨天的折线图线条颜色
    todayColor: 'red', // 今天的折线图线条颜色
    nowDataName: 'today_npv', // 返回的json下取值属性名（当天数据）
    oldDataName: 'yesterday_npv', // 返回的json下取值属性名（昨天数据）
    direction: 'center', // 方向 （left或者center或者right）
    canvasBgId: 'canvasBg', // 绘制canvas的背景Id
    font: '12px Microsoft Yahei', // 字体大小以及颜色
    defaultStyle: '<style>*{margin:0;padding:0;margin-top:10px;}</style>', // 重置默认样式
    url: '' // 请求数据的url地址
  };


}

Table.prototype.init = function(parameter) {

  this.extend(this.settings, parameter);
  this.createCanvas();
  this.styleCss(this.canvas);
  this.styleCss(this.canvasBg);
  this.styleCss(this.canvasShowText);

  this.canvasBg.style.zIndex = '1';
  this.canvasShowText.style.zIndex = '2';

  this.oneRectWidth = this.settings.canvasWidth / this.allRectListNum;
  this.oneRectHeight = this.settings.canvasHeight / this.allRectNum;

  // 渲染
  this.redrawTime();

  // 鼠标悬停显示数据
  this.bindEvents();

};

Table.prototype.bindEvents = function() {

  var _this = this;
  var canvas = _this.canvasShowText;
  var context = _this.contextShowText;

  canvas.onmousemove = function(e) {

    var ev = e || window.event;
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    var index = parseInt(x / _this.oneRectWidth);
    var data = [];

    data.push(_this.todayData[index][1]);
    data.push(_this.yesterdayData[index][1]);


    if (x + _this.oneRectWidth * 4 + 20 > _this.settings.canvasWidth) {
      x = x - _this.settings.hoverRectWidth;
    }

    text(data, x, y - _this.settings.hoverRectHeight, index);

  };

  canvas.onmouseout = function() {
    context.clearRect(0, 0, _this.settings.canvasWidth, _this.settings.canvasHeight);
  };

  function text(data, x, y, hour) {

    context.clearRect(0, 0, _this.settings.canvasWidth, _this.settings.canvasHeight);
    context.save();
    context.rect(x, y, _this.settings.hoverRectWidth, _this.settings.hoverRectHeight);
    context.fillStyle = _this.settings.hoverBack;
    context.fill();

    context.beginPath();
    context.font = _this.settings.hoverFont;
    context.textAlign = 'center';
    context.textBaseline = "middle";
    context.strokeStyle = _this.settings.hoverFontColor;
    context.strokeText(hour + '点PV为：NEW（' + data[0] + '）  OLD（' + data[1] + '）', x + _this.oneRectWidth * 3, y + 15);
    context.closePath();

    context.restore();
  }



};

Table.prototype.draw = function(data) {

  this.todayData = data[this.settings.nowDataName];
  this.yesterdayData = data[this.settings.oldDataName];

  //清除画布
  try {
    console.log();
    this.contextBg.clearRect(0, 0, this.settings.canvasWidth, this.settings.canvasHeight);
    this.context.clearRect(0, 0, this.settings.canvasWidth, this.settings.canvasHeight);
  } catch (e) {
    console.log('初始无画布');
  }


  // 最大值计算
  this.count(data);

  // 如果数据不满24条，后面的数据默认都填补成0
  this.dataProcessing(this.todayData);

  // 绘制背景
  this.canvasBack();

  // 绘制折线图
  this.canvasData(this.todayData, this.yesterdayData);

};

// 绘制折线图
Table.prototype.canvasData = function(newData, oldData) {

  var _this = this;
  var context = _this.context;
  var compareVal = _this.oneRectHeight / _this.lineNum;
  var lastLoc = {
    x: 0,
    y: 0
  };
  var i, len;


  drawNew();
  drawOld();

  // 绘制当天的折线
  function drawNew() {

    lastLoc = {
      x: 0,
      y: _this.settings.canvasHeight - (newData[0][1] * _this.oneRectHeight / _this.lineNum)
    };

    for (i = 0, len = newData.length; i < len; i++) {

      var x = _this.oneRectWidth * i;
      var y = _this.settings.canvasHeight - (newData[i][1] * _this.oneRectHeight / _this.lineNum);

      drawCanvas(x, y, _this.settings.todayColor);
    }

  }

  // 绘制昨天的折线
  function drawOld() {

    lastLoc = {
      x: 0,
      y: _this.settings.canvasHeight - (oldData[0][1] * _this.oneRectHeight / _this.lineNum)
    };

    for (i = 0, len = oldData.length; i < len; i++) {

      var x = _this.oneRectWidth * i;
      var y = (_this.settings.canvasHeight) - (oldData[i][1] * _this.oneRectHeight / _this.lineNum);

      drawCanvas(x, y, _this.settings.yesterdayColor);
    }


  }


  function drawCanvas(x, y, color) {
    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(x, y);

    context.lineWidth = _this.settings.brokenLine;
    context.lineCap = 'round';
    context.lineJoin = 'dround';
    context.strokeStyle = color;
    context.stroke();
    lastLoc.x = x;
    lastLoc.y = y;

  }

};

// 数据处理
Table.prototype.dataProcessing = function(data) {

  var i, len;

  if (data.length != this.allRectListNum) {

    len = this.allRectListNum - data.length;

    for (i = 0; i < len; i++) {
      this.todayData.push([-1, 0]);
    }
  }

};

Table.prototype.canvasRectPV = function() {

  var _this = this;
  var context = _this.contextBg;
  var i, len;

  for (i = 0, len = _this.allRectNum; i < len; i++) {

    context.beginPath();
    context.font = this.settings.font;
    context.strokeStyle = this.settings.fontColor;
    context.strokeText(Math.round(i * _this.lineNum), 1, _this.settings.canvasHeight - i * _this.oneRectHeight);
    context.closePath();
  }
};

Table.prototype.canvasBack = function() {

  var context = this.contextBg;
  var _this = this;

  // 背景表格
  context.save();

  context.beginPath();
  context.lineWidth = 1;
  this.todayData.forEach(function(list, i) {

    _this.todayData.forEach(function(list, j) {
      context.rect(i * _this.oneRectWidth, j * _this.oneRectHeight, _this.oneRectWidth, _this.oneRectHeight);
    });
  });
  context.strokeStyle = this.settings.lineColor;
  context.stroke();
  context.closePath();

  // 字体
  context.beginPath();
  context.font = this.settings.font;
  context.strokeStyle = this.settings.fontColor;
  _this.todayData.forEach(function(list, i) {
    context.strokeText(i, i * _this.oneRectWidth, _this.settings.canvasHeight);
  });
  context.closePath();

  // 昨天 今天 标示
  context.beginPath();
  context.font = this.settings.font;
  context.strokeStyle = this.settings.fontColor;
  context.strokeText('今天', _this.settings.canvasWidth - _this.oneRectWidth, _this.oneRectHeight + _this.oneRectHeight / 2);
  context.strokeText('昨天', _this.settings.canvasWidth - _this.oneRectWidth, _this.oneRectHeight / 2 * 5);
  context.closePath();

  context.beginPath();
  context.fillStyle = this.settings.todayColor;
  context.rect(_this.settings.canvasWidth - (_this.oneRectWidth / 2 * 3 + 5), _this.oneRectHeight + 2, _this.oneRectWidth / 2, _this.oneRectHeight / 2);
  context.fill();
  context.closePath();

  context.beginPath();
  context.fillStyle = this.settings.yesterdayColor;
  context.rect(_this.settings.canvasWidth - (_this.oneRectWidth / 2 * 3 + 5), _this.oneRectHeight / 2 * 4 + 2, _this.oneRectWidth / 2, _this.oneRectHeight / 2);
  context.fill();
  context.closePath();

  context.restore();

  // 绘制每行表格代表的访问量
  this.canvasRectPV();

};

Table.prototype.count = function(data) {

  var _this = this;
  var i, len;

  data[this.settings.nowDataName].forEach(function(arr, i) {

    if (_this.maxPv < arr[1]) {
      _this.maxPv = arr[1];
    }

  });

  data[this.settings.oldDataName].forEach(function(arr, i) {

    if (_this.maxPv < arr[1]) {
      _this.maxPv = arr[1];
    }

  });


  _this.lineNum = _this.maxPv / 14;

};

Table.prototype.styleCss = function(obj) {

  obj.width = this.settings.canvasWidth;
  obj.height = this.settings.canvasHeight;
  obj.style.position = 'absolute';
  obj.style.zIndex = '2';

  var dir = this.settings.direction;
  if (dir == 'center') {
    obj.style.left = (this.screenWidth - this.settings.canvasWidth) / 2 + 'px';
  } else if (dir == 'left') {
    obj.style.left = '0';
  } else if (dir == 'right') {
    obj.style.right = '0';
  }

};

Table.prototype.createCanvas = function() {

  document.body.innerHTML = this.settings.defaultStyle;

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.canvas.setAttribute('id', this.settings.canvasId);

  this.canvasBg = document.createElement('canvas');
  this.contextBg = this.canvasBg.getContext('2d');
  this.canvasBg.setAttribute('id', this.settings.canvasBgId);

  this.canvasShowText = document.createElement('canvas');
  this.contextShowText = this.canvasShowText.getContext('2d');

  document.body.appendChild(this.canvas);
  document.body.appendChild(this.canvasBg);
  document.body.appendChild(this.canvasShowText);

};

Table.prototype.redrawTime = function() {

  var _this = this;

  this.timer = setInterval(function() {
    _this.get(function(response) {
      _this.draw(response);
      window.response = response;
    }, _this.settings.off);

  }, _this.settings.time);
};

Table.prototype.get = function(callback, off) {

  if (this.settings.url == '' && !off) {
    this.settings.off = true;
    alert('由于你没填写url，将自动生成出假数据！');
    return;
  }

  if (off) {

    var _this = this;
    var data = {
      today_npv: [],
      yesterday_npv: []
    };
    var i, len;

    for (i = 0, len = _this.allRectListNum; i < len; i++) {
      data.today_npv.push([i, parseInt(Math.random() * 10000)]);
      data.yesterday_npv.push([i, parseInt(Math.random() * 10000)]);
    }

    callback(data);
    return;
  }

  var xml = new XMLHttpRequest;
  xml.open("GET", this.settings.url, true);
  xml.onreadystatechange = function() {
    if (xml.readyState == 4 && xml.status == 20) {
      callback(JSON.parse(xml.responseText));
    }
  };
  xml.send(null);
};

Table.prototype.extend = function(par1, par2) {
  for (var attr in par2) {
    par1[attr] = par2[attr];
  }
};