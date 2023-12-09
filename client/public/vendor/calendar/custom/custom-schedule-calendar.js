document.addEventListener('DOMContentLoaded', function() {
	var calendarEl = document.getElementById('customScheduleCal');

	var calendar = new FullCalendar.Calendar(calendarEl, {
		headerToolbar: {
			left: 'prev, next, today, dayGridMonth',
			center: '',
			right: 'title'
		},
		initialDate: '2022-06-12',
		navLinks: true, // can click day/week names to navigate views
		businessHours: true, // display business hours
		editable: true,
		selectable: true,
        contentHeight: "auto",
		events: [
			{
				title: '5',
				start: '2022-06-03',
				color: '#c34c4c'
			},
			{
				title: '3',
				start: '2022-06-04',
				color: '#76a58e'
			},
			{
				title: '7',
				start: '2022-06-05',
			},
			{
				title: '3',
				start: '2022-06-08',
			},
			{
				title: '9',
				start: '2022-06-10',
				color: '#c34c4c'
			},
			{
				title: '4',
				start: '2022-06-12',
				color: '#76a58e'
			},
			{
				title: '7',
				start: '2022-06-15',
				color: '#c19136'
			},
			{
				title: '2',
				start: '2022-06-16',
			},			
			{
				title: '8',
				start: '2022-06-18',
				color: '#c34c4c'
			},
			{
				title: '6',
				start: '2022-06-21',
				color: '#76a58e'
			},
			{
				title: '4',
				start: '2022-06-23',
				color: '#c19136'
			},
			{
				title: '7',
				start: '2022-06-25',
			},
		]
	});

	calendar.render();
});