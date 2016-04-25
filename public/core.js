var cassandraVis = angular.module('cassandraVis', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}

cassandraVis.controller('TemperatureController', ['$scope','$interval', '$http', function($scope, $interval, $http){

    $scope.temperatureData=[
        {hour: 1,temperature: 54},
        {hour: 2,temperature: 66},
        {hour: 3,temperature: 77},
        {hour: 4,temperature: 70},
        {hour: 5,temperature: 60},
        {hour: 6,temperature: 63},
        {hour: 7,temperature: 55},
        {hour: 8,temperature: 47},
        {hour: 9,temperature: 55},
        {hour: 10,temperature: 30}
    ];
    var counter = 0;
    $interval(function(){
        var hour=$scope.temperatureData.length+1;
        var temperature= Math.round(Math.random() * 100);
        $scope.temperatureData.push({hour: hour, temperature:temperature});
	counter++;
        drawChart($scope.temperatureData);
        
        
        /* ---------- This is approxmatealy how the data will be fetched from the server ---------
	if (counter > 99) counter = 0;
	$http.get('/api/temperatures')
		.success(function(data) {
			console.log(data[counter]);
			$scope.temperatureData.push({hour:data[counter].hour, temperature:data[counter].value});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	*/
    }, 1000, 10);
}]);

//cassandraVis.directive('linearChart', function($parse, $window){
//    
//    
//    // constants
//  var margin = {},
//    width  = $window.innerWidth,
//    height = width * 0.7,
//    color = d3.interpolateRgb("#f77", "#77f");
//    
//   return{
//      restrict:'EA',
//      //template:"<svg width='850' min-width='200' height='200'></svg>",
//       link: function(scope, elem, attrs){
//           
//           // set up initial svg object
//  
//           console.log("Inner width: " + $window.innerWidth)
//           updateDimensions($window.innerWidth, $window.innerHeight);
//           
//           var exp = $parse(attrs.chartData);
//
//           var temperatureDataToPlot=exp(scope);
//           var padding = 20;
//           var pathClass="path";
//           var xScale, yScale, xAxisGen, yAxisGen, lineFun;
//
//           var d3 = $window.d3;
//          
//          // var svg = d3.select(rawSvg[0]);
//
//        var svg = d3.select(elem[0])
//        .append("svg")
//          .attr("width", width)
//          .attr("height", height + margin + 100);
//           
//           console.log(elem[0]);
//           
//            var rawSvg=elem.find('svg');
//           console.log(rawSvg.attr("width"));
//           scope.$watchCollection(exp, function(newVal, oldVal){
//               temperatureDataToPlot=newVal;
//               redrawLineChart();
//           });
//
//           function setChartParameters(){
//
//               svg
//                  .attr('width', width + margin.right + margin.left)
//                  .attr('height', height + margin.top + margin.bottom);
//               xScale = d3.scale.linear()
//                   .domain([temperatureDataToPlot[0].hour, temperatureDataToPlot[temperatureDataToPlot.length-1].hour])
//                   .range([padding + 2, rawSvg.attr("width") - padding]);
//
//               yScale = d3.scale.linear()
//                   .domain([0, d3.max(temperatureDataToPlot, function (d) {
//                       return d.temperature;
//                   })])
//                   .range([height - padding, 0]);
//
//               xAxisGen = d3.svg.axis()
//                   .scale(xScale)
//                   .orient("bottom")
//                 .ticks(temperatureDataToPlot.length - 1);
//
//               yAxisGen = d3.svg.axis()
//                   .scale(yScale)
//                   .orient("left")
//                   .ticks(5);
//
//               lineFun = d3.svg.line()
//                   .x(function (d) {
//                       return xScale(d.hour);
//                   })
//                   .y(function (d) {
//                       return yScale(d.temperature);
//                   })
//                   .interpolate("basis");
//           }
//         
//         function drawLineChart() {
//
//               setChartParameters();
//
//               svg.append("svg:g")
//                   .attr("class", "x axis")
//                   .attr("transform", 'translate(0,'+ height + ')')
//                   .call(xAxisGen);
//
//               svg.append("svg:g")
//                   .attr("class", "y axis")
//                   .attr("transform", "translate(20,0)")
//                   .call(yAxisGen);
//
//               svg.append("svg:path")
//                   .attr({
//                       d: lineFun(temperatureDataToPlot),
//                       "stroke": "blue",
//                       "stroke-width": 2,
//                       "fill": "none",
//                       "class": pathClass
//                   });
//           }
//
//           function redrawLineChart() {
//
//               updateDimensions($window.innerWidth, $window.innerHeight);
//               setChartParameters();
//
//               svg.selectAll("g.y.axis").call(yAxisGen);
//
//               svg.selectAll("g.x.axis").call(xAxisGen);
//
//               svg.selectAll("."+pathClass)
//                   .attr({
//                       d: lineFun(temperatureDataToPlot)
//                   });
//           }
//           function updateDimensions(winWidth, winHeight) {
//                margin.top = 20;
////                margin.right = winWidth < breakPoint ? 0 : 50;
////                margin.left = winWidth < breakPoint ? 0 : 50;
//                margin.bottom = 50;
//                margin.right = 50;
//                margin.left =  50;
//
//                width = winWidth - margin.left - margin.right;
//                height = .7 * width;
//                console.log("WinWidth: "+ width);
//                height = height >= winHeight ? winHeight * 0.8 : height
//              }
//
//           drawLineChart();
//           window.addEventListener('resize', redrawLineChart);
//       }
//   };
//});
