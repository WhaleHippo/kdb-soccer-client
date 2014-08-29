var timeTable = [];
var slider;

var playSpeed = 1;//재생속도

var FILED_X = [-52490,52490];
var FILED_Y = [0,33960*1.7];
var PLAYTIME = [0,1000];

var scoreA = 0;
var scoreB = 0;

var scaleX = d3.scale.linear().domain(FILED_X).range([0,$("#main").width()]);
var scaleY = d3.scale.linear().domain(FILED_Y).range([0,$("#main").height()]);
var scaleTimeline =  d3.scale.linear().domain(PLAYTIME).range([0,$("#slider").width()]); // 정의역 : 0~전체게임시간
var shotTime = [];
var goalTime = [];
var timerID; // 트랜지션에 대한 타이머
var timerRequest; // 요청에 대한 타이머
var timerSlider; // 슬라이드의 연속적인 움짐임을 제어하기 위한 타이머
var timerDistance; // 선수들의 거리를 가져오는 것에 대한 타이머
var timerBallPossession; // 공의 점유율에 대한 타이머
var timerPass;
var timerHeatmap = [];

var heatMapData = []; // 히트맵 표현을 위한 더미 데이터
for (var i = 0; i < 15855; i++) {
	heatMapData.push(d3.rgb(0,255,0));
}
d3.select("#heatmap").selectAll("rect").data(heatMapData).enter().append("rect");

var loadingState;//데이터 로딩 정도를 나타내는 것 d3.select("body").select("#loading").attr().attr("width", width).attr("height", 20);

var svg = d3.select("#main");
var timeline;
var ds;

var showPossetion = false;
var showDistance = false;
var showPass = false;
var showTeamA = true;
var showTeamB = true; // menu관련 변수들
var showHeatmap = false;

var buffer = {
	startTime : 0, // 현재 큐에서 가장 처음에 저장된 시간
	endTime : 0, //현재 큐에서 가장 마지막에 저장된 시간
	data : [],
	bufferSize : 2000,
	input : function(d) {// 큐에 데이터를 집어넣는 함수
		
		this.data = this.data.concat(d);
		this.startTime = this.data[0][0].FRAME_TS;
		this.endTime = this.data[this.data.length - 1][0].FRAME_TS;
		//alert("data : " + this.data.length);
		if (this.data.length >= this.bufferSize) {// 이미 큐에 1000개의 데이터가 있는 경우
			//alert("input stop!");
			clearInterval(timerRequest);// 리퀘스트 중지
		}
		loadingState.select("rect").attr("x",(timeslide(this.startTime)*$("#slider").width()/36066)).attr("width",(timeslide(this.endTime)-timeslide(this.startTime))*$("#slider").width()/36066);
	},
	clear : function() {// 큐를 비우는 함수
		this.data = [];
		this.startTime=0;
		this.startTime=0;
	},

	half_clear : function() {
		for (var i = 0; i < this.bufferSize/2; i++) this.data.shift();
		this.startTime = this.data[0][0].FRAME_TS;
		this.endTime = this.data[this.data.length - 1][0].FRAME_TS;

	},

	returnData : function(time) {// 큐 안쪽에 시간에 해당되는 데이터가 있는지 없는지 확인하고 있으면 그 시간데의 데이터를 모두 리턴하는 함수
		if (this.startTime <= time && time <= this.endTime) {
			if (this.bufferSize/2 < time - this.startTime && this.data.length >= this.bufferSize) {// 만일 요구하는 시간이  절반 이상에 위치하고 큐가 꽉 찼을 경우 절반을 비우고 새롭게 데이터를 받기 시작.
				this.half_clear();
				
				var index = serachTimetable(this.endTime)+1;
				
				data_reqeust(index);
				timerRequest = setInterval(function() {//새로운 리퀘스트 요청

					data_reqeust(++index);
					
				}, 5000);
			}
			return this.data[time - this.startTime];
		} else {// 범위 밖의 데이터를 요구하는 경우
			$("#playbutton").prop("disabled", true);
			playState=true;
			$("#playbutton").attr("value", "play");
			this.clear();
			clearInterval(timerRequest);//리퀘스트 정지
			
			var index = serachTimetable(time);

			data_reqeust(index);
			timerRequest = setInterval(function() {//새로운 리퀘스트 요청
				$("#playbutton").prop("disabled", false);
				data_reqeust(++index);
			}, 5000);
			return this.data[time - this.startTime];
		}
	}
};

