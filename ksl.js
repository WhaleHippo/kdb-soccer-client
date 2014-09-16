// Run distance
var fnGenRunDistanceConfigLayer1 = function (input) {	
	return {
	    data: {
	        // iris data from R
	        columns: input,
	        type : 'pie',
	        onclick: function (d, i) {
	        	clearInterval(timerDistance);
	        	distance_Layer=2;
	        	if(d.index==0){ // A팀 클릭
	        		$.get("http://147.47.206.13:4730/analysis/run_distance_team?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&team=%27A%27",function(data){
	        			config2_run_distance = fnGenRunDistanceConfigLayer2(
								[ ['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM] ], 
		        			    ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb', 'Erik Engelhardt', 'Sandro Schneider']
						);
	        			chart2_distance = c3.generate(config2_run_distance);
	        		});
	        		timerDistance = setInterval(function(){
		        		$.get("http://147.47.206.13:4730/analysis/run_distance_team?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&team=%27A%27",function(data){
		        			chart2_distance.load({
		        				columns: [
			        				['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM] 
			        			]
		        			});
		        		});
	        		},10000);
	        	}
	        	else if(d.index==1){ // B팀 클릭
	        		
	        		$.get("http://147.47.206.13:4730/analysis/run_distance_team?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&team=%27B%27",function(data){
	        			config2_run_distance = fnGenRunDistanceConfigLayer2(
								[ ['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM] ], 
		        			    ['Leon Krapf', 'Kevin Baer', 'Luca Ziegler', 'Ben Mueller', 'Vale Reitstetter', 'Christopher Lee', 'Leon Heinze', 'Leo Langhans']
						);
	        			chart2_distance = c3.generate(config2_run_distance);
	        		});
	        		timerDistance = setInterval(function(){
		        		$.get("http://147.47.206.13:4730/analysis/run_distance_team?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&team=%27B%27",function(data){
		        			chart2_distance.load({
		        				columns: [
			        				['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM] 
			        			]
		        			});
		        		});
	        		},10000);
	        		
	        	}
			}
	    },
	    bindto: "#chart-run-distance"
	};
};

var fnGenRunDistanceConfigLayer2 = function (dats, cats) {	
	return {
	    data: {
	        columns: dats,
	        type: 'bar',
	        onclick: function (d, i) {
	        	clearInterval(timerDistance);
	        	distance_Layer=3;
	        	console.log("Bar clicked");
	        	
	        	$.get("http://147.47.206.13/analysis/run_distance_individual?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&name="+(d.index+1),function(data){
	        		config3_run_distance = fnGenRunDistanceConfigLayer3( function() { 
		        		return [ 
		        					['x', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
		        					['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM, data[8].SUM, data[9].SUM]
							   ];
		        	} ());
		        	
		        	chart3_distance = c3.generate(config3_run_distance);
	        	});
	        	
	        	timerDistance = setInterval(function(){
	        		$.get("http://147.47.206.13/analysis/run_distance_individual?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&name="+(d.index+1),function(data){
		        		chart3_distance.load({
		        			columns: [
			        				['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM, data[8].SUM, data[9].SUM]
			        			]
		        			}
		        		);
		        	});
	        	}, 10000);
	        	
	        }
	    },
	    bar: {
	        width: {
	            ratio: 0.5 // this makes bar width 50% of length between ticks
	        }
	    },
	    bindto: "#chart-run-distance",
	    axis: { 
	    	rotated: true,
	    	x: {
	    		type: 'category',
	    		categories: cats
	    	}
	    }
	};
};

var fnGenRunDistanceConfigLayer3 = function (input) {	
	return {
		    data: {
		    	x: 'x',
		        columns: input
		    },
		    axis: {
		    	x: {
		    		type: 'category',
		    	}
		    },
		    bar: {
		        width: {
		            ratio: 0.2 // this makes bar width 50% of length between ticks
		        }
		    },
    		bindto: "#chart-run-distance"
		};
};

var config1_run_distance = fnGenRunDistanceConfigLayer1([ ['teamA', 1], ['teamB', 1] ]);
var config2_run_distance;
var config3_run_distance;
var chart1_distance = c3.generate(config1_run_distance);
var chart2_distance;
var chart3_distance;
var distance_Layer = 1;
$("#backbutton-run-distance").click(function () {
	
	clearInterval(timerDistance);
	
	if(distance_Layer==3){
		chart2_distance=c3.generate(config2_run_distance);
		distance_Layer=2;
	}
	else if(distance_Layer==2){
		chart1_distance = c3.generate(config1_run_distance);
		distance_Layer=1;
		playDistance();
	}
});

function playDistance(){
	$.get("http://147.47.206.13/analysis/run_distance?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
		for (var i = 0; i < d.length; i++) {
			if (d[i].TEAM == "A") {
				chart1_distance.load({
					columns: [
			            ['teamA', d[i].SUM],
			        ]
				});
			} else if (d[i].TEAM == "B") {
				chart1_distance.load({
					columns: [
			            ['teamB', d[i].SUM],
			        ]
				});
			}
		}
	});
	
	timerDistance = setInterval(function(){
		$.get("http://147.47.206.13/analysis/run_distance?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
			for (var i = 0; i < d.length; i++) {
				if (d[i].TEAM == "A") {
					chart1_distance.load({
						columns: [
				            ['teamA', d[i].SUM],
				        ]
					});
				} else if (d[i].TEAM == "B") {
					chart1_distance.load({
						columns: [
				            ['teamB', d[i].SUM],
				        ]
					});
				}
			}
		});		
	}, 10000);
}


// Possession : 완성
var chart_possession = c3.generate({
    data: {
        // iris data from R
        columns: [
            ['teamA', 30],
            ['teamB', 120],
        ],
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", i); }
    },
    bindto: "#chart-possession"
});

function playPossession(){
	$.get("http://147.47.206.13/analysis/possession/team?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
		for (var i = 0; i < d.length; i++) {
			if (d[i].TEAM == "A") {
				chart_possession.load({
					columns: [
			            ['teamA', d[i].POSSESS],
			        ]
				});
			} else if (d[i].TEAM == "B") {
				chart_possession.load({
					columns: [
			            ['teamB', d[i].POSSESS],
			        ]
				});
			}
		}
	}); 

	clearInterval(timerBallPossession);
	timerBallPossession = setInterval(function(){
		$.get("http://147.47.206.13/analysis/possession/team?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
			for (var i = 0; i < d.length; i++) {
				if (d[i].TEAM == "A") {
					chart_possession.load({
						columns: [
				            ['teamA', d[i].POSSESS],
				        ]
					});
				} else if (d[i].TEAM == "B") {
					chart_possession.load({
						columns: [
				            ['teamB', d[i].POSSESS],
				        ]
					});
				}
			}
		}); 
	},10000);
}


// Pass
var fnGenPassConfigLayer1 = function (input) {	
	return {
	    data: {
	        // iris data from R
	        columns: input,
	        type : 'bar',
	        onclick: function (d, i) {
	        	clearInterval(timerPass);
	        	pass_Layer=2;
	        	console.log(d);
	        	if(d.name == "team A"){
	        		$.get("http://147.47.206.13/analysis/pass/individual?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){
	        			config2_pass = fnGenPassConfigLayer2(
							[ ['Pass success rate', d[1].NUM, d[3].NUM, d[5].NUM, d[7].NUM, d[9].NUM, d[11].NUM, d[13].NUM, d[15].NUM] ], 
	        			    ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb', 'Erik Engelhardt', 'Sandro Schneider']
						);
						chart2_pass = c3.generate(config2_pass);
	        		});
	        		timerPass = setInterval(function(){
	        			$.get("http://147.47.206.13/analysis/pass/individual?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){
							chart2_pass.load({
								columns: [
						            ['Pass success rate', d[1].NUM, d[3].NUM, d[5].NUM, d[7].NUM, d[9].NUM, d[11].NUM, d[13].NUM, d[15].NUM],
						        ]
							});

		        		});
	        		},5000);
	        	}
	        	else if(d.name = "team B"){
	        		$.get("http://147.47.206.13/analysis/pass/individual?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){
	        			config2_pass = fnGenPassConfigLayer2(
							[ ['Pass success rate', d[1].NUM, d[3].NUM, d[5].NUM, d[7].NUM, d[9].NUM, d[11].NUM, d[13].NUM, d[15].NUM] ], 
	        			    ['Leon Krapf', 'Kevin Baer', 'Luca Ziegler', 'Ben Mueller', 'Vale Reitstetter', 'Christopher Lee', 'Leon Heinze', 'Leo Langhans']
						);
						chart2_pass = c3.generate(config2_pass);
	        		});
	        		timerPass = setInterval(function(){
	        			$.get("http://147.47.206.13/analysis/pass/individual?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){
							chart2_pass.load({
								columns: [
						            ['Pass success rate', d[1].NUM, d[3].NUM, d[5].NUM, d[7].NUM, d[9].NUM, d[11].NUM, d[13].NUM, d[15].NUM],
						        ]
							});

		        		});
	        		},5000);
	        	}
			}
	    },
	    bindto: "#chart-pass"
	};
};

var fnGenPassConfigLayer2 = function (dats, cats) {	
	return {
	    data: {
	        columns: dats,
	        type: 'bar',
	        onclick: function (d, i) {
	        	clearInterval(timerPass);
	        	pass_Layer=3;
	        	config3_pass = fnGenPassToConfigLayer3( [ ['Pass success rate', 30, 200, 100, 400, 150, 250] ], 
	        			    						   ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb']
				);
	        	chart3_pass = c3.generate(config3_pass);
	        	
	        	config4_pass = fnGenPassDistanceConfigLayer3( [ ['Pass success rate', 30, 200, 100] ], 
	        			    								 ['Short', 'Middle', 'Long']
	        	);
	        	chart4_pass = c3.generate(config4_pass);
	        }
	    },
	    bar: {
	        width: {
	            ratio: 0.5 // this makes bar width 50% of length between ticks
	        }
	    },
	    bindto: "#chart-pass",
	    axis: { 
	    	rotated: true,
	    	x: {
	    		type: 'category',
	    		categories: cats
	    	}
	    }
	};
};

var fnGenPassDistanceConfigLayer3 = function (dats, cats) {	
	return {
		size: {
	        height: 200,
	        width: 400
    	},
	    data: {
	        columns: dats,
	        type: 'bar'
	    },
	    bar: {
	        width: {
	            ratio: 0.5 // this makes bar width 50% of length between ticks
	        }
	    },
	    bindto: "#chart-pass",
	    axis: { 
	    	rotated: true,
	    	x: {
	    		type: 'category',
	    		categories: cats
	    	}
	    }
	};
};

var fnGenPassToConfigLayer3 = function (dats, cats) {	
	return {
		size: {
	        height: 200,
	        width: 400
    	},
	    data: {
	        columns: dats,
	        type: 'bar'
	    },
	    bar: {
	        width: {
	            ratio: 0.5 // this makes bar width 50% of length between ticks
	        }
	    },
	    bindto: "#chart-pass2",
	    axis: { 
	    	rotated: true,
	    	x: {
	    		type: 'category',
	    		categories: cats
	    	}
	    }
	};
};

var config1_pass = fnGenPassConfigLayer1([ ['team A', 0], ['team B', 0] ]);
var config2_pass;
var config3_pass;
var config4_pass;
var chart1_pass = c3.generate(config1_pass);
var chart2_pass;
var chart3_pass;
var chart4_pass = null;
var pass_Layer = 1;
$("#backbutton-pass").click(function () {
	
	clearInterval(timerPass);
	
	if(pass_Layer==3){
		c3.generate(config2_pass);
		chart3_pass.destroy();
		pass_Layer=2;
		chart1_pass = c3.generate(config1_pass);
		playPass();
	}
	if(pass_Layer==2){
		c3.generate(config1_pass);
		pass_Layer=1;
		chart1_pass = c3.generate(config1_pass);
		playPass();
	}
});
function playPass(){
	$.get("http://147.47.206.13/analysis/pass/team?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
		for (var i = 0; i < d.length; i++) {
			if (d[i].TEAM == "A") {
				chart1_pass.load({
					columns: [
			            ['team A', d[i].NUM],
			        ]
				});
			} else if (d[i].TEAM == "B") {
				chart1_pass.load({
					columns: [
			            ['team B', d[i].NUM],
			        ]
				});
			}
		}
	});
	timerPass=setInterval(function(){
		$.get("http://147.47.206.13/analysis/pass/team?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
			for (var i = 0; i < d.length; i++) {
				if (d[i].TEAM == "A") {
					chart1_pass.load({
						columns: [
				            ['team A', d[i].NUM],
				        ]
					});
				} else if (d[i].TEAM == "B") {
					chart1_pass.load({
						columns: [
				            ['team B', d[i].NUM],
				        ]
					});
				}
			}
		});
	},10000);
}



