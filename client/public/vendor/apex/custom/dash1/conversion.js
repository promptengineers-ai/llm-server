var options = {
	series: [
		{
			name: "Sales",
			data: [2, 3, 3, 5, 7, 9, 4, 6, 8, 3, 4, 2],
		},
		{
			name: "Income",
			data: [-4, -2, -5, -3, -6, -4, -5, -8, -3, -2, -3, -2],
		},
	],
	chart: {
		type: "bar",
		height: 154,
		stacked: true,
		toolbar: {
			show: false,
		},
	},
	colors: ["#276dd9", "#c6dcfe"],
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: "50%",
			borderRadius: 2,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 0,
	},
	grid: {
		show: false,
		padding: {
			top: -20,
			right: 0,
			bottom: 0,
			left: 0,
		},
	},
	yaxis: {
		show: false,
	},
	legend: {
		show: false,
	},
	tooltip: {
		shared: false,
		x: {
			formatter: function (val) {
				return val;
			},
		},
		y: {
			formatter: function (val) {
				return Math.abs(val) + "%";
			},
		},
	},
	xaxis: {
		show: false,
	},
};

var chart = new ApexCharts(document.querySelector("#conversion"), options);
chart.render();
