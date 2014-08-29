var id;
var timeTable = opener.timeTable;
var playerData = [];
var slider;
var timeLeft = 0;// 왼쪽 슬라이더의 시간
var timeRight = 0;// 오른쪽 슬라이더의 시간
var timerHeatMap; // 히트맵 로딩에 대한 타이머

$("#playerImg").attr("src",id+".jpg");

var heatMapData = []; // 히트맵 데이터
for (var i = 0; i < 15855; i++) {
	heatMapData.push(d3.rgb(0,255,0));
}

d3.select("#heatmap").selectAll("rect").data(heatMapData).enter().append("rect");

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
	data.push(0);
}

slider = $("#slider1").slider({
	orientation: "horizontal",
	min : 0,
	max : (timeTable.length - 1) * 100 + timeTable[timeTable.length - 1].END_TIME - timeTable[timeTable.length - 1].START_TIME,
	step : 10,
	range : true,
	values : [0,(timeTable.length - 1) * 100 + timeTable[timeTable.length - 1].END_TIME - timeTable[timeTable.length - 1].START_TIME],
	slide : function(e,ui){change(ui);}
});

d3.select("#distance").selectAll("rect").data(data)
				.enter()
				.append("rect")
				.attr("height", function(d){return d*20;})
				.attr("width",function(d){return $("#distance").width()/10;})
				.attr("y", function(d) {return $("#distance").height()-d*20;})
				.attr("x",function(d,i){return $("#distance").width()*i/10;});

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
			d3.select("#heatmap").selectAll("rect").data(heatMapData)
			.transition()
			.attr("fill", function(d) {
				return d;
			}).attr("x", function(d, i) {
				return (i % 151) * $("#heatmap").width()/151;
			}).attr("y", function(d, i) {
				return parseInt(i / 151) * $("#heatmap").height()/105;
			}).attr("height", $("#heatmap").height()/105).attr("width", $("#heatmap").width()/151);
		});

		distance_request(timeLeft,timeRight);
		possession_request(timeLeft,timeRight);
	}, 500);
	
	$("#time").text(parseInt(ui.values[0]/600) + " : " + parseInt((ui.values[0]%600)/10) + " ~ " + parseInt(ui.values[1]/600) + " : " + parseInt((ui.values[1]%600)/10));

}

function distance_request(starttime, endtime) {
	$.get("http://147.47.206.13/analysis/run_distance_individual?start_time=" + starttime + "&end_time=" + endtime + "&name=" + id, function(d) {
		d3.select("#distance").selectAll("rect").data(d).transition().attr("height", function(d) {
			return d.SUM * 100;
		}).attr("width", function(d) {
			return $("#distance").width() / 10;
		}).attr("y", function(d) {
			return $("#distance").height() - d.SUM * 100;
		}).attr("x", function(d, i) {
			return $("#distance").width() * i / 10;
		});
	});
}

function possession_request(starttime, endtime){
	$.get("http://147.47.206.13/analysis/possession/player?start_time="+starttime+"&end_time="+endtime, function(d){
		var sum = 0;
		var possession;
		for(var i = 0 ; i < d.length ; i++){
			if(d[i].PID == id) {
				possession = d[i].POSSESS;
			}
			sum = sum + d[i].POSSESS;
		}
		$("#possession").text("possession : " + possession*100/sum + "%");
	});
}

$("#analysis").click(function(){
	
	$.get("http://147.47.206.13/analysis/pass/distance?min="+$("#min").val()+"&max="+$("#max").val(),function(d){
		for(var i = 0 ; i < d.length ; i++){
			if(d[i].PID == id && d[i].STATUS == "miss"){
				d3.select("#pass").select("#miss").attr("x",125).attr("y",$("#pass").height()-d[i].NUM*3).attr("width",50).attr("height",d[i].NUM*3);
				d3.select("#pass").select("#misstag").attr("x",125).attr("y",$("#pass").height()-d[i].NUM*3).text(d[i].NUM);
			}
			if(d[i].PID == id && d[i].STATUS == "pass"){
				d3.select("#pass").select("#success").attr("x",175).attr("y",$("#pass").height()-d[i].NUM*3).attr("width",50).attr("height",d[i].NUM*3);
				d3.select("#pass").select("#passtag").attr("x",175).attr("y",$("#pass").height()-d[i].NUM*3).text(d[i].NUM);
			}
		}
		$("#passscore").text(100*d3.select("#successs").attr("y")/(d3.select("#miss").attr("y")+d3.select("#successs").attr("y")));
	});
});