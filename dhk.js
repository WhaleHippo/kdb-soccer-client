/*

var slider = $("#slider").slider({
	orientation: "horizontal",
	min : 0,
	max : 1000,
	step : 1,
	range : "min",
	value : 1,
	slide : function(e,ui){start(ui.value);}
});


var scalex = d3.scale.linear().domain([-52490,52490]).range([0,$("#slider").width()*0.7]);
var scaley = d3.scale.linear().domain([-33960,33960]).range([0,$("#slider").width()*0.729*0.7]);
var scaletimeline =  d3.scale.linear().domain([0,1000]).range([0,$("#slider").width()]); // 정의역 : 0~전체게임시간
var data = [];
var goaltime = [90, 150, 200, 300, 450, 700, 900, 950];
var timerID;
var timer_request;

var svg;
var timeline;
var ds;

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
function start(count) {
	
	clearInterval(timerID);
	
	ds
	.data(data[count])
	.attr("points", function(d) {
		return lotation(scalex(d.x), scaley(d.y), theta(d.vx, d.vy));
	})
	.attr("x", function(d){return scalex(d.x);})
	.attr("y", function(d){return scaley(d.y);})
	.attr("cx", function(d){return scalex(d.x);})
	.attr("cy", function(d){return scaley(d.y);});
	
	timerID = setInterval(function() {
		ds.call(move, ++count);
	}, 100);

};


function resizefiled(){ // 경기장 표현
	 svg.select("#field1").attr("x",$("#slider").width()*0.2).attr("y",$("#slider").width()*0.729*0.35)
		.attr("height",$("#slider").width()*0.4).attr("width",5);
		
	 svg.select("#field2").attr("x",$("#slider").width()*0.2).attr("y",$("#slider").width()*0.729*0.35)
		.attr("height",5).attr("width",$("#slider").width()*0.675 + 5);
		
	 svg.select("#field3").attr("x",$("#slider").width()*0.875).attr("y",$("#slider").width()*0.729*0.35)
		.attr("height",$("#slider").width()*0.4).attr("width",5);
	 
	 svg.select("#field4").attr("x",$("#slider").width()*0.2).attr("y",$("#slider").width()*0.729*0.35 + $("#slider").width()*0.4 - 5)
		.attr("height",5).attr("width",$("#slider").width()*0.675 + 5);
		
	 svg.select("#field5").attr("x",$("#slider").width()*0.53).attr("y",$("#slider").width()*0.729*0.35)
		.attr("height",$("#slider").width()*0.4).attr("width",5);
	
	 svg.select("#field5").attr("cx",$("#slider").width()*0.53).attr("cy",$("#slider").width()*0.729*0.35 + $("#slider").width()*0.2).attr("r",10);
		
}
//1. 초기 데이터 셋

$.get("http://147.47.206.13/data?start_time=107530&end_time=108530",function(d){
	alert("start!");
	for(var i=0;i<1000;i++){
		data.push([]);
		for(var j=0;j<d[i].length;j++){
			if(j>=0&&j<16){
				data[i].push({
					y : d[i][j].PX,
					x : d[i][j].PY,
					vy : -d[i][j].PX + d[i+1][j].PX,
					vx : -d[i][j].PY + d[i+1][j].PY
				});
			}
			if(j>=16&j<20){
				data[i].push({
					y : d[i][j].PX,
					x : d[i][j].PY
				});
			}
			if(j==20){
				data[i].push({
					y : d[i][j].PX,
					x : d[i][j].PY,
					vy : -d[i][j].PX + d[i+1][j].PX,
					vx : -d[i][j].PY + d[i+1][j].PY
				});
			}
		}
	}
}).done(function() {
	svg = d3.select("body").select("#main").attr("width", $("#slider").width()).attr("height", $("#slider").width()*0.729);
	scalex = d3.scale.linear().domain([-52490,52490]).range([0,$("#slider").width()*0.7*1.5]);
	scaley = d3.scale.linear().domain([-33960,33960]).range([0,$("#slider").width()*0.729*0.7]);
	resizefiled();

	timeline = d3.select("body").select("#timeline").attr().attr("width", $("#slider").width()).attr("height", 20);
	
	timeline.selectAll("rect").data(goaltime).enter().append("rect").attr("width",3).attr("height",10).attr("x",function(d){return scaletimeline(d);}).attr("y",5).attr("fill","red")
			.on("click",function(){
				start(Math.round(d3.select(this).attr("x")*1000/$("#slider").width()));
			});
	
	ds = svg.selectAll(".test")
				.data(data[0])
				.attr("points", function(d) {
					return lotation(scalex(d.x), scaley(d.y), theta(d.vx, d.vy));
				})
				.attr("x", function(d){return scalex(d.x);})
				.attr("y", function(d){return scaley(d.y);})
				.attr("width", 10)
				.attr("height", 25)
				.attr("cx", function(d){return scalex(d.x);})
				.attr("cy", function(d){return scaley(d.y);})
				.attr("r",10);

}).fail(function(){alert("fail");});

function move(selection, time) {
	selection
	.data(data[time])
	.transition()
	.duration(100)
	.ease("linear")
	.attr("points", function(d) {
		return lotation(scalex(d.x), scaley(d.y), theta(d.vx, d.vy));
	})
	.attr("x", function(d){return scalex(d.x);})
	.attr("y", function(d){return scaley(d.y);})
	.attr("cx", function(d){return scalex(d.x);})
	.attr("cy", function(d){return scaley(d.y);});
	slider.slider("value", time);
}

$(window).resize(function() {
	// 축적 재설정
	scalex = d3.scale.linear().domain([-52490,52490]).range([0,$("#slider").width()*0.7*1.5]);
	scaley = d3.scale.linear().domain([-33960,33960]).range([0,$("#slider").width()*0.729*0.7]);
	scaletimeline = d3.scale.linear().domain([0, 1000]).range([0, $("#slider").width()]);
	resizefiled();
	// 인터페이스 크기 재설정
	timeline = d3.select("body").select("#timeline").attr().attr("width", $("#slider").width()).attr("height", 20);
	var svg = d3.select("body").select("#main").attr("width", $("#slider").width()).attr("height", $("#slider").width()*0.729);
	
	timeline.selectAll("rect").data(goaltime).attr("width", 3).attr("height", 10).attr("x", function(d) {
		return scaletimeline(d);
	}).attr("y", 10).attr("fill", "red");
}); 
*/
var timeTable = [];
var slider;
var playButton = $("#playbutton"); // 재생 일시 정지 버튼
var increasePlaySpeedButton = $("#increase");
var decreasePlaySpeedButton = $("#decrease");

