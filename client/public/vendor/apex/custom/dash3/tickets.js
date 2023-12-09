var options = {
	series: [20, 25, 30],
	chart: {
		height: 308,
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
	colors: ["#276dd9", "#448af4", "#7db0fc", "#9fc6ff"],
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

var chart = new ApexCharts(document.querySelector("#tickets"), options);
chart.render();
