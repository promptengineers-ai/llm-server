// Markers on the world map
$(function () {
	$("#world-map-markers").vectorMap({
		map: "world_mill_en",
		normalizeFunction: "polynomial",
		hoverOpacity: 0.7,
		hoverColor: false,
		zoomOnScroll: false,
		markerStyle: {
			initial: {
				fill: "#ffffff",
				stroke: "#ffc81a",
				"fill-opacity": 1,
				"stroke-width": 20,
				"stroke-opacity": 0.4,
				r: 25,
			},
			hover: {
				fill: "#ffffff",
				stroke: "#e13d4b",
				"fill-opacity": 0.8,
				"stroke-width": 20,
				"stroke-opacity": 0.4,
				r: 25,
				cursor: "pointer",
			},
		},
		zoomMin: 1,
		hoverColor: true,
		series: {
			regions: [
				{
					values: gdpData,
					scale: ["#435EEF", "#59a2fb"],
					normalizeFunction: "polynomial",
				},
			],
		},
		backgroundColor: "transparent",
		markers: [
			{ latLng: [37.3, -119.3], name: "California, CA" },
			{ latLng: [28.61, 77.2], name: "New Delhi" },
			{ latLng: [33.55, 18.22], name: "Cape Town" },
			{ latLng: [61.52, 105.31], name: "Moscow" },
			{ latLng: [51.5, 0.12], name: "London" },
			{ latLng: [14.23, 51.92], name: "Brazil" },
		],
	});
});
