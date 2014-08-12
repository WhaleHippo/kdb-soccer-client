var a;

$("#playerid").text("id : " + a);
/*
if(a==123){
	alert("123?");
}
else if(a==3){
	alert("wek");
}
else{
	alert("go away");
}
*/
var data=[];
for(var i=0;i<100;i++){
	data.push(Math.random()*100);
}

var slider = $("#slider").slider({
	orientation: "horizontal",
	min : 0,
	max : 100,
	step : 1,
	range : true,
	values : [0,100],
	slide : function(e,ui){change(ui);}
});

var svg = d3.select("body").select("#playerstate").attr("width", $("#slider").width()).attr("height", 100);
svg.selectAll("circle").data(data)
				.enter()
				.append("circle")
				.attr("r", 4)
				.attr("cy", function(d) {return 100-d;})
				.attr("cx",function(d,i){return $("#slider").width()*i/100;});
				


function change(ui) {
	var changeData=[];
	for(var i =0;i<100;i++){
		if(ui.values[0]<i&&i<ui.values[1]){
			changeData.push(data[i]);
		}
		else changeData[i]=-10;
	}
	svg.selectAll("circle").data(changeData)
				.attr("r", 4)
				.attr("cy", function(d) {return 100-d;})
				.attr("cx",function(d,i){return $("#slider").width()*i/100;});

	//svg.selectAll("circle").exit().remove();
}