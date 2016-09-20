# game-huoshan

how it work

JS:

```
var test = require.async(["huoshan_h5"]).then(function(huoshan){
	huoshan.render('#container');
	$('.restart').on('click',function(){
		huoshan.restart();//重新开始
	})
	huoshan.init({
		success:function(){
			alert('恭喜你，完成挑战');
		}
	})
});

```
