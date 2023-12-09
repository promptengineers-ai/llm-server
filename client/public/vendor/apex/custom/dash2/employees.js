var options = {
	chart: {
		height: 300,
		type: "bar",
		stacked: true,
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: true,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
		},
	},
	dataLabels: {
		enabled: true,
	},
	series: [
		{
			name: "Project",
			data: [25, 30, 35, 55, 30, 45, 65, 40, 30, 25, 20, 25],
		},
		{
			name: "Bench",
			data: [5, 5, 10, 10, 5, 5, 10, 15, 10, 5, 5, 10],
		},
	],
	xaxis: {
		categories: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"June",
			"July",
			"Aug",
			"Sept",
			"Oct",
			"Nov",
			"Dec",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	grid: {
		borderColor: "#e0e6ed",
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
			right: 0,
			bottom: 10,
			left: 10,
		},
	},
	yaxis: {
		show: false,
	},
	fill: {
		opacity: 1,
	},
	colors: ["#276dd9", "#fa5460"],
};
var chart = new ApexCharts(document.querySelector("#employees"), options);
chart.render();
