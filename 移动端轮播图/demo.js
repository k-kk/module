'use strict'

function Slide() {

 this.settings = {
  autoPlay: true, // 是否自动播放
  playTime: 3000  // 播放间隔
 };
}

Slide.prototype.init = function(parameter) {

};

Slide.prototype.extend = function(par1, par2) {
  for (var attr in par2) {
    par1[attr] = par2[attr];
  }
};
