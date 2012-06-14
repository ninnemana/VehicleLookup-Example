var mount = '',
	year = '',
	make = '',
	model = '',
	style = '';

$(function(){

	// User selects mount [ Rear Mount or Front Mount]
	$(document).on('change','select.mount',function(){
		// Reset lookup to only dislay mount
		$('select.year, select.make, select.model, select.style').remove();
		year = make = model = style = '';

		mount = $(this).val(); // Retrieve the selected mount
		if(mount.length > 0){
			getYear(mount); // Retrieve years from the API
		}
	});

	// User selects vehicle year
	$(document).on('change','select.year',function(){

		// Reset lookup to only display mount and year
		$('select.make, select.model, select.style').remove();
		make = model = style = '';

		year = $(this).val(); // Retrieve select year
		if(year.length > 0){
			getMake(mount, year); // Get vehicle makes from the API
		}
	});

	// User selects vehicle make
	$(document).on('change','select.make',function(){

		// Reset the lookup to only display mount, year, and make
		$('select.model, select.style').remove();
		model = style = '';

		make = $(this).val(); // Retrieve selected make
		if(make.length > 0){
			getModel(mount, year, make); // Get vehicle models from the API
		}
	});

	// User select vehicle model
	$(document).on('change','select.model',function(){

		// Reset the lookup to only display mount, year, make, and model
		$('select.style').remove();
		style = '';

		model = $(this).val(); // Retrieve the selected model
		if(model.length > 0){
			getStyle(mount, year, make, model); // Get the vehicle styles from the API
		}
	});

	// User selects vehicle style
	$(document).on('change','select.style',function(){
		// Remove part results
		$('div.part').remove();

		style = $(this).val(); // Retrieve the selected style
		if(style.length > 0){
			getParts(mount, year, make, model, style); // Get the parts that match the current vehicle configuration
		}
	});

	// Handle the search submission
	$(document).on('click','div.search-box button',function(e){
		e.preventDefault();
		var query = $('div.search-box input[type=search]').val();
		search(query);
	});

	// Get Parent Categories
	getParents();
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

function getParts(mount, year, make, model, style){
	var url = 'http://api.curtmfg.com/v2/GetParts?dataType=json';
	url += '&mount=' + encodeURIComponent(mount);
	url += '&year=' + encodeURIComponent(year);
	url += '&make=' + encodeURIComponent(make);
	url += '&model=' + encodeURIComponent(model);
	url += '&style=' + encodeURIComponent(style);
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function(data, status, xhr){
			$.each(data,function(iterator, part){
				var html = displayPart(part);
				$('section.content').append(html);
			});
		},
		error: function(xhr, status, error){
			document.write('holy wow batman! we hit da errors.');
		}
	});
}

function getPart(id, callback){
	var url = 'http://api.curtmfg.com/v2/GetPart?dataType=json';
	url += '&partID=' + id;
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function(data, status, xhr){
			if(data !== undefined && data.partID !== undefined){
				callback(data);
			}else{
				callback({});
			}
		},
		error: function(xhr, status, error){
			callback({});
		}
	});
}

function search(query){
	var url = 'http://api.curtmfg.com/v2/Search?dataType=json';
	url += '&search_term=' + query;
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		beforeSend: function(){
			$('section.content').html('<h4>We\'re searching for your results</h4>');
		},
		success: function(data,status,xhr){
			$('section.content').html('');
			if(data.length === 0){
				$('section.content').html('<h4>Sorry we couldn\'t find any results for your query');
			}
			
			$.each(data,function(iterator, result){
				if(result.partID !== null){
					getPart(result.partID,function(part){
						if(part.partID !== undefined){
							var html = displayPart(part);
							$('section.content').append(html);
						}
					});
				}
			});
		},
		error: function(xhr, status, error){
			$('section.content').text('aw buddy, i\'m sorry. we went ahead and screwed this one up for you!');
		}
	});
}

function displayPart(part){
	var partID = part.partID,
		desc = part.shortDesc,
		price = part.listPrice,
		html = '',
		img_arr = [];

	$.each(part.images,function(pi_iterator, image){
		if(image.size === 'Grande' && image.sort === 'a'){
			img = image.path;
		}else if(image.size === 'Grande' && image.sort !== 'a'){
			img_arr.push(image.path);
		}
	});

	html = '<div class="part">';
	html += '<h2>' + desc + '</h2>';
	html += '<p>Part #' + partID + '</p>';

	html += '<div class="img-container">';
	html += '<img src="' + img + '" class="primary" />';
	if(img_arr.length > 0){
		html += '<div class="sub-images">';
			$.each(img_arr,function(img_iterator, sub){
				html += '<img src="' + sub + '" class="sub" />';
			});
		html += '</div>';
	}
	html += '</div>';

	html += '<div class="attributes">';
	$.each(part.attributes,function(i, attr){
		html += '<p><strong>' + attr.key + '</strong> ' + attr.value + '</p>';
	});
	html += '</div>';

	html += '<div class="pricing">';
	html += '<span class="price">' + price + '</span>';
	html += '<button>Buy Me</button>';
	html += '</div>';

	html += '<div class="clearfix"></div>';
	html += '</div>';

	return html;
}

function getParents(){
	var url = 'http://api.curtmfg.com/v2/GetParentCategories?dataType=json';
	$.ajax({
		url: url,
		type: 'GET',
		dataType:'json',
		success:function(data, status, xhr){
			$.each(data,function(iterator,parent){
				var html = '<div class="category">';


				html += '</div>';

			});
		},
		error: function(xhr, status, error){
			$('section.content').html('<span>Bummer, we couldn\'t get any categories');
		}
	});
}



