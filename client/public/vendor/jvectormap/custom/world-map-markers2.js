// Markers on the world map
$(function () {
	$("#world-map-markers2").vectorMap({
		map: "world_mill_en",
		normalizeFunction: "polynomial",
		hoverOpacity: 0.7,
		hoverColor: false,
		zoomOnScroll: false,
		markerStyle: {
			initial: {
				fill: "#149865",
				stroke: "#149865",
				r: 6,
			},
		},
		zoomMin: 1,
		hoverColor: true,
		series: {
			regions: [
				{
					values: gdpData,
					scale: ["#7e8c9e", "#a5b3c4", "#bccada", "#e6ecf3"],
					normalizeFunction: "polynomial",
				},
			],
		},
		backgroundColor: "transparent",
	});
});
