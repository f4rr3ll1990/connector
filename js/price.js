var X = XLSX;
var global_wb;
var output;

var process_wb = (function() {
	var OUT = document.getElementById('out');
	var HTMLOUT = document.getElementById('htmlout');

	var to_json = function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result = roa;
		});
		return result;
	};

	return function process_wb(wb) {
		global_wb = wb;
		window.output = to_json(wb);

		console.log(output[0]);
		for (var i = output[0].length - 1; i >= 0; i--) {
			$('.xml_select').append(`
				<option value="${i}">${output[0][i]}</option>
			`);
		}
		

		// OUT.innerText = JSON.stringify(output, 2, 2);


		
	};
})();

var do_file = (function() {
	return function do_file(files) {
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			data = new Uint8Array(data);
			process_wb(X.read(data, {type: 'array'}));
		};
		reader.readAsArrayBuffer(f);
	};
})();







(function() {


	var xlf = document.getElementById('xlf');
	if(!xlf.addEventListener) return;

	function handleFile(e) {
	 do_file(e.target.files);
	}
	xlf.addEventListener('change', handleFile, false);


})();



$('#xml_btn_submit').click(function(){
	var name_id = $('#name_select').val();
	var price_id = $('#price_select').val();
	var model_id = $('#model_select').val();
	var quantity_id = $('#quantity_select').val();
	var manufacturer_id = $('#manufacturer_select').val();
	
	for (var i = 1; i <= output.length - 1;) {
		var data = [];
		data['name'] = (name_id != 'default') ? output[i][name_id] : "Не задано";
		data['price'] = (price_id != 'default') ? output[i][price_id] : "0";
		data['model'] = (model_id != 'default') ? output[i][model_id] : "";
		data['meta_title'] = "";
		data['keyword'] = (output[i][name_id]) ? translit((output[i][name_id]).toLowerCase()) : "";
		data['meta_description'] = "";
		data['description'] = "";
		data['price_zak'] = "0";
		data['discount_price'] = "";
		data['quantity'] = (quantity_id != 'default') ? output[i][quantity_id] : "0";
		data['stock_status_id'] = "1";
		data['discount_quantity'] = "";
		data['location'] = "";
		data['status'] = "1";
		data['manufacturer_id'] = (manufacturer_id != 'default') ? output[i][manufacturer_id] : "";    
	

		data['minimum']= "1";    
		data['substract']= "1";
		data['shipping']= "1";
		data['points']= "0";
		data['weight']= "0";
		data['weight_class_id']= "1";
		data['tax_class_id']= "0";
		data['sort_order']= "1";
		data['length']= "0";
		data['width']= "0";
		data['height']= "0";
		data['length_class_id']= "1";





		if($('#cat_select').val() != 'default') {
		
			data['category_id'] = $('#cat_select').val();
	
			var gen_cat_id = $('#cat_select').val();
			var template = seo.queryAll("seo_templates", {
				query: {category_id: gen_cat_id}
			});
				let meta_gen = {
					name: data['name'],
					model: data['model'],
					price: data['price'],
					category: $("#cat_select :selected").text()
					},
					title_template = template[0].title;
					descr_template = template[0].descr;
	
				// Ищем "a-z_"-символы между фигурных скобок
				data['meta_title'] = title_template.replace(/{\s*([a-z_]+)\s*}/ig, (_, key) => key in meta_gen ? meta_gen[key] : _);
				// Ищем "a-z_"-символы между фигурных скобок
				data['meta_description'] = descr_template.replace(/{\s*([a-z_]+)\s*}/ig, (_, key) => key in meta_gen ? meta_gen[key] : _);
	
		} else {
			data['category_id'] = "0";
		}

		console.log(data);
		addNewProduct(data);
		i++;

	}
	alert("Товары добавлены в список синхронизации!");




		// _____________________________________
});