$.get("http://147.47.206.13/meta/time", function(d) { // 시간에 대한 메타데이터를 가져오는 함수. 제일 먼저 실행된다.
	//alert("!");
	timeTable = d;
}).done(function() {
	slider = $("#slider").slider({
		orientation : "horizontal",
		min : 0,
		max : (timeTable.length - 1) * 100 + timeTable[timeTable.length - 1].END_TIME - timeTable[timeTable.length - 1].START_TIME,
		step : 1,
		range : "min",
		value : 0,
		slide : function(e, ui) {
			start(ui.value);
		}
	});
	
	PLAYTIME = [0,(timeTable.length - 1) * 100 + timeTable[timeTable.length - 1].END_TIME - timeTable[timeTable.length - 1].START_TIME];
	scaleTimeline =  d3.scale.linear().domain(PLAYTIME).range([0,$("#slider").width()]);
	
	timeline = d3.select("body").select("#timeline").attr("width", $("#slider").width()).attr("height", 20);
	
	loadingState = d3.select("body").select("#loading").attr("width", $("#slider").width()).attr("height", 20);
	
	

	var index = 0;
	data_reqeust(index);
	timerRequest = setInterval(function() {
		data_reqeust(++index);
	}, 5000);
	
	$.get("http://147.47.206.13/meta/shot", function(d) {//슈팅에 대한 메타데이터를 받아
		shotTime = d;
		timeline.selectAll("rect").data(shotTime).enter().append("rect").attr("width", 3).attr("height", 10).attr("x", function(d,i) {

			return scaleTimeline(timeslide(d.SHOT_TIME));
		}).attr("y", 5).on("click", function() {
			slider.slider("value", Math.round(d3.select(this).attr("x") * PLAYTIME[1] / $("#slider").width()));
			start(Math.round(d3.select(this).attr("x") * PLAYTIME[1] / $("#slider").width()));
		});

	});

	$.get("http://147.47.206.13/meta/goal", function(d) {//슈팅에 대한 메타데이터를 받아
		goalTime = d;
		timeline.selectAll("circle").data(goalTime).enter().append("circle").attr("fill", function(d) {
			if (d.TEAM == "A")
				return "blue";
			else
				return "red";
		}).attr("r", 3).attr("cx", function(d) {
			return scaleTimeline(timeslide(d.FRAME_TS));
		}).attr("cy", 5).on("click", function() {
			slider.slider("value", Math.round(d3.select(this).attr("cx") * PLAYTIME[1] / $("#slider").width()));
			start(Math.round(d3.select(this).attr("cx") * PLAYTIME[1] / $("#slider").width()));
		});

	});

}).fail(function(){
	alert("fail!!!");
});

function data_reqeust(index) {
	
	$.get("http://147.47.206.13/data?start_time=" + timeTable[index].START_TIME + "&end_time=" + timeTable[index].END_TIME, function(d) {
		console.log(index);
		buffer.input(d);
	}).done(function() {
		
		if ( index == 0) { // 첫호출시
			
			var width = $("#slider").width();
			

			resizefiled();
			
			svg = d3.select("body").select("#main").attr("width", $("#content1").width()).attr("height", $("#content1").height());

			ds = svg.selectAll(".test").data(buffer.returnData(slidetime(0))).attr("points", function(d) {
				return lotation(scaleX(d.PX), scaleY(d.PY), theta(d.VX, d.VY));
			}).attr("x", function(d) {
				return scaleX(d.PX);
			}).attr("y", function(d) {
				return scaleY(d.PY);
			}).attr("width", 10).attr("height", 25).attr("cx", function(d) {
				return scaleX(d.PX);
			}).attr("cy", function(d) {
				return scaleY(d.PY);
			}).attr("r", 7).attr("id",10)
			.on("click",function(d){
				open_player_window(d.PID);
			});
			
			svg.selectAll("text").data(buffer.returnData(slidetime(0))).attr("x", function(d) {
				return scaleX(d.PX);
			}).attr("y", function(d) {
				return scaleY(d.PY);
			});
		}	
	}).fail(function(){
		alert("fail!");
	});
}