var playSpeed = 1;//재생속도

var FILED_X = [-52490,52490];
var FILED_Y = [0,33960];
var PLAYTIME = [0,1000];

var scaleX = d3.scale.linear().domain(FILED_X).range([30,$("#slider").width()*0.7 - 30]);
var scaleY = d3.scale.linear().domain(FILED_Y).range([30,$("#slider").width()*0.729*0.7 - 30]);
var scaleTimeline =  d3.scale.linear().domain(PLAYTIME).range([0,$("#slider").width()]); // 정의역 : 0~전체게임시간
var goalTime = [90, 150, 200, 300, 450, 700, 900, 950];
var timerID; // 트랜지션에 대한 타이머
var timerRequest; // 요청에 대한 타이머
var ballPossession = []; // 공의 데이터

var loadingState;//데이터 로딩 정도를 나타내는 것 d3.select("body").select("#loading").attr().attr("width", width).attr("height", 20);

var svg;
var timeline;
var ds;

var buffer = {
	startTime : 0, // 현재 큐에서 가장 처음에 저장된 시간
	endTime : 0, //현재 큐에서 가장 마지막에 저장된 시간
	data : [],
	input : function(d) {// 큐에 데이터를 집어넣는 함수
		
		this.data = this.data.concat(d);
		this.startTime = this.data[0][0].FRAME_TS;
		this.endTime = this.data[this.data.length - 1][0].FRAME_TS;
		//alert("data : " + this.data.length);
		if (this.data.length >= 1000) {// 이미 큐에 1000개의 데이터가 있는 경우
			//alert("input stop!");
			clearInterval(timerRequest);// 리퀘스트 중지
		}

		loadingState.select("rect").attr("x",(this.startTime-107530)*$("#slider").width()/40000).attr("width",(this.endTime-this.startTime)*$("#slider").width()/35000);
		
	},
	print : function() {// 현재 큐의 내용물을 모두 출력하는 함수. 테스트용으로만 사용
		console.log(this.data);
	},
	clear : function() {// 큐를 비우는 함수
		this.data = [];
	},

	half_clear : function() {
		//alert("half clear!");
		for (var i = 0; i < 500; i++) this.data.shift();
		this.startTime = this.data[0][0].FRAME_TS;
		this.endTime = this.data[this.data.length - 1][0].FRAME_TS;

	},

	returnData : function(time) {// 큐 안쪽에 시간에 해당되는 데이터가 있는지 없는지 확인하고 있으면 그 시간데의 데이터를 모두 리턴하는 함수
		if (this.startTime <= time && time <= this.endTime) {
			if (500 < time - this.startTime && this.data.length >= 1000) {// 만일 요구하는 시간이  절반 이상에 위치하고 큐가 꽉 찼을 경우 절반을 비우고 새롭게 데이터를 받기 시작.
				this.half_clear();
				
				var index = serachTimetable(this.endTime)+1;
				
				data_reqeust(index);
				timerRequest = setInterval(function() {//새로운 리퀘스트 요청
					$("#datarequest").text("request times : " + index);

					data_reqeust(++index);
					
				}, 5000);
			}
			return this.data[time - this.startTime];
		} else {// 범위 밖의 데이터를 요구하는 경우
			
			this.clear();
			clearInterval(timerRequest);//리퀘스트 정지
			
			var index = serachTimetable(time);
			/**/
			data_reqeust(index);
			timerRequest = setInterval(function() {//새로운 리퀘스트 요청
				$("#datarequest").text("request times : " + index);
				data_reqeust(++index);
			}, 5000);
			return this.data[time - this.startTime];
			//return this.data[0];
		}
	}
};

