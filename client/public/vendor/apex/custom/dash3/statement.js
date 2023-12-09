var options = {
	chart: {
		height: 354,
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
			name: "Balance",
			data: [52, 73, 34, 66, 82, 49],
		},
	],
	legend: {
		show: false,
	},
	xaxis: {
		categories: ["January", "February", "March", "April", "May", "June"],
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
			right: 0,
			bottom: 0,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val + " million";
			},
		},
	},
	colors: ["#276dd9", "#337ce9", "#448af4", "#69a5ff", "#7db0fc", "#9fc6ff"],
};
var chart = new ApexCharts(document.querySelector("#statement"), options);
chart.render();