function slidetime(slideValue) {// 슬라이드의 값을 실제의 시간으로 바꿔주는 함수. 이 함수가 필요한 이유는 전반전과 후반전 사이의 하프타임에서 시간의 공백이 생기기 때문이다.
	return timeTable[parseInt(slideValue / 100)].START_TIME + (slideValue % 100);
}

function timeslide(time){ // 시간을 슬라이드 밸류로 바꿔주는 함수
	return serachTimetable(time)*100 + time - timeTable[serachTimetable(time)].START_TIME;
}

function serachTimetable(time) {// time을 입력하면 timetable을 조사해서 해당 time이 timetable의 몇번째 index에 위치하는지 index를 리턴한다.
	var low = 0, high = timeTable.length-1, mid=0;
	while(low<=high){
		mid = parseInt((low + high) / 2);
		if(timeTable[mid].START_TIME>time) high = mid - 1;
		else if(time > timeTable[mid].END_TIME) low = mid + 1;
		else return mid;
	}
	return 0;
}

var lotation = function(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10; // 선수들을 표현할 크기
	if(x==null||y==null||theta==null) return false;
	return (x+2*r*Math.cos(theta)) + "," + (y+2*r*Math.sin(theta)) + " "+ (x+r*Math.cos(theta+90)) + "," + (y+r*Math.sin(theta+90)) + " "+ (x+r*Math.cos(theta-90)) + "," + (y+r*Math.sin(theta-90));
};

var theta = function(vx, vy){ // 두 방향의 속도를 받아서 라디안값으로 반환
	if(vx<0&&vy<0) return Math.atan(vy/vx)+Math.PI;
	else if(vx>0&&vy<0) return Math.atan(vy/vx)+Math.PI/2;
	else if(vx<0&&vy>0) return Math.atan(vy/vx)+Math.PI*3/2;
	else return Math.atan(vy/vx);
};

