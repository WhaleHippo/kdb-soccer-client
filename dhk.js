
/* 방법 1 : 공과 선수들의 데이터를 분리해서 사용
var lotation = function(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10; // 선수들을 표현할 크기
	return (x+2*r*Math.cos(theta)) + "," + (y+2*r*Math.sin(theta)) + " "+ (x+r*Math.cos(theta+90)) + "," + (y+r*Math.sin(theta+90)) + " "+ (x+r*Math.cos(theta-90)) + "," + (y+r*Math.sin(theta-90));
};

var theta = function(vx, vy){ // 두 방향의 속도를 받아서 라디안값으로 반환
	return Math.atan(vy/vx);
};


//1. 초기 데이터 셋
var player_data = [];
var ball_data = [];

//test data
for(var i = 0; i < 1000; i++){
	player_data.push([]);
	for(var j =0; j< 15; j++){
		player_data[i].push(
			{
				type : j-7,
				x : (i+1)*(j+1),
				y : (i+1)*(j+1)+30,
				vx : Math.random()-0.5,
				vy : Math.random()-0.5
			});
	}
	
	ball_data.push([
		{
			x : Math.random()*700,
			y : Math.random()*700
		}
		]
	);
	
}
alert(player_data[2][1].x);
alert(ball_data[3][0].y);

var svg = d3.select("body").append("svg").attr("width", 700).attr("height", 700);

var ball  =  svg.selectAll("circle")
				.data(ball_data[0])
				.enter()
				.append("circle")
				.attr("cx",function(d){return d.x})
				.attr("cy",function(d){return d.y})
				.attr("r",10)
				.attr("fill","green");
				
				
var player = svg.selectAll("polygon")
				.data(player_data[0])
				.enter()
				.append("polygon")
				.attr("points", function(d){
					return lotation(d.x, d.y, theta(d.vx, d.vy));
				})
				.attr("fill", function(d){ // 선수들의 팀에 따라 색상을 다르게 지정하는 부분
					if(d.type<0) return "blue";
					else if(d.type==0) return "yellow";
					else return "red";
				});

function move_player(selection, time) {
	
	selection
	.data(player_data[time])
	.transition()
	.duration(100)
	.ease("linear")
	.attr("points", function(d){
		return lotation(d.x, d.y, theta(d.vx, d.vy));
	})
	.each("end", function() {
		selection.call(move_player, time+1);
	});
}

function move_ball(selection, time){
	
	selection
	.data(ball_data[time])
	.transition()
	.duration(100)
	.delay(10)
	.ease("linear")
	.attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y})
	.each("end", function() {
		selection.call(move_ball, time+1);
	});
}

d3.select("body").on("click", function(){
	ball.call(move_ball,1);
	player.call(move_player,1);
});*/


function lotation(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10; // 선수들을 표현할 크기
	return (x+2*r*Math.cos(theta)) + "," + (y+2*r*Math.sin(theta)) + " " + (x+r*Math.cos(theta+90)) + "," + (y+r*Math.sin(theta+90)) + " "+ (x+r*Math.cos(theta-90)) + "," + (y+r*Math.sin(theta-90));
};

function theta(vx, vy){ // 두 방향의 속도를 받아서 라디안값으로 반환
	return Math.atan(vy/vx);
};

function ball_lotation(x,y)
{
	r=10;
	return  (x-r) + "," + (y) + " " +
			(x-0.5*r) + "," + (y+0.5*r*Math.sqrt(3)) + " " +
			(x+0.5*r) + "," + (y+0.5*r*Math.sqrt(3)) + " " +
			(x+r) + "," + (y) + " " +
			(x+0.5*r) + "," + (y-0.5*r*Math.sqrt(3)) + " " +
			(x-0.5*r) + "," + (y-0.5*r*Math.sqrt(3)) + " ";
}

function goalkeeper_lotation(x,y)
{
	d=5; // 골키퍼 두께
	l=13; // 골키퍼 길이
	return  (x-d) + "," + (y+l) + " " +
			(x+d) + "," + (y+l) + " " +
			(x+d) + "," + (y-l) + " " +
			(x-d) + "," + (y-l) + " ";
}

//1. 초기 데이터 셋
var data = [];

//test data
for(var i = 0; i < 1000; i++){
	data.push([]);
	for(var j =0; j< 15; j++){
		data[i].push(
			{
				type : j-7,
				x : Math.random()*700,
				y : Math.random()*700,
				vx : Math.random()-0.5,
				vy : Math.random()-0.5
			});
	}
	data[i].push(
		{
			type : 'ball',
			x : Math.random()*700,
			y : Math.random()*700
	});
	
}

var svg = d3.select("body").append("svg").attr("width", 700).attr("height", 700);				
				
var polygon = svg.selectAll("polygon")
				.data(data[0])
				.enter()
				.append("polygon")
				.attr("points", function(d){
					if(d.type == 'ball'){
						return ball_lotation(d.x,d.y);
					}
					else if(d.type==7||d.type==-7){
						return goalkeeper_lotation(d.x,d.y);
					}
					else{
					return lotation(d.x, d.y, theta(d.vx, d.vy));
					}
				})
				.attr("fill", function(d){ // 선수들의 팀에 따라 색상을 다르게 지정하는 부분
					if(d.type<0) return "blue";
					else if(d.type==0) return "yellow";
					else if(d.type=='ball') return "green";
					else return "red";
				});

function move(selection, time) {
	
	selection
	.data(data[time])
	.transition()
	.duration(500)
	.ease("linear")
	.attr("points", function(d){
		if (d.type == 'ball') {
			return ball_lotation(d.x, d.y);
		} else if (d.type == 7 || d.type == -7) {
			return goalkeeper_lotation(d.x, d.y);
		} else {
			return lotation(d.x, d.y, theta(d.vx, d.vy));
		}
	})
	.each("end", function() {
		selection.call(move, time+1);
	});
}

d3.select("body").on("click", function(){
	polygon.call(move,1);
});

