var options = {
	chart: {
		width: 300,
		type: "donut",
	},
	labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
	series: [20, 20, 20, 20, 20],
	legend: {
		position: "bottom",
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 0,
	},
	colors: ["#1553a3", "#245fae", "#4477bc", "#6590c9", "#85a8d7", "#c6d9f2"],
};
var chart = new ApexCharts(document.querySelector("#donut"), options);
chart.render();
