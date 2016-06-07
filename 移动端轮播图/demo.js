'use strict'

function Slide() {

  this.screenWidth = document.documentElement.clientWidth;
  this.screenHeight = document.documentElement.clientHeight;
  this.ol = document.createElement('ol');
  this.slideIndex = 0;
  this.oldSlideIndex = 0;
  this.ul = null;
  this.slideWrap = null;
  this.picLi = null;
  this.btnLi = null;

  this.settings = {
    autoPlay: true, // 是否自动播放
    playTime: 3000, // 播放间隔
    obj: '#slideBanner'
  };
}

Slide.prototype.init = function(parameter) {

  this.slideWrap = document.querySelector(this.settings.obj);
  this.picLi = this.slideWrap.querySelectorAll('ul li');
  this.oldSlideIndex = this.picLi.length - 1;
  this.ul = this.slideWrap.querySelectorAll('ul')[0];

  // 根据图片自动渲染按钮
  this.eleInit();

  this.btnLi = this.slideWrap.querySelectorAll('ol li');

  // 样式渲染
  this.styleInit();

  this.bindEvents();

};

Slide.prototype.bindEvents = function() {

  var _this = this;
  var startX = 0;

  this.slideWrap.ontouchstart = function(ev) {
    var touch = ev.changedTouches[0];
    startX = touch.clientX;
    _this.ul.style.transition = '0s';
  };

  this.slideWrap.ontouchmove = function(ev) {
    var touch = ev.changedTouches[0];
    var num = _this.ul.dataset.num;
    _this.method.transform(_this.ul, touch.clientX - startX + num);
    console.log(touch.clientX - startX + num);
  };

  this.slideWrap.ontouchend = function(ev) {

    var touch = ev.changedTouches[0];
    var num = _this.ul.dataset.num;
    if (Math.abs(startX - touch.clientX) > _this.screenWidth / 3) {
      startX - touch.clientX > 0 ? _this.slideIndex-- : _this.slideIndex++;
      _this.move(_this.slideIndex * _this.screenWidth);
    } else {
      _this.method.transition(_this.ul);
      _this.method.transform(_this.ul, num);
    }

    // console.log(startX - touch.clientX);

    // startX - touch.clientX > 0 ? _this.slideIndex-- : _this.slideIndex++;

    // console.log(_this.slideIndex);

    // _this.move(_this.slideIndex * _this.screenWidth);
  };


};

Slide.prototype.move = function(target) {
  var index = (this.picLi.length - 1) - Math.abs(this.slideIndex);
  this.method.transition(this.ul);
  this.method.transform(this.ul, target);
  this.btnLi[this.oldSlideIndex].classList.remove('active');
  this.btnLi[index].classList.add('active');
  this.oldSlideIndex = index;
  this.ul.dataset.num = target;
};

Slide.prototype.method = {
  transform: function(obj, target) {
    obj.style.WebkitTranform = 'translate3d(' + target + 'px,0,0)';
    obj.style.MozTransform = 'translate3d(' + target + 'px,0,0)';
    obj.style.OTransform = 'translate3d(' + target + 'px,0,0)';
    obj.style.transform = 'translate3d(' + target + 'px,0,0)';
  },
  transition: function(obj) {
    obj.style.WebkitTransition = '.3s ease';
    obj.style.MozTransition = '.3s ease';
    obj.style.OTransition = '.3s ease';
    obj.style.transition = '.3s ease';
  }
};

Slide.prototype.styleInit = function() {

  var _this = this;

  this.btnLi[this.picLi.length - 1].classList.add('active');

  this.picLi.forEach(function(obj, i) {
    obj.style.left = _this.screenWidth * i + 'px';
    obj.style.width = _this.screenWidth + 'px';
  });

};

Slide.prototype.eleInit = function() {

  var _this = this;

  this.picLi.forEach(function() {
    _this.ol.appendChild(document.createElement('li'));
  });

  this.ul.dataset.num = 0;
  this.slideWrap.appendChild(this.ol);
};

Slide.prototype.extend = function(par1, par2) {
  for (var attr in par2) {
    par1[attr] = par2[attr];
  }
};
