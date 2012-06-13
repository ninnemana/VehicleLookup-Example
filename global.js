var configr = {};

$(function(){

	// User selects mount [ Rear Mount or Front Mount]
	$(document).on('change','select.mount',function(){
		configr.mount = $(this).val();
		if(configr.mount.length > 0){
			configr.getYear();
		}
	});

	// User selects vehicle year
	$(document).on('change','select.year',function(){
		configr.year = $(this).val();
		if(configr.year.length > 0){
			configr.getMake();
		}
	});

	$(document).on('change','select.make',function(){
		configr.make = $(this).val();
		if(configr.make.length > 0){
			configr.getModel();
		}
	});

	$(document).on('change','select.model',function(){
		configr.model = $(this).val();
		if(configr.model.length > 0){
			configr.getStyle();
		}
	});
});

configr = {
	mount: '',
	year: '',
	make: '',
	model: '',
	style: '',
	getYear: function(){
		var loading = false;
		$.ajax({
			url: 'http://api.curtmfg.com/v2/GetYear?dataType=json&mount=' + this.mount,
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
	},
	getMake: function(){
		$.ajax({
			url: 'http://api.curtmfg.com/v2/GetMake?dataType=json&mount=' + this.mount + '&year=' + this.year,
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
	},
	getModel: function(){
		$.ajax({
			url: 'http://api.curtmfg.com/v2/GetModel?dataType=json&mount=' + this.mount + '&year=' + this.year + '&make=' + this.make,
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
	},
	getStyle: function(){
		$.ajax({
			url: 'http://api.curtmfg.com/v2/GetStyle?dataType=json&mount=' + this.mount + '&year=' + this.year + '&make=' + this.make + '&model=' + this.model,
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
};