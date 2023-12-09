// Morris Donut
Morris.Donut({
	element: "donutColors",
	data: [
		{ value: 30, label: "foo" },
		{ value: 15, label: "bar" },
		{ value: 10, label: "baz" },
		{ value: 5, label: "A really really long label" },
	],
	backgroundColor: "#17181c",
	labelColor: "#17181c",
	colors: [
		"#1553a3",
		"#245fae",
		"#4477bc",
		"#6590c9",
		"#85a8d7",
		"#c6d9f2",
		"#c7e0ff",
	],
	resize: true,
	hideHover: "auto",
	gridLineColor: "#dfd6ff",
	formatter: function (x) {
		return x + "%";
	},
});
