var options = {
	series: [
		{
			name: "Income",
			type: "area",
			data: [640, 505],
		},
		{
			name: "Expenses",
			type: "line",
			data: [540, 430],
		},
	],
	chart: {
		height: 280,
		type: "line",
		zoom: {
			enabled: false,
		},
		toolbar: {
			show: false,
		},
	},
	colors: ["#b8d5ff", "#276dd9"],
	stroke: {
		width: [0, 4],
		curve: "smooth",
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return +val + "k";
			},
		},
	},
	grid: {
		borderColor: "#b7c6d8",
		strokeDashArray: 5,
		xaxis: {
			lines: {
				show: true,
			},
		},
		yaxis: {
			lines: {
				show: false,
			},
		},
		padding: {
			top: 0,
			right: 20,
			bottom: 0,
			left: 20,
		},
	},
	dataLabels: {
		enabled: true,
		enabledOnSeries: [1],
	},
	labels: ["Q3", "Q4"],
	xaxis: {
		type: "day",
	},
};

var chart = new ApexCharts(document.querySelector("#income"), options);
chart.render();
