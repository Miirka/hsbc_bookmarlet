var csv = '';
var nl = '\n';
var $table = $('table:not(".extPibTable")');
var statement_date = $('.extContentHighlightPib:eq(1) .extPibRow:eq(0) .hsbcTextRight').html();
var year = statement_date.substr(statement_date.length-4);

// build header specifically for YNAB
csv = "Date,Payee,Category,Memo,Outflow,Inflow"

csv = csv + nl;

// get rest of data

// loop rows
$('tbody tr', $table).each(function(){
	
	// loop cells
	var cell_count = 0;
	var cells = [];
	$('td', $(this)).each(function(){
		
		if(cell_count==0) {
			// this is the date
			cells.push($('p', $(this)).html().trim() + ' ' + year);
		} else if(cell_count==5) {
			// this is the balance
			
			var balance = $('p', $(this)).html().trim().replace('<b>', '').replace('</b>', '');
			if($('p', $(this).next()).html().trim()=='D') {
				balance = '-' + balance;
			}
			cells.push(balance);
			
		} else if(cell_count!=6) {
			
			if($('a', $(this)).length) {
				cells.push($('a', $(this)).html().trim());
			} else {
				
				if($('strong', $(this)).length) {
					cells.push($('strong', $(this)).html().trim().replace('<b>', '').replace('</b>', ''));
				} else {
					cells.push($('p', $(this)).html().trim().replace('&nbsp;', '').replace('<b>', '').replace('</b>', ''));
				}
				
			}
		}
		
		cell_count++;
	});

	//cells = [Date, Type, Description, Paid Out, Paid In, Balance]
	// re-order according to YNAB format: "Date,Payee,Category,Memo,Outflow,Inflow"
	if (cells[2] != "Balance brought forward") && (cells[2] != "Balance carried forward") {
		csv = csv + '"' + cells[0] + '","' + cells[2] + '",,"' + cells[1] + '","' + cells[3] + '","' + cells[4] + '"'
	}
	
	csv = csv + nl;
	
});

var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

$('body').append('<a href="'+data+'" download="statement-'+(statement_date.replace(/ /g, "-"))+'.csv" id="download-statement" style="display: none;">Download</a>');

$('#download-statement')[0].click();