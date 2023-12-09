var options = {
	series: [
		{
			name: "Completed",
			data: [
				{
					x: "Patch Release",
					y: 30,
					goals: [
						{
							name: "Expected",
							value: 25,
							strokeWidth: 1,
							strokeDashArray: 1,
							strokeColor: "#000000",
						},
					],
				},
				{
					x: "Firewalls",
					y: 45,
					goals: [
						{
							name: "Expected",
							value: 40,
							strokeWidth: 1,
							strokeDashArray: 1,
							strokeColor: "#000000",
						},
					],
				},
				{
					x: "OS Update",
					y: 60,
					goals: [
						{
							name: "Expected",
							value: 55,
							strokeWidth: 1,
							strokeDashArray: 1,
							strokeLineCap: "round",
							strokeColor: "#000000",
						},
					],
				},
				{
					x: "Server Setup",
					y: 75,
					goals: [
						{
							name: "Expected",
							value: 70,
							strokeWidth: 1,
							strokeDashArray: 1,
							strokeLineCap: "round",
							strokeColor: "#000000",
						},
					],
				},
				{
					x: "Trainings",
					y: 90,
					goals: [
						{
							name: "Expected",
							value: 85,
							strokeWidth: 1,
							strokeDashArray: 1,
							strokeColor: "#000000",
						},
					],
				},
			],
		},
	],
	chart: {
		height: 227,
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: true,
			distributed: true,
		},
	},
	colors: ["#276dd9", "#337ce9", "#448af4", "#69a5ff", "#7db0fc", "#9fc6ff"],
	dataLabels: {
		formatter: function (val, opt) {
			const goals =
				opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

			if (goals && goals.length) {
				return `${val} / ${goals[0].value}`;
			}
			return val;
		},
	},
	legend: {
		show: false,
	},
};

var chart = new ApexCharts(document.querySelector("#reports"), options);
chart.render();