var heatMapId = 0;
var heatMapSize = 3;
var previous = null;
$('.list-group-item').on('click',function(e){
    /*var previous = $(this).closest(".list-group").children().children(".list-group-item");
    previous.removeClass('active'); // previous list-item
    previous = $(this).parent().children(".active");
    previous.removeClass('active'); // previous list-item*/
    if(null != previous) {
    	previous.removeClass('active');
    }
    
    $(e.target).addClass('active'); // activated list-item
    previous = $(e.target);
});

$('.list-group-item').on('click',function(e){
    alert($(this).text());
    /*
    $.get("http://147.47.206.13/analysis/heatmap/total?start_time=107530&end_time=" + slidetime(slider.slider("value")),function(d){	
			var i;
			for ( i = 0; i < 61*40; i++) { // 15855 = 105*151
				heatMapData[i] = d3.rgb(0, 255, 0);
			}

			for ( i = 0; i < d.length; i++) {
				if (d[i].CELL_Y != null && d[i].CELL_X != null && d[i].CELL_Y > -1) {
					heatMapData[61 * d[i].CELL_Y + d[i].CELL_X + 30] = d3.rgb(0.5*d[i].TIME * d[i].TIME, 255 - 0.5*d[i].TIME * d[i].TIME, 0);
				}
			}
			
			d3.select("#heatmap").selectAll("rect").data(heatMapData)
			.transition()
			.attr("fill", function(d) {
				return d;
			}).attr("x", function(d, i) {
				return (i % 61) * $("#heatmap").width()/61;
			}).attr("y", function(d, i) {
				return parseInt(i / 61) * $("#heatmap").height()/40;
			}).attr("height", $("#heatmap").height()/40).attr("width", $("#heatmap").width()/61);
	});*/
	loadHeatmap();
    
});

