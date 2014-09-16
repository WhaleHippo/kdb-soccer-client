// Run distance
var fnGenRunDistanceConfigLayer1 = function (input) {	
	return {
	    data: {
	        // iris data from R
	        columns: input,
	        type : 'pie',
	        onclick: function (d, i) {
	        	distance_Layer=2;
	        	if(d.index==0){ // A팀 클릭
	        		stack_run_distance.push(config1_run_distance);
	        		$.get("http://147.47.206.13:4730/analysis/run_distance_team?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&team=%27A%27",function(data){
	        			config2_run_distance = fnGenRunDistanceConfigLayer2(
								[ ['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM] ], 
		        			    ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb', 'Erik Engelhardt', 'Sandro Schneider']
						);
	        			c3.generate(config2_run_distance);
	        		});
	        		
	        	}
	        	else if(d.index==1){ // B팀 클릭
	        		stack_run_distance.push(config1_run_distance);
	        		
	        		$.get("http://147.47.206.13:4730/analysis/run_distance_team?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&team=%27B%27",function(data){
	        			config2_run_distance = fnGenRunDistanceConfigLayer2(
								[ ['distance', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM] ], 
		        			    ['Leon Krapf', 'Kevin Baer', 'Luca Ziegler', 'Ben Mueller', 'Vale Reitstetter', 'Christopher Lee', 'Leon Heinze', 'Leo Langhans']
						);
	        			c3.generate(config2_run_distance);
	        		});
	        		
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
	        	distance_Layer=3;
	        	console.log("Bar clicked");
	        	
	        	$.get("http://147.47.206.13/analysis/run_distance_individual?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&name="+(d.index+1),function(data){
	        		stack_run_distance.push(config1_run_distance); // 전 화면 호출을 위해서 남겨둔 것
	        		config3_run_distance = fnGenRunDistanceConfigLayer3( function() { 
		        		return [ 
		        					['x', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
		        					['data1', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM, data[8].SUM, data[9].SUM]
							   ];
		        	} ());
		        	
		        	chart3_distance = c3.generate(config3_run_distance);
	        	});
	        	setInterval(function(){
	        		$.get("http://147.47.206.13/analysis/run_distance_individual?start_time=107530&end_time="+slidetime(slider.slider("value"))+"&name="+(d.index+1),function(data){
		        		chart3_distance.load({
		        			columns: [
		        				['data1', data[0].SUM, data[1].SUM, data[2].SUM, data[3].SUM, data[4].SUM, data[5].SUM, data[6].SUM, data[7].SUM, data[8].SUM, data[9].SUM]
		        			]
		        			}
		        		);
		        	});
	        	},10000);
	        	
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
var stack_run_distance = [];
var chart1_distance = c3.generate(config1_run_distance);
var chart2_distance;
var chart3_distance;
var distance_Layer = 1;
$("#backbutton-run-distance").click(function () {
	/*
	var prev_config = stack_run_distance.pop();
	console.log("Run distance backbutton clicked ");
	if(undefined != prev_config) {
		c3.generate(prev_config);
		config1_run_distance = prev_config;
		//console.log("Run distance chart should change ");
	}*/
	if(distance_Layer==3){
		c3.generate(config2_run_distance);
		distance_Layer=2;
	}
	else if(distance_Layer==2){
		chart1_distance = c3.generate(config1_run_distance);
		distance_Layer=1;
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
	}
});

$("#chart-run-distance").click(function(){
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
});

// Possession
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
$("#chart-possession").click(function () {
	
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

});

// Pass
var fnGenPassConfigLayer1 = function (input) {	
	return {
	    data: {
	        // iris data from R
	        columns: input,
	        type : 'bar',
	        onclick: function (d, i) {
	        	console.log(d);
	        	stack_pass.push(config_pass);
	        	config_pass = fnGenPassConfigLayer2(
							[ ['Pass success rate', 30, 200, 100, 400, 150, 250] ], 
	        			    ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb']
				);
	        	chart_pass = c3.generate(config_pass);
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
	        	stack_pass.push(config_pass);
	        	config_pass = fnGenPassToConfigLayer3( [ ['Pass success rate', 30, 200, 100, 400, 150, 250] ], 
	        			    						   ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb']
				);
	        	chart_pass = c3.generate(config_pass);
	        	
	        	config_pass = fnGenPassDistanceConfigLayer3( [ ['Pass success rate', 30, 200, 100] ], 
	        			    								 ['Short', 'Middle', 'Long']
	        	);
	        	chart_pass2 = c3.generate(config_pass);
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

var config_pass = fnGenPassConfigLayer1([ ['team A', 120], ['team B', 300] ]);
var stack_pass = [];
var chart_pass = c3.generate(config_pass), chart_pass2 = null;
$("#backbutton-pass").click(function () {
	chart_pass.destroy();
	if(null != chart_pass2) {
		chart_pass2.destroy();
		chart_pass2 = null;
	}
	var prev_config = stack_pass.pop();
	console.log("Pass backbutton clicked ");
	if(undefined != prev_config) {
		c3.generate(prev_config);
		config_pass = prev_config;
	}
});
$("#chart-pass").click(function(d){
	$.get("http://147.47.206.13/analysis/pass/team?start_time=107530&end_time=" + slidetime(slider.slider("value")), function(d) {
		for (var i = 0; i < d.length; i++) {
			if (d[i].TEAM == "A") {
				chart_pass.load({
					columns: [
			            ['team A', d[i].NUM],
			        ]
				});
			} else if (d[i].TEAM == "B") {
				chart_pass.load({
					columns: [
			            ['team B', d[i].NUM],
			        ]
				});
			}
		}
	}); 
});



var heatMapRate = 5;
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
		});
    
});