function start(slideValue) { // 재생을 시작하는 함수
	
	var time = slidetime(slideValue);
	clearInterval(timerID);
	clearInterval(timerSlider);
	
	scoreA = scoreB = 0;
	
	for(var i = 0 ; i < goalTime.length ; i++){
		if(goalTime[i].FRAME_TS <= time){
			if(goalTime[i].TEAM == "A") scoreA++;
			else scoreB++;
		}
	}
	
	
	$("#time").text(parseInt(slideValue/600) + " : " + parseInt((slideValue%600)/10));
	
	$("#score").text(scoreA + " : " + scoreB);
	
	if (buffer.startTime <= time && time <= buffer.endTime){
		ds
		.data(buffer.returnData(time))
		.attr("points", function(d) {
			return lotation(scaleX(d.PX), scaleY(d.PY), theta(d.VX, d.VY));
		})
		.attr("x", function(d){return scaleX(d.PX);})
		.attr("y", function(d){return scaleY(d.PY);})
		.attr("cx", function(d){return scaleX(d.PX);})
		.attr("cy", function(d){return scaleY(d.PY);})
		.attr("fill",function(d,i){
			if(d.POSSESS == 1) return "white";
			if(d.PX==null) return "transparent";
			else{
				if(i<8) return "blue";
				else if(i<16) return "red";
				else if (i<20) return "black";
				else return "yellow";
			}
		});
		
		svg.selectAll("text").data(buffer.returnData(time))
		.transition()
		.duration(100 / playSpeed)
		.attr("x", function(d) {
			if(d.PX==null) return $(this).attr("x");
			else return scaleX(d.PX);
		}).attr("y", function(d) {
			if(d.PX==null) return $(this).attr("y");
			else return scaleY(d.PY);
		}).text(function(d,i){
			if(d.PX==null) return "null";
			else return i+1;
		});
		
		timerID = setInterval(function() {
			scoreA = scoreB =0;
			for(var i = 0 ; i < goalTime.length ; i++){
				if(goalTime[i].FRAME_TS <= slidetime(slideValue)){
					if(goalTime[i].TEAM == "A") scoreA++;
					else scoreB++;
				}
			}
			
			$("#time").text(parseInt(slideValue/600) + " : " + parseInt((slideValue%600)/10));
			$("#score").text(scoreA + " : " + scoreB);
			ds.call(move, ++slideValue);
		}, Math.round(100/playSpeed));
	}
	else{
		timerSlider = setInterval(function(){
			clearInterval(timerSlider);
			ds
			.data(buffer.returnData(time))
			.attr("points", function(d) {
				return lotation(scaleX(d.PX), scaleY(d.PY), theta(d.VX, d.VY));
			})
			.attr("x", function(d){return scaleX(d.PX);})
			.attr("y", function(d){return scaleY(d.PY);})
			.attr("cx", function(d){return scaleX(d.PX);})
			.attr("cy", function(d){return scaleY(d.PY);})
			.attr("fill",function(d,i){
				
				if(d.PX==null) return "transparent";
				else{
					if(i<8) return "blue";
					else if(i<16) return "red";
					else if (i<20) return "black";
					else return "yellow";
				}
			});
			
			svg.selectAll("text").data(buffer.returnData(time))
			.transition()
			.duration(Math.round(100/playSpeed))
			.attr("x", function(d) {
				if(d.PX==null) return $(this).attr("x");
				else return scaleX(d.PX);
			}).attr("y", function(d) {
				if(d.PX==null) return $(this).attr("y");
				else return scaleY(d.PY);
			}).text(function(d,i){
				if(d.PX==null) return "null";
				else return i+1;
			});
					
			
			timerID = setInterval(function() {
				scoreA = scoreB =0;
				for(var i = 0 ; i < goalTime.length ; i++){
					if(goalTime[i].FRAME_TS <= slidetime(slideValue)){
						if(goalTime[i].TEAM == "A") scoreA++;
						else scoreB++;
					}
				}
				
				$("#header_center").text(parseInt(slideValue/600) + " : " + parseInt((slideValue%600)/10));
				
				$("#score").text(scoreA + " : " + scoreB);
				
				ds.call(move, ++slideValue);
			}, Math.round(100/playSpeed));
			
		},1000);
	}
};

function move(selection, slideValue) { // 선수,공과 데이터를 연동하여 움직이게 하는 함수
	
	selection
	.data(buffer.returnData(slidetime(slideValue)))
	.transition()
	.duration(Math.round(100/playSpeed))
	.ease("linear")
	.attr("points", function(d) {
		if(d.PX==null) return $(this).attr("points");
		return lotation(scaleX(d.PX), scaleY(d.PY), theta(d.VX, d.VY));
	})
	.attr("x", function(d){
		if(d.PX==null) return $(this).attr("x");
		return scaleX(d.PX);})
	.attr("y", function(d){
		if(d.PX==null) return $(this).attr("y");
		return scaleY(d.PY);})
	.attr("cx", function(d){
		if(d.PX==null) return $(this).attr("cx");
		return scaleX(d.PX);})
	.attr("cy", function(d){
		if(d.PX==null) return $(this).attr("cy");
		return scaleY(d.PY);})
	.attr("fill",function(d,i){
		if(d.POSSESS == 1){ 
			if(showPossetion) $(this).attr("stroke-width", 3).attr( "stroke","white");
		}
		else{
			$(this).attr("stroke-width", 0);
		}
		if(d.PX==null) return "transparent";
		else{
			if(i<8){
				if(showTeamA)	return "blue";
				else return "transparent";
			}
			else if(i<16){
				if(showTeamB)	return "red";
				else return "transparent";
			}
			else if (i<20) return "black";
			else return "yellow";
		}
	});
	
	svg.selectAll("text").data(buffer.returnData(slidetime(slideValue)))
	.transition()
	.duration(Math.round(100/playSpeed))
	.attr("x", function(d) {
		if(d.PX==null) return $(this).attr("x");
		else return scaleX(d.PX);
	}).attr("y", function(d) {
		if(d.PX==null) return $(this).attr("y");
		else return scaleY(d.PY);
	}).text(function(d,i){
		if(d.PX==null) return "null";
		else return i+1;
	});
	slider.slider("value", slideValue);
}

