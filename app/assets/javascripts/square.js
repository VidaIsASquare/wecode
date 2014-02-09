var chartOptions = {
	color: {
 		"green" : "#007031",
 		"mint" : "#4ED98A",
 		"gold" : "#F2B705",
 		"tomato" : "#F24535"
	}
};

var square = {
	getPaymentTotals:  function() {
		var returning; 

		$.ajax({
			url: "/payment_totals",
		})
		.done(function(response) {
			charts.setupSeries(response);
		})
		.fail(function() {
			console.log("error");
		});

		return returning;
	},
		
	getCookieCount:  function(creator_id) {

		$.ajax({
			url: "/cookie_counts",
			data: {
				creator_id: creator_id || ""
			}
		})
		.done(function(response) {
			charts.setupDrilldowns(creator_id, response);			
		})
		.fail(function() {
			console.log("error");
		});
		
	}, 

	sumByMerchant: function(merchant,transactionAmt){
		if (!collectByIds.hasOwnProperty(merchant)){
			collectByIds[merchant] = transactionAmt;
		}else {
			collectByIds[merchant] += transactionAmt;
		}

		return collectByIds; 
	},
	init: function() {
		// get the data
		square.getPaymentTotals();
		// square.getCookieCount();

		// iterate over it
		// $.each(response, function(){
		// 	var merchant = this["merchant_id"];
		// 	var transactionAmt = this["net_total_money"]["amount"]; 
		// 	square.sumByMerchant(merchant, transactionAmt);
		// });			
	}

}; 

var charts = {
	working: [],
	drilldowns: [],
	count: 0,
	setupSeries: function(data){
		// {F9T1S0T9Q5FBC: 900, Total: 4100, 3KMJ1RAT41ZJT: 1850, 8JGTJR08M53K1: 1350} 
		for (key in data){
			if (key != 'Total'){
				charts.working.push({
					name: key,
					y: data[key]/100,
					drilldown: key.toLowerCase()
				});

				square.getCookieCount(key);
			}
		}
		this.setupDrilldowns(data);
	},
	setupDrilldowns: function(scoutID, data){
		var drilldownSeries = {
			colorByPoint: true,
			colors: [
				chartOptions.color.gold,
				chartOptions.color.green,
				chartOptions.color.mint,
				chartOptions.color.tomato
			],
			data: []
		}

		for (key in data){
			drilldownSeries.id = scoutID.toLowerCase();
			drilldownSeries.data.push([key, data[key]]);
		}
		// console.log(charts.drilldowns);

		charts.drilldowns.push(drilldownSeries);

		charts.count++;

		if (charts.count == charts.working.length){
			this.leaderboard();
		}
		//init the leaderboard
	},
	leaderboard: function() {
		// init the leaderboard 
		var labels = ['Jane', 'Mary', 'Alice'];
		var series = [{
					name: 'total sales made',
					color: chartOptions.color.mint,
					data: charts.working
				}];


		var leaderchart = new Highcharts.Chart({
			chart: {
				renderTo: 'leaderboard',
				type: 'bar',
				width: $(window).width() * .8,
				spacing: [20,50,20,20]
			},
			legend: {
				enabled:false
			},
	        title: {
	            text: 'Leaderboard'
	        },
	        xAxis: {
	        	type: 'category',
	        	title: {
	        		text: 'Scout'
	        	}
	        },
	        yAxis: {
	            title: {
	                text: 'Sales ($USD)' 
	            }
	        },
	        series: series, 
			drilldown: {
				series: charts.drilldowns
			}
	    });

	// console.log(labels);
	// console.log(datasets);
	},

	init: function() {
		// this.leaderboard();
	}
}

$(document).ready(function(){

	// init that shit! 
	square.init();
	charts.init();

	return {
		charts:charts,
		square:square
	}

}) // document ready