
// 방법 1 : 공과 선수들의 데이터를 분리해서 사용
var lotation = function(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10; // 선수들을 표현할 크기
	return (x+2*r*Math.cos(theta)) + "," + (y+2*r*Math.sin(theta)) + " "+ (x+r*Math.cos(theta+90)) + "," + (y+r*Math.sin(theta+90)) + " "+ (x+r*Math.cos(theta-90)) + "," + (y+r*Math.sin(theta-90));
};

var theta = function(vx, vy){ // 두 방향의 속도를 받아서 라디안값으로 반환
	return Math.atan(vy/vx);
};

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
var player_data = [];
var ball_data = [];
var goalkeeper_data = [];

//test data
for(var i = 0; i < 1500; i++){
	player_data.push([]);
	goalkeeper_data.push([]);
	for(var j =0; j< 15; j++){
		player_data[i].push(
			{
			x : Math.random() * 700,
			y : Math.random() * 700,
			vx : Math.random() - 0.5,
			vy : Math.random() - 0.5
			}
		);
	}
	for(var j = 0; j<2;j++){
		goalkeeper_data[i].push(
			{
			x : Math.random() * 700,
			y : Math.random() * 700,
			vx : Math.random() - 0.5,
			vy : Math.random() - 0.5
			}
		); 
	}
	
	ball_data.push([{
		x : Math.random() * 700,
		y : Math.random() * 700
	}]); 

	
}


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
				.attr("fill", function(d,i){ // 선수들의 팀에 따라 색상을 다르게 지정하는 부분
					if(i<7) return "blue";
					else if(i==7) return "yellow";
					else return "red";
				});
				
var goalkeeper = svg.selectAll("rect")
					.data(goalkeeper_data[0])
					.enter()
					.append("rect")
					.attr("width", 10)
					.attr("height", 25)
					.attr("x", function(d){return d.x-5;})
					.attr("y", function(d){return d.y-12.5;})
					.attr("fill", function(d,i){
						if(i==0) return "blue";
						else return "red";
					});

function move_player(selection, time) {
	
	selection
	.data(player_data[time])
	.transition()
	.duration(1000)
	.ease("linear")
	.attr("points", function(d){
		return lotation(d.x, d.y, theta(d.vx, d.vy));
	});
}

function move_goalkeeper(selection, time){
	
	selection
	.data(goalkeeper_data[time])
	.transition()
	.duration(1000)
	.ease("linear")
	.attr("x", function(d){return d.x})
	.attr("y", function(d){return d.y});
	
}

function move_ball(selection, time){
	
	selection
	.data(ball_data[time])
	.transition()
	.duration(1000)
	.ease("linear")
	.attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y});
}

var moving = true;
var timerID;
d3.select("body").on("click", function() {

	if (moving) {
		var count = prompt('time : ');
		moving = false;
		timerID = setInterval(function() {
			ball.call(move_ball, ++count);
			player.call(move_player, count);
			goalkeeper.call(move_goalkeeper, count);
		}, 1000);
	} else {
		alert("stop!")
		clearInterval(timerID);
		moving = true;
	}

});

/*
 var moving = false;

d3.select("body").on("click", function(){
	if(moving){
		clearInterval(timeid);
	}
	
	else{
		timeid = setInterval(move(1),1000);
	}
	
	
});

function move(){
	ball.call(move_ball,time);
	player.call(move_player,time);
	goalkeeper.call(move_goalkeeper,time);
}
*/

/*
function lotation(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10; // 선수들을 표현할 크기
	return (x+3*r*Math.cos(theta)) + "," + (y+3*r*Math.sin(theta)) + " " + (x+r*Math.cos(theta+Math.PI/2)) + "," + (y+r*Math.sin(theta+Math.PI/2)) + " "+ (x+r*Math.cos(theta-Math.PI/2)) + "," + (y+r*Math.sin(theta-Math.PI/2));
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
				vx : j,
				vy : j+i
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
				.attr("points", function(d, i){
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
	.duration(1000)
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
*/
