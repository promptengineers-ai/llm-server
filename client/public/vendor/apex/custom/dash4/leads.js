var options = {
	series: [20, 25, 30],
	chart: {
		height: 300,
		type: "polarArea",
	},
	labels: ["New", "InProgress", "Completed"],
	fill: {
		opacity: 1,
	},
	stroke: {
		width: 1,
		colors: undefined,
	},
	colors: ["#e13d4b", "#fda901", "#276dd9"],
	yaxis: {
		show: false,
	},
	legend: {
		position: "bottom",
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return "$" + val;
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

var chart = new ApexCharts(document.querySelector("#leads"), options);
chart.render();
