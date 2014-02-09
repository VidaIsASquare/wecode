var chartOptions = {
	bar: {
					
		//Boolean - If we show the scale above the chart data			
		scaleOverlay : false,
		
		//Boolean - If we want to override with a hard coded scale
		scaleOverride : false,
		
		//** Required if scaleOverride is true **
		//Number - The number of steps in a hard coded scale
		scaleSteps : null,
		//Number - The value jump in the hard coded scale
		scaleStepWidth : null,
		//Number - The scale starting value
		scaleStartValue : null,

		//String - Colour of the scale line	
		scaleLineColor : "rgba(0,0,0,.1)",
		
		//Number - Pixel width of the scale line	
		scaleLineWidth : 1,

		//Boolean - Whether to show labels on the scale	
		scaleShowLabels : true,
		
		//Interpolated JS string - can access value
		scaleLabel : "<%=value%>",
		
		//String - Scale label font declaration for the scale label
		scaleFontFamily : "'Arial'",
		
		//Number - Scale label font size in pixels	
		scaleFontSize : 12,
		
		//String - Scale label font weight style	
		scaleFontStyle : "normal",
		
		//String - Scale label font colour	
		scaleFontColor : "#666",	
		
		///Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,
		
		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",
		
		//Number - Width of the grid lines
		scaleGridLineWidth : 1,	

		//Boolean - If there is a stroke on each bar	
		barShowStroke : true,
		
		//Number - Pixel width of the bar stroke	
		barStrokeWidth : 2,
		
		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,
		
		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,
		
		//Boolean - Whether to animate the chart
		animation : true,

		//Number - Number of animation steps
		animationSteps : 60,
		
		//String - Animation easing effect
		animationEasing : "easeOutQuart",

		//Function - Fires when the animation is complete
		onAnimationComplete : null		
	}
};

var scouts = {
	init: function() {
		$('#addScout').on('click', scouts.addScout);
	},
	addScout: function() {
		var newHTMLID = Math.floor(Math.random() * 10000000);
		// @todo: surely there is a way to make this a handlebars snippet. 
		var str = "<fieldset class='authset'><label for='name" + newHTMLID + "'> Name: </label><input type='text' class='name' id='name" + newHTMLID + "' /><label for='auth" + newHTMLID + "'> Square Authorization Key: </label><input type='text' class='token' id='auth" + newHTMLID + "' /></fieldset>";
		
		$('.inputs').append(str);		
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
	// View 2: Representing data! 

	//Get context with jQuery - using jQuery's .get() method.

	// {1Q5ZG47GZ44T1: 501}
	leaderboard: function() {
		// init the leaderboard 
		var labels = [];
		var datasets = [{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : []
			}]; 
			
		var data = {
			labels: labels,
			datasets: datasets
		}

		var dummyObj = {'bb': 304, 'cc': 205, 'dd': 333};


		for (key in dummyObj){
			labels.push(key);
			console.log(labels.indexOf(key));
			datasets[0]['data'].push(dummyObj[key]);
		}

		var ctx = $("#leaderboard").get(0).getContext("2d");
		var myNewChart = new Chart(ctx).Bar(data, chartOptions.bar);

	console.log(labels);
	console.log(datasets);
	},

	init: function() {
		this.leaderboard();
	}
}

$(document).ready(function(){

	// init that shit! 
	scouts.init();
	square.init();
	charts.init();

	return {
		charts:charts,
		scouts:scouts,
		square:square
	}

}) // document ready