/* ---------------------------------------------- /*
  ___     ___  ___  __   __
 / _ \   |_  |/ _ \ \ \ / /
/ /_\ \    | / /_\ \ \ V / 
|  _  |    | |  _  | /   \ 
| | | |/\__/ / | | |/ /^\ \
\_| |_/\____/\_| |_/\/   \/
/* ---------------------------------------------- */







//  редактирование товара
function syncChanges(data) {
    $.ajax({
        type: "POST",
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/syncProducts",
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);
        }
    });
}
// 

//  создание товара
function addProducts(data) {
    $.ajax({
        type: "POST",
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/add",
        data: data,
        dataType: 'json',
        success: function(json) {
            console.log(json);

        }
    });
}
// 

// Удаление товара
function deleteProduct(product_id) {
    var data = {};
    data['product_id'] = product_id;

    $.ajax({
        type: "POST",
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/delProduct",
        data: data,
        dataType: 'json',
        success: function(json) {
            
            console.log(json);
        }
    });
}
// 

// Дублирование товара
function duplicateProduct(product_id) {
    var data = {};
    data['product_id'] = product_id;

    $.ajax({
        type: "POST",
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/duplicateProduct",
        data: data,
        dataType: 'json',
        success: function(json) {
            
            console.log(json);
        }
    });
}
// 

// 


// 
function setOrderStatus(order_id, order_status) {
    var data = {};
    data['order_id'] = order_id;
    data['status'] = order_status;

    $.ajax({
        type: "POST",
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/editOrderStatus",
        data: data,
        dataType: 'json',
        success: function(json) {
            alert(json);
        }
    });
}
// 

// Опции товара

function getProductOptions(product_id) {
    var data = {};
    
    data['product_id'] = product_id;

    $.ajax({
        type: "POST",
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/getProductOptions",
        data: data,
        dataType: 'json',
        async: false,
        success: function(json) {
            console.log(json['product_options']);
            var res = json['product_options'];            
            for(a in res) {
                var ids = res[a].product_option_value;
                for(i in ids) { 
                    console.log(product_id);                    
                    console.log(res[a].product_option_id);
                    console.log(ids[i].option_value_id);
                    console.log(ids[i].quantity);
                    console.log(ids[i].price);
                                       
                    lib.insert("option_to_product", {
                        product_id: product_id,
                        product_option_id: res[a].option_id,
                        option_value_id: ids[i].option_value_id,
                        quantity: ids[i].quantity,
                        price: ids[i].price
                    });                    
                }  
            }
            lib.commit();
        },
        error: function() {
            alert( "error" );
        }
    });
}
// 



// Обновление опции
function updateProductOptions(data) {
    $.ajax({
        url: "http://1092418.pi271258.web.hosting-test.net/index.php?route=connector/connector/syncProductOptions",
        type: "post",
        data: data,
        dataType: "json",
        success: function (json) {

        } //succsess
    }); //ajax
}
// 



/* ---------------------------------------------- /*
 * !AJAX 
/* ---------------------------------------------- */
