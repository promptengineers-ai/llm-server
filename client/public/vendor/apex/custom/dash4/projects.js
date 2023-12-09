var options = {
	series: [
		{
			name: "Completed",
			data: [
				{
					x: "Admin Dashboard",
					y: 30,
					goals: [
						{
							name: "Expected",
							value: 35,
							strokeWidth: 1,
							strokeDashArray: 1,
							strokeColor: "#000000",
						},
					],
				},
				{
					x: "Mobile App Design",
					y: 35,
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
					x: "UI Development",
					y: 50,
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
					x: "Branding",
					y: 65,
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
					x: "UI Kit",
					y: 90,
					goals: [
						{
							name: "Expected",
							value: 95,
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
		height: 242,
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
	colors: ["#e13d4b", "#fda901", "#00b477", "#276dd9", "#684af6", "#f58354"],
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
	tooltip: {
		y: {
			formatter: function (val) {
				return val + "%";
			},
		},
	},
	legend: {
		show: false,
	},
};

var chart = new ApexCharts(document.querySelector("#projects"), options);
chart.render();
