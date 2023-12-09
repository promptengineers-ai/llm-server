var options = {
	chart: {
		height: 182,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		colors: "#ffffff",
		width: 3,
	},
	plotOptions: {
		bar: {
			columnWidth: "40%",
			borderRadius: 6,
			dataLabels: {
				position: "top",
			},
		},
	},
	series: [
		{
			name: "Visitors",
			data: [100, 300, 500, 900, 700, 400, 200],
		},
		{
			name: "Sessions",
			data: [90, 200, 700, 600, 500, 250, 180],
		},
		{
			name: "Clicks",
			data: [80, 150, 400, 300, 600, 150, 90],
		},
	],
	xaxis: {
		categories: [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		],
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		labels: {
			show: true,
		},
	},
	yaxis: {
		show: false,
	},
	grid: {
		borderColor: "#fcb6db",
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
	},

	colors: ["#1553a3", "#e13d4b", "#158c7f"],

	tooltip: {
		x: {
			format: "dd/MM/yy",
		},
	},
};

var chart = new ApexCharts(document.querySelector("#analytics"), options);

chart.render();
