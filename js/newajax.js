/* ---------------------------------------------- /*
  ___     ___  ___  __   __
 / _ \   |_  |/ _ \ \ \ / /
/ /_\ \    | / /_\ \ \ V / 
|  _  |    | |  _  | /   \ 
| | | |/\__/ / | | |/ /^\ \
\_| |_/\____/\_| |_/\/   \/
/* ---------------------------------------------- */

async function ajaxGet(data, url) {
    return $.ajax({

        url: localStorage.getItem('settings_url') + '/index.php?route=connector/' + localStorage.getItem('settings_key') + '/' + url + '/',
        type: "post",
        dataType: "json",
        data: data
    }); //ajax

}
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Получение товаров
async function getProducts() {

    var json = "";
    var urlajax = "getProductsAjax";

    var json = await ajaxGet('', urlajax);

    lib.deleteRows("products"); //очищаем таблицу перед синхронизацией
    if (json.length > 0) {
        for (var key in json) {
            lib.insert("products", {
                category_id: json[key].category_id,
                product_id: json[key].product_id,
                name: json[key].name,
                manufacturer_id: json[key].manufacturer_id,
                status: json[key].status,
                meta_title: json[key].meta_title,
                meta_description: json[key].meta_description,
                model: json[key].model,
                quantity: json[key].quantity,
                price: json[key].price,
                price_zak: json[key].price_zak,
                discount_quantity: json[key].discount_quantity,
                discount_price: json[key].discount_price
            });
            //   Product_options
            //getProductOptions(json[key].product_id);
        } //for

    } //if

    lib.commit();

}
// 
// __________________________________________________________________________________________________


// __________________________________________________________________________________________________
// Получение категорий
async function getCategories() {
    var json = "";
    var urlajax = "getCategoriesAjax";
    var json = await ajaxGet('', urlajax);

    lib.deleteRows("categories"); //очищаем таблицу перед синхронизацией


    for (var key in json) {

        if (json[key].parent_id) {
            var current_parrentid = json[key].parent_id;
            for (var cat in json) {
                if (json[cat].category_id == current_parrentid) {
                    var parrent_catname = json[cat].name;
                }
            }
        }

        if (parrent_catname == null) {
            parrent_catname = "#";
        }
        lib.insert("categories", {
            category_id: json[key].category_id,
            name: unescape(json[key].name),
            parent_id: json[key].parent_id,
            parrent_catname: parrent_catname
        });
    } //for



    lib.commit();
}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Получение брендов
async function getManufacturers() {

    var json = "";
    var urlajax = "getManufacturersAjax";

    var json = await ajaxGet('', urlajax);


    lib.deleteRows("manufacturers"); //очищаем таблицу перед синхронизацией

    if (json.length > 0) {
        for (var key in json) {
            lib.insert("manufacturers", {
                manufacturer_id: json[key].manufacturer_id,
                name: unescape(json[key].name)
            });
        } //for

    } //if

    lib.commit();

}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Получение заказов
async function getOrders() {

    var json = "";
    var urlajax = "getOrderList";

    var json = await ajaxGet('', urlajax);

    lib.deleteRows("orders_table"); //очищаем таблицу перед синхронизацией

    if (json.length > 0) {
        for (var key in json) {

            lib.insert("orders_table", {
                order_id: json[key].order_id,
                email: json[key].email,
                telephone: json[key].telephone,
                payment_address_1: json[key].payment_address_1,
                payment_city: json[key].payment_city,
                payment_postcode: json[key].payment_postcode,
                customer: unescape(json[key].customer),
                status: json[key].status,
                total: json[key].total,
                shipping_method: json[key].shipping_method,
                date_added: json[key].date_added
            });
        } //for

    } //if
    lib.commit();

}
//
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Товары из заказов
async function getOrderProducts() {
    var json = "";
    var urlajax = "getOrderProducts";

    var json = await ajaxGet('', urlajax);

    lib.deleteRows("order_products"); //очищаем таблицу перед синхронизацией
    if (json.length > 0) {
        for (var key in json) {
            lib.insert("order_products", {
                order_id: json[key].order_id,
                product_id: json[key].product_id,
                name: json[key].name,
                model: json[key].model,
                quantity: json[key].quantity
            });
        } //for

    } //if

    lib.commit();


}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Опции
async function getOptions() {
    var json = "";
    var urlajax = "getOptions";

    var json = await ajaxGet('', urlajax);

    lib.deleteRows("product_options"); //очищаем таблицу перед синхронизацией

    if (json.length > 0) {
        for (key in json) {

            lib.insert("product_options", {
                product_option_id: json[key].option_id,
                name: unescape(json[key].name)
            });


        } //for

    } //if

    lib.commit();

}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Значения опций
async function getOptionValues() {

    var json = "";
    var urlajax = "getOptionValues";

    var json = await ajaxGet('', urlajax);
    lib.deleteRows("option_values"); //очищаем таблицу перед синхронизацией
    if (json.length > 0) {
        for (key in json) {

            lib.insert("option_values", {
                option_value_id: json[key].option_value_id,
                name: unescape(json[key].name),
                product_option_id: json[key].option_id
            });

            lib.commit();
        } //for

    } //if
}
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________




// __________________________________________________________________________________________________

// __________________________________________________________________________________________________

//  редактирование товара
async function syncChanges(data) {

    var json = "";
    var urlajax = "syncProducts";

    ajaxGet(data, urlajax);

}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
//  создание товара
async function addProducts(data) {
    var json = "";
    var urlajax = "add";

    ajaxGet(data, urlajax);
}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Удаление товара
async function deleteProduct(product_id) {
    var data = {};
    data['product_id'] = product_id;
    var json = "";
    var urlajax = "delProduct";

    ajaxGet(data, urlajax);
}
//
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Дублирование товара
async function duplicateProduct(product_id) {
    var data = {};
    data['product_id'] = product_id;
    var urlajax = "duplicateProduct";

    ajaxGet(data, urlajax);
}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Изменить статус заказа
async function setOrderStatus(order_id, order_status) {
    var data = {};
    data['order_id'] = order_id;
    data['status'] = order_status;
    var urlajax = "editOrderStatus";

    ajaxGet(data, urlajax);
}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Опции товара
async function getProductOptions(product_id) {
    var data = {};
    data['product_id'] = product_id;
    var urlajax = "getProductOptions";
    var json = await ajaxGet(data, urlajax);

    var res = json['product_options'];
    lib.deleteRows("option_to_product", {
        product_id: product_id
    });
    for (a in res) {
        var ids = res[a].product_option_value;
        for (i in ids) {
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

    renderOptions(product_id);
}
// 
// __________________________________________________________________________________________________

// __________________________________________________________________________________________________
// Обновление опции
async function updateProductOptions(data) {
    var urlajax = "syncProductOptions";

    ajaxGet(data, urlajax);
}
// 
// __________________________________________________________________________________________________






/* ---------------------------------------------- /*
 * !AJAX 
/* ---------------------------------------------- */