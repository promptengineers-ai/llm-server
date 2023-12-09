var options = {
	chart: {
		height: 237,
		type: "radialBar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		radialBar: {
			dataLabels: {
				name: {
					fontSize: "12px",
					fontColor: "black",
				},
				value: {
					fontSize: "21px",
				},
				total: {
					show: true,
					label: "Income",
					formatter: function (w) {
						// By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
						return "89k";
					},
				},
			},
			track: {
				background: "#e6ecf3",
			},
		},
	},
	series: [80, 70, 50],
	labels: ["Transactions", "Expenses", "Profits"],
	colors: ["#276dd9", "#fda901", "#e13d4b", "#276dd9", "#684af6", "#f58354"],
};

var chart = new ApexCharts(document.querySelector("#transactions"), options);
chart.render();
