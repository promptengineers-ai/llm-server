var options = {
	chart: {
		height: 275,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: "60%",
			borderRadius: 8,
			distributed: true,
			dataLabels: {
				position: "top",
			},
		},
	},
	series: [
		{
			name: "Designation",
			data: [52, 73, 34, 66, 82, 49],
		},
	],
	legend: {
		show: false,
	},
	xaxis: {
		categories: [
			"Sales",
			"Operations",
			"Research",
			"Marketing",
			"Admin",
			"Management",
		],
		axisBorder: {
			show: false,
		},
		yaxis: {
			show: false,
		},

		tooltip: {
			enabled: true,
		},
		labels: {
			show: true,
			rotate: -45,
			rotateAlways: true,
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
			right: 10,
			left: 20,
			bottom: -20,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val;
			},
		},
	},
	colors: [
		"#276dd9",
		"#337ce9",
		"#448af4",
		"#69a5ff",
		"#7db0fc",
		"#9fc6ff",
		"#b8d5ff",
		"#eaf2ff",
	],
};
var chart = new ApexCharts(document.querySelector("#designation"), options);
chart.render();
