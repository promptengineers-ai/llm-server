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

var chart1 = new ApexCharts(document.querySelector("#transactions1"), options1);
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

var chart2 = new ApexCharts(document.querySelector("#transactions2"), options2);
chart2.render();
