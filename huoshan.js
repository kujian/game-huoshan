"use strict";
var $ = require('common:jquery');
//引入锦囊组件
// var jn = require.async(["jinnang"]).then(function(jinnang){
//     var gw1 = {
//         txt:'需要网友先点击宝石，然后，不断的点击一键启动按钮，当时速表突破80KM/H时，则通关。',
//         ps:'PS：请注意点击的先后顺序。'
//     }
//     jinnang.init(gw1.txt,gw1.ps);
// });
var tpl = __inline('huoshan_h5.tpl');

// $(tpl).appendTo('body');

var huoshan = {
	timer:-1,
	PAUSE:true,
	loadImgs: function(images,callback) {
      function imageLoaded() {
             // function to invoke for loaded image
             // decrement the counter
             counter--; 
             if( counter === 0 ) {
                 callback && callback();
             }
          }
          var counter = images.length;  // initialize the counter
          images.each(function() {
              if( this.complete ) {
                  imageLoaded.call( this );
              } else {
                  $(this).one('load', imageLoaded).each(function() {
                    if(this.complete) $(this).load();
                  });
              }
          });
    },
    //加载内容
	render:function(id){
		var _self = this;
		if(id){
			$(id).html("");
			_self.box = $(tpl).appendTo(id);
		}else{
			_self.box = $(tpl).appendTo("body");
		}
		_self.PAUSE = true;
	},
	//初始化
	init:function(option){
		var opts = option || {};
		var _self = this;
		var ua = navigator.userAgent;
        _self.type = !!ua.match(/AppleWebKit.*Mobile.*/) ? 'touchstart': 'click';
        _self.loadImgs($('#Jhuoshan img'),function(){
        	_self.resetBoxHeight();
        	_self.baoshi(opts);
        })
	},
	//捡起宝石
	baoshi:function(option){
		var opts = option || {};
		var _self = this;
		_self.box.find('.bg').addClass('shake-long');
		var startTimer = setTimeout(function(){
			clearTimeout(startTimer);
			_self.box.find('.bg').removeClass('shake-long');
			startTimer = null;
		},820);
		var baoshi = _self.box.find('.baoshi');
		baoshi.show();
		baoshi.addClass('zoomIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
			$(this).find('img').attr('class','animated infinite');
		});
		baoshi.on(_self.type,function(){
		// var timer = setTimeout(function(){
			// clearInterval(timer);
			// timer = null;
			baoshi.addClass('zoomOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$(this).fadeOut();
			});
			_self.box.find('.shadowbg').fadeOut('normal',function(){
				_self.box.find('.p3').addClass('pulse2 pulse3');
				_self.play(opts);
			});
		// },1000);
			
		});
	},
	//重置页面
	resetBoxHeight:function(){
		var _self = this;
		var winHeight = $(window).height(), winWidth = $(window).width(), box = $('.huoshan .bd'), $el = $('.huoshan .p1, .huoshan .p2');
		if(winHeight<536){
			var boxWidth = winHeight*(1136/536);
			var scaleNo = winHeight/536;
			box.css({
				width:boxWidth,
				height:winHeight
			});
			$el.css({
				transform:'scale('+ scaleNo +')'
			})
		}
		$(window).on('resize',function(){
			winHeight = $(window).height(), winWidth = $(window).width();
			if(winHeight<536){
				var boxWidth = winHeight*(1136/536);
				var scaleNo = winHeight/536;
				box.css({
					width:boxWidth,
					height:winHeight
				});
				$el.css({
					transform:'scale('+ scaleNo +')'
				})
			}else{
				box.css({
					width:'1136px',
					height:'536px'
				});
				$el.css({
					transform:'scale(1)'
				})
			}
		})
		
	},
	//开始游戏
	play:function(option){
		var opts = option || {};
		var _self = this;
		if(!_self.PAUSE) return ;
		_self.PAUSE = false;
		var btn = _self.box.find('.p3');
		var point1 = _self.box.find('.p1 .zhen');
		var point2 = _self.box.find('.p2 .zhen');
		var bg = _self.box.find('.bg');
		var rotate1 = -33;
		var rotate2 = -33;
		var distance = 0;
		var clickIndex = 0;
		var prevIndex = 0;
		window.clearInterval(_self.timer);
		_self.timer = null;
		btn.on(_self.type,function(){
			if(clickIndex == 0){
				// btn.removeClass('pulse2');
				// btn.addClass('pulse3');
			}
			clickIndex++;
		});
		//查询用户的点击数定时器
		_self.timer = setInterval(function(){
			if(clickIndex<1) return;
			//查阅用户上次的点击值，以此来跟目前的点击值做对比
			prevIndex = parseInt(btn.attr('prevIndex')) || 0;
			distance = clickIndex - prevIndex;
			//大于0代表在点击，点击的快慢从这个distance大小体现，每隔0.5s会查询用户这段时间内点击了多少次。
			if(distance>0){
				point1.removeClass('lose');
				point2.removeClass('lose');
				rotate1 = rotate1 + distance*4;
				rotate2 = rotate1;
				bg.removeClass('shake-stop');
				if(distance<2){
					bg.removeClass('shake-hard').addClass('shake');
				}else{
					bg.removeClass('shake').addClass('shake-hard');
				}
			//假如小于或等于0，说明用户没有在点击，指针会回退
			}else{
				point1.addClass('lose');
				point2.addClass('lose');
				rotate1 = rotate1 - 12;
				rotate2 = rotate1;
				bg.addClass('shake-stop');
			}
			if(clickIndex > 0 && point1.hasClass('lose') && rotate1 < -21){
				// point1.addClass('zhongli'); //重力效果
			}
			//当指针到达0时，停止指针转动和页面震动
			if(rotate1<=-33){
				rotate1 = rotate2 = -33;
				bg.attr('class','bg');
			}else if(rotate1 >= 54){
				// rotate1 = rotate2 = 54;
				point1.addClass('stop');
				point2.addClass('stop');
			}
			point1.css('transform','rotate('+ rotate1 +'deg)');
			point2.css('transform','rotate('+ rotate2 +'deg)');
			//如果指针到达80km时，停止转动指针，并去掉按钮，清除指针的定时器
			if(rotate2 >= 54){
				window.clearInterval(_self.timer);
				_self.timer = null;
				rotate1 = rotate2 = 54;
				clickIndex = prevIndex = distance = 0;
				bg.addClass('shake-stop').removeClass('shake shake-hard');
				btn.fadeOut('normal',function(){
					if(opts.success) opts.success.call(this);
					_self.PAUSE = true;
				});
			}
			//如果上一次的值小于这次的值，说明用户点击了，记录一下这次的值，方便知道上一次的值是多少
			if(prevIndex < clickIndex){
				prevIndex = clickIndex;
				btn.attr('prevIndex',prevIndex);
			}
		}, 500);
	},
	restart:function(){
		var _self = this;
		_self.PAUSE = true;
		window.clearInterval(this.timer);
		this.timer = null;
		_self.box.find('.baoshi').removeAttr('style').removeClass('zoomIn animated zoomOut');
		_self.box.find('.shadowbg').removeAttr('style');
		_self.box.find('.p3').removeClass('pulse2 pulse3').show();
		// _self.box.find('.p3').attr('previndex','0');
		_self.box.find('.p3').removeAttr('previndex');
		_self.box.find('.p3').attr('previndex','0');
		_self.box.find('.p1 .zhen').removeClass('stop lose');
		_self.box.find('.p1 .zhen').css('transform','rotate(-33deg)');
		_self.box.find('.p2 .zhen').removeClass('stop lose');
		_self.box.find('.p2 .zhen').css('transform','rotate(-33deg)');
		_self.baoshi();
	},
	open:function(){
		this.box.show();
	},
	close:function(){
		this.box.hide();
	}
}

// huoshan.render();
module.exports = huoshan
