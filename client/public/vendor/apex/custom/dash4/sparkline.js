// Sparkline 1
var options1 = {
	chart: {
		type: "bar",
		height: 130,
		width: "90%",
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
	plotOptions: {
		bar: {
			columnWidth: "70%",
			borderRadius: 5,
			distributed: true,
			dataLabels: {
				position: "top",
			},
		},
	},
	dataLabels: {
		enabled: true,
	},
	series: [
		{
			name: "Projects",
			data: [30, 40, 50, 65, 75, 95, 95, 75, 65, 50, 40, 30],
		},
	],
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
	colors: ["#ff7e87", "#684af6", "#44c1f0"],
};
var chart1 = new ApexCharts(document.querySelector("#sparkline1"), options1);
chart1.render();

// Sparkline 2
var options2 = {
	chart: {
		type: "area",
		height: 130,
		width: "90%",
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
			name: "Income",
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
	colors: ["#684af6", "#44c1f0", "#ff7e8"],
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
var chart2 = new ApexCharts(document.querySelector("#sparkline2"), options2);
chart2.render();

// Sparkline 3
var options3 = {
	series: [
		{
			name: "Sales",
			data: [1, 3, 2, 3, 2],
		},
	],
	chart: {
		type: "line",
		height: 109,
		width: "50%",
		sparkline: {
			enabled: true,
		},
	},
	colors: ["#fda901"],
	stroke: {
		curve: "smooth",
		width: 3,
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		marker: {
			show: false,
		},
	},
	xaxis: {
		type: "day",
		categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "K";
			},
		},
	},
};
var chart3 = new ApexCharts(document.querySelector("#sparkline3"), options3);
chart3.render();

// Sparkline 4
var options4 = {
	series: [
		{
			name: "Expenses",
			data: [1, 2, 3, 3, 2],
		},
	],
	chart: {
		type: "area",
		height: 109,
		width: "50%",
		sparkline: {
			enabled: true,
		},
	},
	colors: ["#158c7f"],
	stroke: {
		curve: "smooth",
		width: 3,
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		marker: {
			show: false,
		},
	},
	xaxis: {
		type: "day",
		categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "K";
			},
		},
	},
};
var chart4 = new ApexCharts(document.querySelector("#sparkline4"), options4);
chart4.render();

// Sparkline 5
var options5 = {
	series: [
		{
			name: "Income",
			data: [1, 2, 3, 4, 1, 2, 3],
		},
	],
	chart: {
		type: "bar",
		height: 109,
		width: "65%",
		sparkline: {
			enabled: true,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: "70%",
			distributed: true,
		},
	},
	colors: ["#ffeff0", "#ff9fa6", "#ffdfe1", "#e13d4b"],
	stroke: {
		curve: "smooth",
		width: 1,
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		marker: {
			show: false,
		},
	},
	xaxis: {
		type: "day",
		categories: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		],
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "K";
			},
		},
	},
};
var chart5 = new ApexCharts(document.querySelector("#sparkline5"), options5);
chart5.render();
