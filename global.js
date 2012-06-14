var mount = '',
	year = '',
	make = '',
	model = '',
	style = '';

$(function(){

	// User selects mount [ Rear Mount or Front Mount]
	$(document).on('change','select.mount',function(){
		mount = $(this).val();
		if(mount.length > 0){
			getYear(mount);
		}
	});

	// User selects vehicle year
	$(document).on('change','select.year',function(){
		year = $(this).val();
		if(year.length > 0){
			getMake(mount, year);
		}
	});

	$(document).on('change','select.make',function(){
		make = $(this).val();
		if(make.length > 0){
			getModel(mount, year, make);
		}
	});

	$(document).on('change','select.model',function(){
		model = $(this).val();
		if(model.length > 0){
			getStyle(mount, year, make, model);
		}
	});
});

function getYear(mount){
	var loading = false;
	$.ajax({
		url: 'http://api.curtmfg.com/v2/GetYear?dataType=json&mount=' + mount,
		type: 'GET',
		dataType: 'json',
		success: function(data, status, xhr){
			var html = '<select class="year">';
			html += '<option value="">- Select Year -</option>';

			$.each(data,function(iterator,year){
				html += '<option>' + year + '</option>';
			});

			html += '</select>';

			$('select.mount').after(html);
		},
		error: function(xhr, status, error){
			document.write('oh snap! you messed up');
		}
	});
}

function getMake(mount, year){
	$.ajax({
		url: 'http://api.curtmfg.com/v2/GetMake?dataType=json&mount=' + mount + '&year=' + year,
		type: 'GET',
		dataType: 'json',
		success: function(data, status, xhr){
			var html = '<select class="make">';
			html += '<option value="">- Select Make -</option>';

			$.each(data,function(iterator,make){
				html += '<option>' + make + '</option>';
			});
			html += '</select>';
			$('select.year').after(html);
		},
		error: function(xhr, status, error){
			document.write('holy shit! you screwed up man!....ok maybe it was my fault :/');
		}
	});
}

function getModel(mount, year, make){
	$.ajax({
		url: 'http://api.curtmfg.com/v2/GetModel?dataType=json&mount=' + mount + '&year=' + year + '&make=' + make,
		type: 'GET',
		dataType: 'json',
		success: function(data, status, xhr){
			var html = '<select class="model">';
			html += '<option value="">- Select Model -</option>';

			$.each(data,function(iterator, model){
				html += '<option>' + model + '</option>';
			});
			html += '</select>';
			$('select.make').after(html);
		},
		error: function(xhr, status, error){
			document.write('i\'m gonna let you finish, but jQuery was the best library of the year.');
		}
	});
}

function getStyle(mount, year, make, model){
	$.ajax({
		url: 'http://api.curtmfg.com/v2/GetStyle?dataType=json&mount=' + mount + '&year=' + year + '&make=' + make + '&model=' + model,
		type: 'GET',
		dataType: 'json',
		success: function(data, status, xhr){
			var html = '<select class="style">';
			html += '<option value="">- Select Style-</option>';

			$.each(data,function(iterator, style){
				html += '<option>' + style + '</option>';
			});
			html += '</select>';
			$('select.model').after(html);
		},
		error: function(xhr, status, error){
			document.write('no style points for us');
		}
	});
}