$(document).ready(function () {
	$("#weeklyTickets").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 20,
		backgroundBorderWidth: 5,
		percent: 70,
		fontColor: "#276dd9",
		foregroundColor: "#276dd9",
		backgroundColor: "#9be0fc",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});

	$("#monthlyTickets").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 20,
		backgroundBorderWidth: 5,
		percent: 85,
		fontColor: "#fda901",
		foregroundColor: "#fda901",
		backgroundColor: "#fff1c9",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});

	$("#weeklyEarnings").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 25,
		backgroundBorderWidth: 25,
		percent: 100,
		fontColor: "#1F314E",
		foregroundColor: "#F5BE2B",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});

	$("#monthlyEarnings").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 25,
		backgroundBorderWidth: 25,
		percent: 100,
		fontColor: "#1F314E",
		foregroundColor: "#2CA757",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});

	$("#overallSales").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 25,
		backgroundBorderWidth: 25,
		percent: 100,
		fontColor: "#1F314E",
		foregroundColor: "#435EEF",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});

	$("#overallExpenses").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 25,
		backgroundBorderWidth: 25,
		percent: 80,
		fontColor: "#1F314E",
		foregroundColor: "#435EEF",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});

	$("#overallIncome").circliful({
		animation: 1,
		animationStep: 5,
		foregroundBorderWidth: 25,
		backgroundBorderWidth: 25,
		percent: 70,
		fontColor: "#1F314E",
		foregroundColor: "#149865",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		multiPercentage: 1,
		percentages: [10, 20, 30],
	});
});
