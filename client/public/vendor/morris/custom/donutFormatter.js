Morris.Donut({
	element: "donutFormatter",
	data: [
		{ value: 155, label: "voo", formatted: "at least 70%" },
		{ value: 12, label: "bar", formatted: "approx. 15%" },
		{ value: 10, label: "baz", formatted: "approx. 10%" },
		{ value: 5, label: "A really really long label", formatted: "at most 5%" },
	],
	resize: true,
	hideHover: "auto",
	formatter: function (x, data) {
		return data.formatted;
	},
	labelColor: "#17181c",
	colors: ["#ff866a", "#ff9769", "#ffaf8c", "#f17e5f"],
});