function open_player_window(id) {
	var newwindow = window.open("newwindow.html");
	newwindow.id = id;
	//newwindow.timeTable=timeTable;
}
var playState = true; //실행여부 ture면 실행, false면 일시정지
$("#playbutton").click(function() {
	$(this).attr("value", function() {
		if (playState) {
			playState=false;
			start(slider.slider("value"));
			return "stop";
		} else
		clearInterval(timerID);
			playState=true;
			return "play";
	});
});
$("#increase").click(function() {
	if (playSpeed <= 2) playSpeed = playSpeed + 0.1;
	$("#playspeed").text("playspeed : "+parseInt(playSpeed*100) + "%");
}); 
$("#decrease").click(function() {
	if (playSpeed > 0.6) playSpeed = playSpeed - 0.1;
	$("#playspeed").text("playspeed : "+parseInt(playSpeed*100) + "%");
});

$("#check1").click(function() {
	if(showPossetion){
		clearInterval(timerBallPossession);
		showPossetion=false;
	}
	else{
		$.get("http://147.47.206.13/analysis/possession/team?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){
			d3.select("#possession").selectAll("rect").data(d).attr("y",function(d){return 200-d.POSSESS*0.1;}).attr("x",function(d,i){return 40+i*40;}).attr("width",40).attr("height",function(d){return d.POSSESS*0.1;});
		});
		
		timerBallPossession = setInterval(function(){
		$.get("http://147.47.206.13/analysis/possession/team?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){
			d3.select("#possession").selectAll("rect").data(d).attr("y",function(d){return 200-d.POSSESS*0.1;}).attr("x",function(d,i){return 40+i*40;}).attr("width",40).attr("height",function(d){return d.POSSESS*0.1;});
		});
		},10000);
		showPossetion=true;
	}
});
$("#check2").click(function() {
	if(showDistance){
		clearInterval(timerDistance);
		showDistance=false;
	}
	else {
		$.get("http://147.47.206.13/analysis/run_distance?time="+slidetime(slider.slider("value")), function(d) {
			d3.select("#distance").selectAll("rect").data(d).attr("y",function(d){return 200-d.SUM*20;}).attr("x",function(d,i){return i*15;}).attr("width",15).attr("height",function(d){return d.SUM*20;}).attr("fill",function(d,i){
				if(i<8) return "blue";
				else return "red";
			});
			d3.select("#distance").selectAll("text").data(d).attr("y",200).attr("x",function(d,i){$(this).text(i+1); return i*15;});
		});
		timerDistance = setInterval(function(){
			$.get("http://147.47.206.13/analysis/run_distance?time="+slidetime(slider.slider("value")), function(d) {
				d3.select("#distance").selectAll("rect").data(d).attr("y",function(d){return 200-d.SUM*20;}).attr("x",function(d,i){return i*15;}).attr("width",15).attr("height",function(d){return d.SUM*20;});
			});
		},10000);
		showDistance=true;
	}
});
$("#check3").click(function() {
	if(showPass){
		clearInterval(timerPass);
		showPass=false;
	}
	else {
		$.get("http://147.47.206.13/analysis/pass/team?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){	
			d3.select("#pass").selectAll("rect").data(d).attr("y",function(d){return 200-d.NUM;}).attr("x",function(d,i){return 40+i*30;}).attr("width",30).attr("height",function(d){return d.NUM;});
		});
		timerPass = setInterval(function(){
			$.get("http://147.47.206.13/analysis/pass/team?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){	
				d3.select("#pass").selectAll("rect").data(d).attr("y",function(d){return 200-d.NUM;}).attr("x",function(d,i){return 40+i*30;}).attr("width",30).attr("height",function(d){return d.NUM;});
			});
		},10000);
		showPass=true;
	}
});
$("#check4").click(function() {
	if(showTeamA) showTeamA=false;
	else showTeamA=true;
});
$("#check5").click(function() {
	if(showTeamB) showTeamB=false;
	else showTeamB=true;
});
$("#check6").click(function() {
	
	if(showHeatmap){
		clearInterval(timerHeatmap);
		showHeatmap=false;
	}
	else {
		$.get("http://147.47.206.13/analysis/heatmap/total?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){	
			var i;
			for ( i = 0; i < 15855; i++) { // 15855 = 105*151
				heatMapData[i] = d3.rgb(0, 255, 0);
			}

			for ( i = 0; i < d.length; i++) {
				if (d[i].CELL_Y != null && d[i].CELL_X != null && d[i].CELL_Y > -1) {
					heatMapData[151 * d[i].CELL_Y + d[i].CELL_X + 75] = d3.rgb(900 * d[i].TIME * d[i].TIME, 255 - 900 * d[i].TIME * d[i].TIME, 0);
				}
			}
			
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
		timerHeatmap = setInterval(function(){
			$.get("http://147.47.206.13/analysis/heatmap/total?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){	
				var i;
				for ( i = 0; i < 15855; i++) { // 15855 = 105*151
					heatMapData[i] = d3.rgb(0, 255, 0);
				}
	
				for ( i = 0; i < d.length; i++) {
					if (d[i].CELL_Y != null && d[i].CELL_X != null && d[i].CELL_Y > -1) {
						heatMapData[151 * d[i].CELL_Y + d[i].CELL_X + 75] = d3.rgb(900 * d[i].TIME * d[i].TIME, 255 - 900 * d[i].TIME * d[i].TIME, 0);
					}
				}
				
				d3.select("#heatmap").selectAll("rect").data(heatMapData)
				.transition()
				.attr("fill", function(d) {
					return d;
				}).attr("x", function(d, i) {
					return (i % 151) *$("#heatmap").width()/151;
				}).attr("y", function(d, i) {
					return parseInt(i / 151) * $("#heatmap").height()/105;
				}).attr("height", $("#heatmap").height()/105).attr("width", $("#heatmap").width()/151);
			});
		},100000);
		showHeatmap=true;
	}
});


function resizefiled(){ // 경기장 표현
	
	var width = $("#content1").width();
	
	 svg.select("#field1").attr("x",30).attr("y",30)
		.attr("height",width*0.729 - 60).attr("width",5);
		
	 svg.select("#field2").attr("x",30).attr("y",30)
		.attr("height",5).attr("width",width -60);
		
	 svg.select("#field3").attr("x",width-30).attr("y",30)
		.attr("height",width*0.729 - 55).attr("width",5);
	 
	 svg.select("#field4").attr("x",30).attr("y",width*0.729-30)
		.attr("height",5).attr("width",width -60);
		
	 svg.select("#field5").attr("x",width*0.5).attr("y",30)
		.attr("height",width*0.729 -60).attr("width",5);
	
	 svg.select("#field0").attr("cx",width*0.5).attr("cy",width*0.729*0.5).attr("r",width*0.15);
	 
}

$(window).resize(function() {
	resizefiled();

}); 

