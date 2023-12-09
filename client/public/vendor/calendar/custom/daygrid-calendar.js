document.addEventListener("DOMContentLoaded", function () {
	var calendarEl = document.getElementById("dayGrid");
	var calendar = new FullCalendar.Calendar(calendarEl, {
		headerToolbar: {
			left: "prevYear,prev,next,nextYear today",
			center: "title",
			right: "dayGridMonth,dayGridWeek,dayGridDay",
		},
		initialDate: "2022-10-12",
		navLinks: true, // can click day/week names to navigate views
		editable: true,
		dayMaxEvents: true, // allow "more" link when too many events
		events: [
			{
				title: "All Day Event",
				start: "2022-10-01",
				color: "#e13d4b",
			},
			{
				title: "Long Event",
				start: "2022-10-07",
				end: "2022-10-10",
				color: "#276dd9",
			},
			{
				groupId: 999,
				title: "Birthday",
				start: "2022-10-09T16:00:00",
				color: "#158c7f",
			},
			{
				groupId: 999,
				title: "Birthday",
				start: "2022-10-16T16:00:00",
				color: "#fda901",
			},
			{
				title: "Conference",
				start: "2022-10-11",
				end: "2022-10-13",
				color: "#158c7f",
			},
			{
				title: "Meeting",
				start: "2022-10-14T10:30:00",
				end: "2022-10-14T12:30:00",
			},
			{
				title: "Lunch",
				start: "2022-10-16T12:00:00",
				color: "#dd5500",
			},
			{
				title: "Meeting",
				start: "2022-10-18T14:30:00",
				color: "#1553a3",
			},
			{
				title: "Interview",
				start: "2022-10-21T17:30:00",
				color: "#e13d4b",
			},
			{
				title: "Meeting",
				start: "2022-10-22T20:00:00",
				color: "#276dd9",
			},
			{
				title: "Birthday",
				start: "2022-10-13T07:00:00",
				color: "#158c7f",
			},
			{
				title: "Click for Google",
				url: "http://google.com/",
				start: "2022-10-28",
				color: "#fda901",
			},
			{
				title: "Interview",
				start: "2022-10-20",
				color: "#7920d1",
			},
			{
				title: "Product Launch",
				start: "2022-10-29",
				color: "#dd5500",
			},
			{
				title: "Leave",
				start: "2022-10-25",
				color: "#245fae",
			},
		],
	});

	calendar.render();
});
