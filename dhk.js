
var lotation = function(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10 // 선수들을 표현할 크기
	return (x+2*r*Math.cos(theta)) + "," + (y+2*r*Math.sin(theta)) + " "+ (x+r*Math.cos(theta+90)) + "," + (y+r*Math.sin(theta+90)) + " "+ (x+r*Math.cos(theta-90)) + "," + (y+r*Math.sin(theta-90))
}

var theta = function(vx, vy){ // 두 방향의 속도를 받아서 라디안값으로 반환
	return Math.atan(vy/vx)
}

//data
var player_data = [];
var ball_data = [];

//test data
for(var i = 0; i < 15; i++) {
	player_data.push([i*0.07, (Math.random() * 500), (Math.random() * 500), (Math.random()) * 360]);
}
ball_data.push([(Math.random() * 500), (Math.random() * 500)]);



var svg = d3.select("body").append("svg").attr("width", 700).attr("height", 700)

var player = svg.selectAll("polygon")
				.data(player_data)
				.enter()
				.append("polygon")
				.attr("points", function(d){
					return lotation(d[1],d[2],d[3])
				})
				.attr("fill", function(d){ // 선수들의 팀에 따라 색상을 다르게 지정하는 부분
					if(d[0]<0.5) return "blue"
					else return "red"
				});

var ball  =  svg.selectAll("circle")
				.data(ball_data)
				.enter()
				.append("circle")
				.attr("cx",function(d){return d[0]})
				.attr("cy",function(d){return d[1]})
				.attr("r",10)
				.attr("fill","green");
				
var player_info  = d3.select("body").append("p").text("123")
var ball_info  = d3.select("body").append("p").text("123")
var count1 = 0;
var count2 = 0; 

var tatal_info  = d3.select("body").append("p").text("123")


function move_player(selection) {
	
	count1++
	
	for (var k = 0; k < 15; k++){
		player_data[k][1] = (Math.random() - 0) * 500
		player_data[k][2] = (Math.random() - 0) * 500
		player_data[k][3] = player_data[k][3] + (Math.random() - 0) * Math.PI / 100
	}
	
	selection
	.data(player_data)
	.transition()
	.duration(50)
	.ease("linear")
	.attr("points", function(d){
		return lotation(d[1],d[2],d[3])
	})
	.each("end", function() {
		count1 = count1
		player_info.text("player : "+count1)
		tatal_info.text("total : "+(count1-count2))
		selection.call(move_player);
	})
}

function move_ball(selection) {
	
	count2 = count2 + 15
	
	ball_data[0][0] = (Math.random() - 0) * 500
	ball_data[0][1] = (Math.random() - 0) * 500
	
	selection
	.data(ball_data)
	.transition()
	.duration(50)
	.delay(10)
	.ease("linear")
	.attr("cx", function(d){return d[0]})
    .attr("cy", function(d){return d[1]})
	.each("end", function() {
		ball_info.text("ball : "+count2)
		selection.call(move_ball);
	})
}

d3.select("body").on("click", function(){
	ball.call(move_ball)
	player.call(move_player)
	
})
