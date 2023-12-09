var options = {
	series: [32500, 29700, 18200],
	chart: {
		height: 293,
		type: "polarArea",
	},
	labels: ["18 - 29", "30-49", "50+"],
	fill: {
		opacity: 1,
	},
	stroke: {
		width: 5,
		colors: ["#e6ecf3"],
	},
	colors: ["#ff723b", "#ff976d", "#ffc4ac"],
	yaxis: {
		show: false,
	},
	legend: {
		position: "bottom",
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val;
			},
		},
	},
	plotOptions: {
		polarArea: {
			rings: {
				strokeWidth: 0,
			},
			spokes: {
				strokeWidth: 0,
			},
		},
	},
};

var chart = new ApexCharts(document.querySelector("#ageGroup"), options);
chart.render();
