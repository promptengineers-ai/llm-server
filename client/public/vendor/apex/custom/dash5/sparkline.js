// Sparkline 1
var options1 = {
	chart: {
		type: "line",
		height: 80,
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
			data: [10, 40, 20, 50, 30, 60],
		},
	],
	stroke: {
		width: [7],
	},
	xaxis: {
		categories: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	yaxis: {
		show: false,
	},
	colors: ["#684af6", "#44c1f0", "#ff7e8"],
	grid: {
		padding: {
			top: 0,
			right: 0,
			bottom: -15,
			left: -10,
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
var chart1 = new ApexCharts(document.querySelector("#sparkline1"), options1);
chart1.render();

// Sparkline 2
var options2 = {
	series: [
		{
			name: "Clicks",
			data: [1, 2, 3, 4, 1, 2, 3],
		},
	],
	chart: {
		type: "bar",
		height: 80,
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
	colors: ["#1553a3", "#245fae", "#4477bc", "#c6d9f2"],
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
var chart2 = new ApexCharts(document.querySelector("#sparkline2"), options2);
chart2.render();

// Sparkline 3
var options3 = {
	series: [85],
	chart: {
		type: "radialBar",
		width: 79,
		height: 79,
		sparkline: {
			enabled: true,
		},
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		radialBar: {
			hollow: {
				margin: 0,
				size: "50%",
			},
			track: {
				margin: 0,
				background: "#e6ecf3",
			},
			dataLabels: {
				show: false,
			},
		},
	},
	colors: ["#ff723b", "#d5cdff"],
};

var chart3 = new ApexCharts(document.querySelector("#sparkline3"), options3);
chart3.render();

// Sparkline 4
var options4 = {
	chart: {
		type: "area",
		height: 80,
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
			name: "Bounce Rate",
			data: [10, 40, 20, 50, 30, 60],
		},
	],
	stroke: {
		width: [7],
	},
	xaxis: {
		categories: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	yaxis: {
		show: false,
	},
	colors: ["#0eaeee", "#44c1f0", "#ff7e8"],
	grid: {
		padding: {
			top: 0,
			right: 0,
			bottom: -15,
			left: -10,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "%";
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
			name: "Clicks",
			data: [1, 2, 3, 4, 1, 2, 3],
		},
	],
	chart: {
		type: "bar",
		height: 80,
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
	colors: ["#158c7f", "#2c998d", "#4baa9f", "#e13d4b"],
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

// Sparkline 6
var options6 = {
	chart: {
		type: "line",
		height: 56,
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
			data: [10, 20, 30, 20, 30, 40],
		},
	],
	stroke: {
		width: [7],
	},
	xaxis: {
		categories: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
		],
	},
	legend: {
		position: "bottom",
		offsetY: 0,
	},
	yaxis: {
		show: false,
	},
	colors: ["#158c7f", "#44c1f0", "#ff7e8"],
	grid: {
		padding: {
			top: 0,
			right: 0,
			bottom: -15,
			left: -10,
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
var chart6 = new ApexCharts(document.querySelector("#sparkline6"), options6);
chart6.render();

// Sparkline 7
var options7 = {
	series: [
		{
			data: [30, 70, 40, 65, 25, 40],
		},
	],
	chart: {
		type: "line",
		height: 35,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		curve: "smooth",
		width: 3,
	},
	colors: ["#e13d4b"],
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function (seriesName) {
					return "";
				},
			},
		},
		marker: {
			show: false,
		},
	},
};

var chart7 = new ApexCharts(document.querySelector("#sparkline7"), options7);
chart7.render();

// Sparkline 8
var options8 = {
	series: [
		{
			data: [30, 70, 40, 65, 25, 40],
		},
	],
	chart: {
		type: "line",
		height: 35,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		curve: "smooth",
		width: 3,
	},
	colors: ["#7920d1"],
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function (seriesName) {
					return "";
				},
			},
		},
		marker: {
			show: false,
		},
	},
};

var chart8 = new ApexCharts(document.querySelector("#sparkline8"), options8);
chart8.render();

// Sparkline 9
var options9 = {
	series: [70],
	chart: {
		type: "radialBar",
		width: 60,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		radialBar: {
			hollow: {
				margin: 0,
				size: "50%",
			},
			track: {
				margin: 0,
				background: "#e6ecf3",
			},
			dataLabels: {
				show: false,
			},
		},
	},
	colors: ["#fda901", "#d5cdff"],
};

var chart9 = new ApexCharts(document.querySelector("#sparkline9"), options9);
chart9.render();

// Sparkline 10
var options10 = {
	series: [75],
	chart: {
		type: "radialBar",
		width: 60,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		radialBar: {
			hollow: {
				margin: 0,
				size: "50%",
			},
			track: {
				margin: 0,
				background: "#e6ecf3",
			},
			dataLabels: {
				show: false,
			},
		},
	},
	colors: ["#7920d1"],
};

var chart10 = new ApexCharts(document.querySelector("#sparkline10"), options10);
chart10.render();

// Sparkline 11
var options11 = {
	series: [80],
	chart: {
		type: "radialBar",
		width: 60,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		radialBar: {
			hollow: {
				margin: 0,
				size: "50%",
			},
			track: {
				margin: 0,
				background: "#e6ecf3",
			},
			dataLabels: {
				show: false,
			},
		},
	},
	colors: ["#e13d4b"],
};

var chart11 = new ApexCharts(document.querySelector("#sparkline11"), options11);
chart11.render();

// Sparkline 12
var options12 = {
	series: [85],
	chart: {
		type: "radialBar",
		width: 60,
		height: 60,
		sparkline: {
			enabled: true,
		},
	},
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		radialBar: {
			hollow: {
				margin: 0,
				size: "50%",
			},
			track: {
				margin: 0,
				background: "#e6ecf3",
			},
			dataLabels: {
				show: false,
			},
		},
	},
	colors: ["#ff723b"],
};

var chart12 = new ApexCharts(document.querySelector("#sparkline12"), options12);
chart12.render();
