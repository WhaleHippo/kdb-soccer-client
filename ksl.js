// Run distance
var fnGenRunDistanceConfigLayer1 = function (input) {	
	return {
	    data: {
	        // iris data from R
	        columns: input,
	        type : 'pie',
	        onclick: function (d, i) {
	        	stack_run_distance.push(config_run_distance);
	        	config_run_distance = fnGenRunDistanceConfigLayer2(
							[ ['distance', 30, 200, 100, 400, 150, 250] ], 
	        			    ['Nick Gertje', 'Dennis Dotterweich', 'Niklas Waezlein', 'Wili Sommer', 'Philipp Harlass', 'Roman Hartleb']
				);
	        	c3.generate(config_run_distance);
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
	        	console.log("Bar clicked");
	        	stack_run_distance.push(config_run_distance);
	        	config_run_distance = fnGenRunDistanceConfigLayer3( function() { 
	        		return [ 
	        					['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
	        					['data1', 30, 200, 100, 400, 150, 250]
						   ];
	        	} ());
	        	c3.generate(config_run_distance);
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
		    		type: 'timeseries',
			    	tick: {
			    		format: '%Y-%m-%d'
			    	} 
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

var config_run_distance = fnGenRunDistanceConfigLayer1([ ['data1', 30], ['data2', 120] ]);
var stack_run_distance = [];
c3.generate(config_run_distance);
$("#backbutton-run-distance").click(function () {
	var prev_config = stack_run_distance.pop();
	console.log("Run distance backbutton clicked ");
	if(undefined != prev_config) {
		c3.generate(prev_config);
		config_run_distance = prev_config;
		//console.log("Run distance chart should change ");
	}
});

// Possession
var chart_possession = c3.generate({
    data: {
        // iris data from R
        columns: [
            ['data1', 30],
            ['data2', 120],
        ],
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", i); }
    },
    bindto: "#chart-possession"
});


// Pass
var fnGenPassConfigLayer1 = function (input) {	
	return {
	    data: {
	        // iris data from R
	        columns: input,
	        type : 'bar',
	        onclick: function (d, i) {
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

var config_pass = fnGenPassConfigLayer1([ ['data1', 30], ['data2', 120] ]);
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
