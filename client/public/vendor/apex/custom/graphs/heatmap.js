options = {
	series: [
		{
			name: "USA",
			data: [
				{
					x: "Q1",
					y: 27,
				},
				{
					x: "Q2",
					y: 36,
				},
				{
					x: "Q3",
					y: 25,
				},
				{
					x: "Q4",
					y: 32,
				},
			],
		},
		{
			name: "India",
			data: [
				{
					x: "Q1",
					y: 43,
				},
				{
					x: "Q2",
					y: 35,
				},
				{
					x: "Q3",
					y: 26,
				},
				{
					x: "Q4",
					y: 55,
				},
			],
		},
		{
			name: "Brazil",
			data: [
				{
					x: "Q1",
					y: 28,
				},
				{
					x: "Q2",
					y: 32,
				},
				{
					x: "Q3",
					y: 16,
				},
				{
					x: "Q4",
					y: 22,
				},
			],
		},
		{
			name: "Indonesia",
			data: [
				{
					x: "Q1",
					y: 32,
				},
				{
					x: "Q2",
					y: 21,
				},
				{
					x: "Q3",
					y: 20,
				},
				{
					x: "Q4",
					y: 46,
				},
			],
		},
	],
	legend: {
		show: false,
	},
	chart: {
		height: 300,
		type: "heatmap",
		toolbar: {
			show: false,
		},
	},
	colors: ["#1553a3", "#245fae", "#4477bc", "#6590c9", "#85a8d7", "#c6d9f2"],
	tooltip: {
		y: {
			formatter: function (val) {
				return "$" + val + " Million";
			},
		},
	},
};

var chart = new ApexCharts(document.querySelector("#heatmap"), options);
chart.render();
