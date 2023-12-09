var options = {
	chart: {
		height: 280,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: "50px",
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		show: true,
		width: 2,
		colors: ["transparent"],
	},
	series: [
		{
			name: "Revenue",
			data: [2000, 3000, 4000, 5000],
		},
		{
			name: "Income",
			data: [2500, 3500, 4500, 5500],
		},
	],
	legend: {
		show: false,
	},
	xaxis: {
		categories: ["2018", "2019", "2020", "2021"],
	},
	yaxis: {
		show: false,
	},
	fill: {
		opacity: 1,
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return "$ " + val + " thousands";
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
			right: 0,
			bottom: 0,
			left: 0,
		},
	},
	colors: ["#276dd9", "#b8d5ff"],
};
var chart = new ApexCharts(document.querySelector("#incomeGraph"), options);
chart.render();
