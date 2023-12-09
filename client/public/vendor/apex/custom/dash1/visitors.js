var options = {
	chart: {
		height: 272,
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
			columnWidth: "70%",
			borderRadius: 8,
			dataLabels: {
				position: "top",
			},
		},
	},
	series: [
		{
			name: "Male",
			data: [100, 300, 500, 900, 700, 400, 200],
		},
		{
			name: "Female",
			data: [100, 200, 700, 600, 500, 250, 180],
		},
	],
	xaxis: {
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		labels: {
			show: false,
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

	colors: ["#276dd9", "#F766B3"],

	tooltip: {
		x: {
			format: "dd/MM/yy",
		},
	},
};

var chart = new ApexCharts(document.querySelector("#visitors"), options);

chart.render();
