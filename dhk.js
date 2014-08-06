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
