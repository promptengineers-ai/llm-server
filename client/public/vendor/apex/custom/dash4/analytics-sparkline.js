// Sparkline 1
var options1 = {
	chart: {
		type: "line",
		height: 50,
		sparkline: {
			enabled: true,
		},
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	series: [
		{
			name: "Visitors",
			data: [30, 40, 30, 20, 45, 35, 65, 75, 55, 30, 70, 90],
		},
	],
	stroke: {
		width: [3],
		curve: "smooth",
	},
	xaxis: {
		categories: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	fill: {
		opacity: [0.85, 0.25, 1],
		gradient: {
			inverseColors: false,
			shade: "light",
			type: "vertical",
			opacityFrom: 0.95,
			opacityTo: 0.25,
			stops: [0, 100, 100, 100],
		},
	},
	yaxis: {
		show: false,
	},
	colors: ["#e13d4b", "#44c1f0", "#ff7e8"],
	grid: {
		padding: {
			top: -5,
			right: 10,
			bottom: 0,
			left: 10,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "K";
			},
		},
	},
};
var chart1 = new ApexCharts(
	document.querySelector("#sparkline-analytics1"),
	options1
);
chart1.render();

// Sparkline 2
var options2 = {
	chart: {
		type: "line",
		height: 50,
		sparkline: {
			enabled: true,
		},
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	series: [
		{
			name: "Sessions",
			data: [30, 40, 30, 20, 45, 35, 65, 75, 55, 30, 70, 90],
		},
	],
	stroke: {
		width: [3],
		curve: "smooth",
	},
	xaxis: {
		categories: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	fill: {
		opacity: [0.85, 0.25, 1],
		gradient: {
			inverseColors: false,
			shade: "light",
			type: "vertical",
			opacityFrom: 0.95,
			opacityTo: 0.25,
			stops: [0, 100, 100, 100],
		},
	},
	yaxis: {
		show: false,
	},
	colors: ["#fda901", "#44c1f0", "#ff7e8"],
	grid: {
		padding: {
			top: -5,
			right: 10,
			bottom: 0,
			left: 10,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "K";
			},
		},
	},
};
var chart2 = new ApexCharts(
	document.querySelector("#sparkline-analytics2"),
	options2
);
chart2.render();

// Sparkline 3
var options3 = {
	chart: {
		type: "line",
		height: 50,
		sparkline: {
			enabled: true,
		},
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	series: [
		{
			name: "Clicks",
			data: [30, 40, 30, 20, 45, 35, 65, 75, 55, 30, 70, 90],
		},
	],
	stroke: {
		width: [3],
		curve: "smooth",
	},
	xaxis: {
		categories: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	fill: {
		opacity: [0.85, 0.25, 1],
		gradient: {
			inverseColors: false,
			shade: "light",
			type: "vertical",
			opacityFrom: 0.95,
			opacityTo: 0.25,
			stops: [0, 100, 100, 100],
		},
	},
	yaxis: {
		show: false,
	},
	colors: ["#00b477", "#44c1f0", "#ff7e8"],
	grid: {
		padding: {
			top: -5,
			right: 10,
			bottom: 0,
			left: 10,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "K";
			},
		},
	},
};
var chart3 = new ApexCharts(
	document.querySelector("#sparkline-analytics3"),
	options3
);
chart3.render();
