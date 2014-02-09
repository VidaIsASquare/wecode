var chartOptions = {
	color: {
 		"green" : "#007031",
 		"mint" : "#4ED98A",
 		"gold" : "#F2B705",
 		"tomato" : "#F24535"
	}
};

var collectByIds={};

var square = {
	getData:  function() {
		// Currently hardcoding a response, but this should be hitting the service to get...whatever. 
		var response=[{"id":"A4M1EZVXGW9DT","merchant_id":"1Q5ZG47GZ44T1","creator_id":"1Q5ZG47GZ44T1","created_at":"2014-02-08T19:55:26Z","inclusive_tax_money":{"amount":0,"currency_code":"USD"},"additive_tax_money":{"amount":0,"currency_code":"USD"},"tax_money":{"amount":0,"currency_code":"USD"},"tip_money":{"amount":0,"currency_code":"USD"},"discount_money":{"amount":0,"currency_code":"USD"},"total_collected_money":{"amount":1,"currency_code":"USD"},"processing_fee_money":{"amount":0,"currency_code":"USD"},"net_total_money":{"amount":1,"currency_code":"USD"},"refunded_money":{"amount":0,"currency_code":"USD"},"inclusive_tax":[],"additive_tax":[],"tender":[{"type":"CASH","name":"Cash","total_money":{"amount":1,"currency_code":"USD"},"tendered_money":{"amount":100,"currency_code":"USD"},"change_back_money":{"amount":99,"currency_code":"USD"}}],"refunds":[],"itemizations":[]},{"id":"061N6K29RM0BN","merchant_id":"1Q5ZG47GZ44T1","creator_id":"1Q5ZG47GZ44T1","created_at":"2014-02-08T21:08:12Z","inclusive_tax_money":{"amount":0,"currency_code":"USD"},"additive_tax_money":{"amount":0,"currency_code":"USD"},"tax_money":{"amount":0,"currency_code":"USD"},"tip_money":{"amount":0,"currency_code":"USD"},"discount_money":{"amount":0,"currency_code":"USD"},"total_collected_money":{"amount":500,"currency_code":"USD"},"processing_fee_money":{"amount":0,"currency_code":"USD"},"net_total_money":{"amount":500,"currency_code":"USD"},"refunded_money":{"amount":0,"currency_code":"USD"},"inclusive_tax":[],"additive_tax":[],"tender":[{"type":"CASH","name":"Cash","total_money":{"amount":500,"currency_code":"USD"},"tendered_money":{"amount":500,"currency_code":"USD"}}],"refunds":[],"itemizations":[]}];
		return response; 
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
		var response = square.getData();

		// iterate over it
		$.each(response, function(){
			var merchant = this["merchant_id"];
			var transactionAmt = this["net_total_money"]["amount"]; 
			square.sumByMerchant(merchant, transactionAmt);
		});			
	}

}; 

var charts = {
	setScale: function() {

	},

	// {1Q5ZG47GZ44T1: 501}
	leaderboard: function() {
		// init the leaderboard 
		var labels = ['Jane', 'Mary', 'Alice'];
		var series = [{
					name: 'total boxes sold',
					color: chartOptions.color.mint,
					data: [{
						name: 'Jane', 
						y: 304, 
						drilldown: 'jane'
					}, {
						name: 'Mary', 
						y: 205, 
						drilldown: 'mary'
					},{
						name: 'Alice',
						y: 34, 
						drilldown: 'alice'}
					]
				}];
			
		var dummyObj = {'bb': 304, 'cc': 205, 'dd': 333};

		// for (key in dummyObj){
		// 	labels.push(key);
		// 	console.log(labels.indexOf(key));
		// 	datasets[0]['data'].push(dummyObj[key]);
		// }


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
	                text: 'Boxes sold'
	            }
	        },
	        series: series, 
			drilldown: {
				series: [{
					id: 'jane',
					colorByPoint: true,
					colors: [
						chartOptions.color.gold,
						chartOptions.color.green,
						chartOptions.color.mint,
						chartOptions.color.tomato
					],
					data: [
						['Samoa', 55],
						['Thin Mint', 22],
						['Gingersnaps', 1]
					]
				}, {
					id: 'mary',
					colorByPoint: true,
					colors: [
						chartOptions.color.gold,
						chartOptions.color.green,
						chartOptions.color.mint,
						chartOptions.color.tomato
					],
					data: [
						['Samoa', 55],
						['Thin Mint', 22],
						['Gingersnaps', 1]
					]					
				}, {
					id: 'alice', 
					colorByPoint: true,
					colors: [
						chartOptions.color.gold,
						chartOptions.color.green,
						chartOptions.color.mint,
						chartOptions.color.tomato
					],
					data: [
						['Samoa', 55],
						['Thin Mint', 22],
						['Gingersnaps', 1]
					]
				}]
			}
	    });

	// console.log(labels);
	// console.log(datasets);
	},

	init: function() {
		this.leaderboard();
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