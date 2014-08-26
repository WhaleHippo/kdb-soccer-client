var id;
var timeTable = opener.timeTable;
var playerData = [];
var slider;
var timeLeft = 0;// 왼쪽 슬라이더의 시간
var timeRight = 0;// 오른쪽 슬라이더의 시간
var heatMap = d3.select("body").select("#heatmap").attr("width", 750).attr("height", 550);// 히트맵을 표현할 svg
var timerHeatMap; // 히트맵 로딩에 대한 타이머

$("#playerImg").attr("src",id+".jpg");

var heatMapData = []; // 히트맵 데이터
for (var i = 0; i < 15855; i++) {
	heatMapData.push(d3.rgb(0,255,0));
}
heatMap.selectAll("rect").data(heatMapData).enter().append("rect").attr("fill", function(d) {
	return d;
}).attr("x", function(d, i) {
	return (i % 15) * 50;
}).attr("y", function(d, i) {
	return parseInt(i / 15) * 50;
}).attr("height", 50).attr("width", 50); 



$.get("http://147.47.206.13/meta/player", function(d) {
	playerData=d;
}).done(function(){
	for(var i =0;i<playerData.length;i++){
		if(playerData[i].PLAYER_ID==id) $("#playerid").text("name : " + playerData[i].NAME);
	}
});

function slidetime(slideValue) {// 슬라이드의 값을 실제의 시간으로 바꿔주는 함수. 이 함수가 필요한 이유는 전반전과 후반전 사이의 하프타임에서 시간의 공백이 생기기 때문이다.
	return timeTable[parseInt(slideValue / 100)].START_TIME + (slideValue % 100);
}

var data=[];
for(var i=0;i<10;i++){
	data.push(50);
}

slider = $("#slider").slider({
	orientation: "horizontal",
	min : 0,
	max : (timeTable.length - 1) * 100 + timeTable[timeTable.length - 1].END_TIME - timeTable[timeTable.length - 1].START_TIME,
	step : 10,
	range : 15000,
	values : [0,(timeTable.length - 1) * 100 + timeTable[timeTable.length - 1].END_TIME - timeTable[timeTable.length - 1].START_TIME],
	slide : function(e,ui){change(ui);}
});

var svg = d3.select("body").select("#playerstate").attr("width", $("#slider").width()).attr("height", 100);

svg.selectAll("rect").data(data)
				.enter()
				.append("rect")
				.attr("height", function(d){return d;})
				.attr("width",function(d){return $("#slider").width()/10;})
				.attr("y", function(d) {return 100-d;})
				.attr("x",function(d,i){return $("#slider").width()*i/10;});


function change(ui) {
	
	timeLeft=slidetime(ui.values[0]);
	timeRight=slidetime(ui.values[1]);
	console.log(timeRight);
	var changeData=[];
	
	for(var i =0;i<100;i++){
		if(ui.values[0]/360<i&&i<ui.values[1]/360){
			changeData.push(data[i]);
		}
		else changeData[i]=-10;
	}
	
	clearInterval(timerHeatMap);

	timerHeatMap = setInterval(function() {
		clearInterval(timerHeatMap);
		$.get("http://147.47.206.13/analysis/heatmap?start_time=" + timeLeft +"&end_time=" + timeRight+ "&name=" + id, function(d) {
			//alert(d);
			var i;
			for ( i = 0; i < 15855; i++) { // 15855 = 105*151
				heatMapData[i] = d3.rgb(0, 255, 0);
			}

			for ( i = 0; i < d.length; i++) {
				if (d[i].CELL_Y != null && d[i].CELL_X != null && d[i].CELL_Y > -1) {
					heatMapData[151 * d[i].CELL_Y + d[i].CELL_X + 75] = d3.rgb(900 * d[i].TIME * d[i].TIME, 255 - 900 * d[i].TIME * d[i].TIME, 0);
				}
			}
		}).done(function() {
			heatMap.selectAll("rect").data(heatMapData)
			.transition()
			.attr("fill", function(d) {
				return d;
			}).attr("x", function(d, i) {
				return (i % 151) * 5;
			}).attr("y", function(d, i) {
				return parseInt(i / 151) * 5;
			}).attr("height", 5).attr("width", 5);
		});

		var distanceArray=[];
		distance_request(timeLeft,timeRight,distanceArray,(timeRight-timeLeft)/10);
		
	}, 500);
	

}
function distance_request(starttime, endtime, distanceArray, dis) {
	$.get("http://147.47.206.13/analysis/run_distance_individual?start_time=" + starttime + "&end_time=" + starttime + dis + "&name=" + id, function(d) {
		distanceArray = distanceArray.concat(d);
		console.log(d[0].SUM);
	}).done(function() {
		if (starttime < endtime) {
			distance_request(starttime + dis, endtime, distanceArray, dis);
		} else {
			svg.selectAll("rect").data(distanceArray).transition().attr("height", function(d) {
				return d.SUM * 10;
			}).attr("width", function(d) {
				return $("#slider").width() / 10;
			}).attr("y", function(d) {
				return 100 - d.SUM * 10;
			}).attr("x", function(d, i) {
				return $("#slider").width() * i / 10;
			});
		}
	});
}
