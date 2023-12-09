// Sparkline 1
var options1 = {
	series: [45],
	chart: {
		type: "radialBar",
		width: 75,
		height: 75,
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
	colors: ["#276dd9", "#d5cdff"],
};

var chart1 = new ApexCharts(document.querySelector("#sparkline1"), options1);
chart1.render();

// Sparkline 2
var options2 = {
	series: [75],
	chart: {
		type: "radialBar",
		width: 75,
		height: 75,
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
	colors: ["#e13d4b", "#d5cdff"],
};

var chart2 = new ApexCharts(document.querySelector("#sparkline2"), options2);
chart2.render();

// Sparkline 3
var options3 = {
	series: [75],
	chart: {
		type: "radialBar",
		width: 75,
		height: 75,
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

var chart3 = new ApexCharts(document.querySelector("#sparkline3"), options3);
chart3.render();

// Sparkline 4
var options4 = {
	series: [70],
	chart: {
		type: "radialBar",
		width: 58,
		height: 58,
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

var chart4 = new ApexCharts(document.querySelector("#sparkline4"), options4);
chart4.render();

// Sparkline 5
var options5 = {
	series: [75],
	chart: {
		type: "radialBar",
		width: 58,
		height: 58,
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

var chart5 = new ApexCharts(document.querySelector("#sparkline5"), options5);
chart5.render();

// Sparkline 6
var options6 = {
	series: [80],
	chart: {
		type: "radialBar",
		width: 58,
		height: 58,
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

var chart6 = new ApexCharts(document.querySelector("#sparkline6"), options6);
chart6.render();

// Sparkline 7
var options7 = {
	series: [85],
	chart: {
		type: "radialBar",
		width: 58,
		height: 58,
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
	colors: ["#158c7f"],
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

var chart8 = new ApexCharts(document.querySelector("#sparkline8"), options8);
chart8.render();

// Sparkline 9
var options9 = {
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

var chart9 = new ApexCharts(document.querySelector("#sparkline9"), options9);
chart9.render();

// Sparkline 10
var options10 = {
	series: [
		{
			data: [30, 90, 60, 75, 45, 30],
		},
	],
	chart: {
		type: "area",
		height: 40,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		curve: "smooth",
		width: 3,
	},
	colors: ["#276dd9"],
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

var chart10 = new ApexCharts(document.querySelector("#sparkline10"), options10);
chart10.render();

// Sparkline 11
var options11 = {
	series: [
		{
			data: [30, 90, 60, 75, 45, 30],
		},
	],
	chart: {
		type: "bar",
		height: 40,
		sparkline: {
			enabled: true,
		},
	},
	stroke: {
		curve: "smooth",
		width: 0,
	},
	colors: ["#ff7e87", "#684af6", "#44c1f0"],
	plotOptions: {
		bar: {
			columnWidth: "70%",
			borderRadius: 8,
			distributed: true,
			dataLabels: {
				position: "top",
			},
		},
	},

	fill: {
		opacity: [0.85, 0.25, 1],
		gradient: {
			inverseColors: false,
			shade: "light",
			type: "vertical",
			opacityFrom: 0.85,
			opacityTo: 0.55,
			stops: [0, 100, 100, 100],
		},
	},
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

var chart11 = new ApexCharts(document.querySelector("#sparkline11"), options11);
chart11.render();

// Sparkline 12
var options12 = {
	series: [75],
	chart: {
		type: "radialBar",
		width: 75,
		height: 75,
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
	colors: ["#158C7F", "#158C7F"],
};
var chart12 = new ApexCharts(document.querySelector("#sparkline12"), options12);
chart12.render();