$.get("http://147.47.206.13/meta/time", function(d) { // 시간에 대한 메타데이터를 가져오는 함수. 제일 먼저 실행된다.
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
	
	loadingState = d3.select("body").select("#loading").attr("width", $("#slider").width()).attr("height", 20);
	
	var index = 0;
	data_reqeust(index);
	timerRequest = setInterval(function() {
		$("#datarequest").text("request times : " + index);
							
					console.log(index + "th data");
					console.log(buffer.data[index][3]);
	
		data_reqeust(++index);
	}, 5000);

}).fail(function(){
	alert("fail!!!");
});

function data_reqeust(index) {
	
	//alert(index + "th data request!");
	
	$.get("http://147.47.206.13/data?start_time=" + timeTable[index].START_TIME + "&end_time=" + timeTable[index].END_TIME, function(d) {
		buffer.input(d);
	}).done(function() {
		if ( index == 0) { // 첫호출시
			var width = $("#slider").width();
			
			svg = d3.select("body").select("#main").attr("width", width).attr("height", width * 0.729);
			scaleX = d3.scale.linear().domain(FILED_X).range([30, width * 0.7 * 1.5 - 30]);
			scaleY = d3.scale.linear().domain(FILED_Y).range([30, width * 0.729 * 0.7 - 30]);
			resizefiled();

			timeline = d3.select("body").select("#timeline").attr("width", width).attr("height", 20);
			

			timeline.selectAll("rect").data(goalTime).enter().append("rect").attr("width", 3).attr("height", 10).attr("x", function(d) {
				return scaleTimeline(d);
			}).attr("y", 5).attr("fill", "red").on("click", function() {
				start(Math.round(d3.select(this).attr("x") * PLAYTIME[1] / width));
			});


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
			}).attr("r", 10).attr("id",10)
			.on("click",function(d){
				open_player_window(d.PID);
			});
		}	
	});
}