$("#heatmap-button-smaller").on('click',function(){
	if(heatMapSize<5) heatMapSize++;
});
$("#heatmap-button-bigger").on('click',function(){
	if(heatMapSize>1) heatMapSize--;
});

function loadHeatmap(){
	heatMapX = [0, 75, 50, 37, 19, 7];
	heatMapY = [0, 100, 75, 50, 25, 10];
    $.get("http://147.47.206.13/analysis/heatmap/total?start_time=107530&end_time=" + slidetime(slider.slider("value"))+"&level="+heatMapSize,function(d){	
			var i;
			heatMapData = [];
			for ( i = 0; i < (2*heatMapX[heatMapSize]+1)*heatMapY[heatMapSize]; i++) { // 15855 = 105*151
				heatMapData.push(d3.rgb(0,255,0));
			}

			for ( i = 0; i < d.length; i++) {
				if (d[i].CELL_Y != null && d[i].CELL_X != null && d[i].CELL_Y > -1) {
					heatMapData[(2*heatMapX[heatMapSize]+1) * d[i].CELL_Y + d[i].CELL_X + heatMapX[heatMapSize]] = d3.rgb(d[i].TIME * d[i].TIME, 255 - d[i].TIME * d[i].TIME, 0);
				}
			}
			
			d3.select("#heatmap").selectAll("rect").data(heatMapData)
			.transition()
			.attr("fill", function(d) {
				return d;
			}).attr("x", function(d, i) {
				return (i % (2*heatMapX[heatMapSize]+1)) * $("#heatmap").width()/(2*heatMapX[heatMapSize]+1);
			}).attr("y", function(d, i) {
				return parseInt(i / (2*heatMapX[heatMapSize]+1)) * $("#heatmap").height()/heatMapY[heatMapSize];
			}).attr("height", $("#heatmap").height()/heatMapY[heatMapSize]).attr("width", $("#heatmap").width()/(2*heatMapX[heatMapSize]+1));
	});
}
