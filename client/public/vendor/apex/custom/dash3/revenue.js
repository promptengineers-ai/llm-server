var options = {
	chart: {
		height: 280,
		type: "area",
		zoom: {
			enabled: false,
		},
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		curve: "smooth",
		width: 5,
	},
	series: [
		{
			name: "Revenue",
			data: [120, 260, 490, 580, 310],
		},
	],
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
			right: 20,
			bottom: 0,
			left: 20,
		},
	},
	xaxis: {
		categories: ["Pizzas", "Biscuits", "Donuts", "Cakes", "Coffee"],
	},
	yaxis: {
		show: false,
	},
	fill: {
		type: "gradient",
		gradient: {
			type: "vertical",
			shadeIntensity: 1,
			inverseColors: !1,
			opacityFrom: 0.4,
			opacityTo: 0.2,
			stops: [15, 100],
		},
	},
	colors: ["#276dd9"],
	markers: {
		size: 0,
		opacity: 0.2,
		colors: ["#276dd9"],
		strokeColor: "#ffffff",
		strokeWidth: 2,
		hover: {
			size: 7,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return val;
			},
		},
	},
};

var chart = new ApexCharts(document.querySelector("#revenueGraph"), options);

chart.render();
