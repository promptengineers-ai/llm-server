// Basic DataTable
$(function(){
	$('#basicExample').DataTable({
		"lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50, "All"]],
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
			"info": "Showing Page _PAGE_ of _PAGES_",
		}
	});
});



// Vertical Scroll
$(function(){
	$('#scrollVertical').DataTable({
		"scrollY": "207px",
		"scrollCollapse": true,
		"paging": false,
		"bInfo" : false,
	});
});



// Highlighting rows and columns
$(function(){
	$('#highlightRowColumn').DataTable({
		"lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50, "All"]],
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
		}
	});
	var table = $('#highlightRowColumn').DataTable();  
	$('#highlightRowColumn tbody').on('mouseenter', 'td', function (){
		var colIdx = table.cell(this).index().column;
		$(table.cells().nodes()).removeClass('highlight');
		$(table.column(colIdx).nodes()).addClass('highlight');
	});
});



// Using API in callbacks
$(function(){
	$('#apiCallbacks').DataTable({
		"lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50, "All"]],
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
		},
		"initComplete": function(){
			var api = this.api();
			api.$('td').on('click', function(){
			api.search(this.innerHTML).draw();
		});
		}
	});
});


// Hiding Search and Show entries
$(function(){
	$('#hideSearchExample').DataTable({
		"lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50, "All"]],
		"searching": false,
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
			"info": "Showing Page _PAGE_ of _PAGES_",
		}
	});
});