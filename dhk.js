var lotation = function(x,y,theta){ // 선수들의 위치정보 + 각도를 바탕으로 표현해야할 폴리곤의 좌표값을 반환
	var r = 10; // 선수들을 표현할 크기
	return (x+2*r*Math.cos(theta)) + "," + (y+2*r*Math.sin(theta)) + " "+ (x+r*Math.cos(theta+90)) + "," + (y+r*Math.sin(theta+90)) + " "+ (x+r*Math.cos(theta-90)) + "," + (y+r*Math.sin(theta-90));
};

var theta = function(vx, vy){ // 두 방향의 속도를 받아서 라디안값으로 반환
	return Math.atan(vy/vx);
};
//1. 초기 데이터 셋
var data = [];

//test data
for(var i = 0; i < 1000; i++){
	data.push([]);
	
	for(var j =0; j< 15; j++){
		data[i].push(
			{
				x : Math.random()*700,
				y : Math.random()*700,
				vx : Math.random()-0.5,
				vy : Math.random()-0.5
			});
	}
	
	data[i].push(
		{
			x : Math.random()*700,
			y : Math.random()*700,
	});
}

var svg = d3.select("body").select("svg").attr("width", 1000).attr("height", 1000);

var ds = svg.selectAll(".test")
			.data(data[0])
			.attr("points", function(d) {
				return lotation(d.x, d.y, theta(d.vx, d.vy));
			})
			.attr("x", function(d){return d.x;})
			.attr("y", function(d){return d.y;})
			.attr("width", 10)
			.attr("height", 25)
			.attr("cx", function(d){return d.x;})
			.attr("cy", function(d){return d.y;})
			.attr("r",10)
			.attr("fill",function(d,i){
				if(i<7) return "blue";
				else if(i==7) return "yellow";
				else if(i<15) return "red";
				else return "green";
			});

function move(selection, time) {
	selection
	.data(data[time])
	.transition()
	.duration(1000)
	.ease("linear")
	.attr("points", function(d) {
		return lotation(d.x, d.y, theta(d.vx, d.vy));
	})
	.attr("x", function(d){return d.x;})
	.attr("y", function(d){return d.y;})
	.attr("cx", function(d){return d.x;})
	.attr("cy", function(d){return d.y;});
}

var moving = true;
var timerID;
var timer_request;

d3.select("body").on("click", function() {
	
	clearInterval(timer_request);
	
	if (moving) {
		var count = prompt('time : ');
		timerID = setInterval(request(count), 500);
		moving = false;
		timer_request = setInterval(function() {
			ds.call(move, ++count);
		}, 1000);
	} else {
		//ealert("stop!");
		clearInterval(timerID);
		moving = true;
	}
});

function request(time){ // 서버로부터 데이터를 받아오는 메소드 
	
	
}


/*
$.get("kdb.snu.ac.kr:4730/data?start_time=107530&end_time=107560", function(data){
	alert("!");
}).done(function() {
    alert( "second success" );
  })
  .fail(function(jqxhr, textStatus, error) {
    alert( textStatus);
    console.log( error);
  })
  .always(function() {
    alert( "finished" );
  });

$.each([5,6,7,8,9],function(i,d){
	alert(i + " : "+d);
});

var data = [ 
 {"Id": 10004, "PageName": "club"}, 
 {"Id": 10040, "PageName": "qaz"}, 
 {"Id": 10059, "PageName": "jjjjjjj"}
];

$.get("http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D%27WRC%27&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback", function(data) {
    alert(""+data);
});

$.ajax({
    url : "kdb.snu.ac.kr:4730/data?start_time=107530&end_time=107560",
    data : "id=user",
    dataType : "jsonp",
    jsonp : "callback",
    success: function() {
        alert("!");
    }
});
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
