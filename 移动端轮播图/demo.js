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
  this.timer = null;

  this.settings = {
    autoPlay: true,
    playTime: 3000,
    obj: '#slideBanner'
  };
}

Slide.prototype.init = function(parameter) {

  this.slideWrap = document.querySelector(this.settings.obj);
  this.picLi = this.slideWrap.querySelectorAll('ul li');
  this.oldSlideIndex = this.picLi.length - 1;
  this.ul = this.slideWrap.querySelectorAll('ul')[0];

  this.eleInit();

  this.btnLi = this.slideWrap.querySelectorAll('ol li');

  this.styleInit();

  this.bindEvents();

  this.autoPlay();
};

Slide.prototype.autoPlay = function() {

  if (!this.settings.autoPlay) return;

  var _this = this;

  this.timer = setInterval(function() {
    _this.slideIndex--;
    _this.slideIndex = _this.slideIndex % _this.picLi.length;
    _this.move(_this.slideIndex * _this.screenWidth);
  }, this.settings.playTime);

};

Slide.prototype.bindEvents = function() {

  var _this = this;
  var startX = 0;


  this.method.bind(this.slideWrap, 'touchstart', function(ev) {
    var touch = ev.changedTouches[0];
    startX = touch.clientX;
    _this.ul.style.transition = '0s';
    clearInterval(_this.timer);
  });

  this.method.bind(this.slideWrap, 'touchmove', function(ev) {
    var touch = ev.changedTouches[0];
    var num = Number(_this.ul.dataset.num);
    _this.method.transform(_this.ul, touch.clientX - startX + num);
  });

  this.method.bind(this.slideWrap, 'touchend', function(ev) {

    var touch = ev.changedTouches[0];
    var num = _this.ul.dataset.num;


    if (Math.abs(startX - touch.clientX) > _this.screenWidth / 3) {

      startX - touch.clientX > 0 ? _this.slideIndex-- : _this.slideIndex++;

      if (_this.slideIndex > 0) _this.slideIndex = 0;

      if (_this.picLi.length <= Math.abs(_this.slideIndex)) _this.slideIndex = -(_this.picLi.length - 1);

      _this.move(_this.slideIndex * _this.screenWidth);

    } else {
      _this.method.transition(_this.ul);
      _this.method.transform(_this.ul, num);
    }

    _this.autoPlay();

  });


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
    obj.style.transform = 'translate3d(' + target + 'px,0,0)';
  },
  transition: function(obj) {
    obj.style.WebkitTransition = '.3s ease';
    obj.style.transition = '.3s ease';
  },
  bind: function(obj, incident, callback) {
    obj.addEventListener(incident, callback, false);
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