function slidetime(slideValue) {// 슬라이드의 값을 실제의 시간으로 바꿔주는 함수. 이 함수가 필요한 이유는 전반전과 후반전 사이의 하프타임에서 시간의 공백이 생기기 때문이다.
	return timeTable[parseInt(slideValue / 100)].START_TIME + (slideValue % 100);
}
function serachTimetable(time) {// time을 입력하면 timetable을 조사해서 해당 time이 timetable의 몇번째 index에 위치하는지 index를 리턴한다.
	var low = 0, high = timeTable.length-1, mid=0;
	while(low<=high){
		mid = parseInt((low + high) / 2);
		if(timeTable[mid].START_TIME>time) high = mid - 1;
		else if(time > timeTable[mid].END_TIME) low = mid + 1;
		else return mid;
	}
	return -1;
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
	var time = slideValue;
	clearInterval(timerID);
	//clearInterval(timerRequest);

	ds
	.data(buffer.returnData(slidetime(slideValue)))
	.attr("points", function(d) {
		return lotation(scaleX(d.PX), scaleY(d.PY), theta(d.VX, d.VY));
	})
	.attr("x", function(d){return scaleX(d.PX);})
	.attr("y", function(d){return scaleY(d.PY);})
	.attr("cx", function(d){return scaleX(d.PX);})
	.attr("cy", function(d){return scaleY(d.PY);});
	
	timerID = setInterval(function() {
		$("#currentframe").text("slide value : " + slideValue);
		ds.call(move, ++slideValue);
	}, 100/playSpeed);
};

function move(selection, slideValue) { // 선수,공과 데이터를 연동하여 움직이게 하는 함수
	
	selection
	.data(buffer.returnData(slidetime(slideValue)))
	.transition()
	.duration(100/playSpeed)
	.ease("linear")
	.attr("points", function(d) {
		return lotation(scaleX(d.PX), scaleY(d.PY), theta(d.VX, d.VY));
	})
	.attr("x", function(d){return scaleX(d.PX);})
	.attr("y", function(d){return scaleY(d.PY);})
	.attr("cx", function(d){return scaleX(d.PX);})
	.attr("cy", function(d){return scaleY(d.PY);});
	
	slider.slider("value", slideValue);
	
//	buffer.returnData[slidetime(slideValue)];
	
}

function resizefiled(){ // 경기장 표현
	
	var width = $("#slider").width();
	
	 svg.select("#field1").attr("x",30).attr("y",30)
		.attr("height",width*0.729 - 60).attr("width",5);
		
	 svg.select("#field2").attr("x",30).attr("y",30)
		.attr("height",5).attr("width",width -60);
		
	 svg.select("#field3").attr("x",width-30).attr("y",30)
		.attr("height",width*0.729 - 55).attr("width",5);
	 
	 svg.select("#field4").attr("x",30).attr("y",width*0.729-30)
		.attr("height",5).attr("width",width -60);
		
	 svg.select("#field5").attr("x",width*0.5+10).attr("y",30)
		.attr("height",width*0.729 -60).attr("width",5);
	
	 svg.select("#field0").attr("cx",width*0.5+12.5).attr("cy",width*0.729*0.5).attr("r",width*0.15);
		
}

$(window).resize(function() {
	// 축적 재설정
	
	var width = $("#slider").width();
	
	scaleX = d3.scale.linear().domain(FILED_X).range([30,width*0.7*1.5]);
	scaleY = d3.scale.linear().domain(FILED_Y).range([30,width*0.729*0.7]);
	scaleTimeline = d3.scale.linear().domain(PLAYTIME).range([0, width]);
	resizefiled();
	// 인터페이스 크기 재설정
	timeline = d3.select("body").select("#timeline").attr().attr("width", width).attr("height", 20);
	var svg = d3.select("body").select("#main").attr("width", width).attr("height", width*0.729);
	
	timeline.selectAll("rect").data(goalTime).attr("width", 3).attr("height", 10).attr("x", function(d) {
		return scaleTimeline(d);
	}).attr("y", 10).attr("fill", "red");
}); 

function open_player_window(id) {
	var newwindow = window.open("newwindow.html");
	newwindow.id = id;
	newwindow.timeTable=timeTable;
}
var playState = true; //실행여부 ture면 실행, false면 일시정지
playButton.click(function() {
	$(this).attr("value", function() {
		if (playState) {
			playState=false;
			start(0);
			return "stop";
		} else
		clearInterval(timerID);
			playState=true;
			return "play";
	});
});
increasePlaySpeedButton.click(function() {
	if (playSpeed <= 2) playSpeed = playSpeed + 0.1;
	$("#playspeed").text(parseInt(playSpeed*100) + "%");
}); 
decreasePlaySpeedButton.click(function() {
	if (playSpeed > 0.6) playSpeed = playSpeed - 0.1;
	$("#playspeed").text(parseInt(playSpeed*100) + "%");
}); 
