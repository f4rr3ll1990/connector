/* ---------------------------------------------- /*
______      _       ______                  _____      _ _   
|  _  \    | |      | ___ \                |_   _|    (_) |  
| | | |__ _| |_ __ _| |_/ / __ _ ___  ___    | | _ __  _| |_ 
| | | / _` | __/ _` | ___ \/ _` / __|/ _ \   | || '_ \| | __|
| |/ / (_| | || (_| | |_/ / (_| \__ \  __/  _| || | | | | |_ 
|___/ \__,_|\__\__,_\____/ \__,_|___/\___|  \___/_| |_|_|\__|
/* ---------------------------------------------- */
var lib = new localStorageDB("productsDB", localStorage);
var seo = new localStorageDB("seoDB", localStorage);
if (lib.isNew()) {
    // create tables
    lib.createTable("products", ["category_id", "product_id", "name", "meta_title", "meta_description", "model", "manufacturer_id", "status", "quantity", "price", "price_zak", "discount_quantity", "discount_price"]);
    lib.createTable("categories", ["category_id", "name", "parent_id", "parrent_catname"]);
    lib.createTable("cheque", ["category_id", "product_id", "name", "model", "quantity", "price", "price_zak", "discount_quantity", "discount_price"]);
    lib.createTable("sync_table", ["product_id", "name", "meta_title", "meta_description", "model", "quantity", "price", "price_zak", "discount_quantity", "discount_price"]);
    lib.createTable("orders_table", ["order_id", "email", "telephone", "payment_address_1", "payment_city", "payment_postcode", "customer", "status", "total", "shipping_method", "date_added"]);
    lib.createTable("order_products", ["order_id", "product_id", "name", "model", "quantity"]);
    lib.createTable("new_products", ["name","meta_title","meta_description","description","category_id","main_category","model","image","keyword",'price','price_zak',"quantity","stock_status_id","location","status","manufacturer_id","minimum","substract","shipping","points","weight","weight_class_id","tax_class_id","sort_order","pr_length","width","height","length_class_id","discount_price","discount_quantity"]);
    lib.createTable("manufacturers", ["manufacturer_id", "name",]);
    // опции
    lib.createTable("product_options", ["product_option_id", "name"]);
    // значения опций
    lib.createTable("option_values", ["option_value_id", "name", "product_option_id"]);

    // соотношение товаров к опциям
    lib.createTable("option_to_product", ["product_id", "product_option_id", "option_value_id", "quantity", "price"]);

    lib.createTable("option_upate", ["product_option_value_id", "product_id", "quantity"]);


    lib.commit();
    localStorage.setItem('rept', '');
    localStorage.setItem('init_model', 'false');
}; //END createTable
if (seo.isNew()) {
    seo.createTable("seo_templates", ["category_id", "title", "descr"]); //  , "h1"
    seo.commit();
}
/* ---------------------------------------------- /*
 * !Инициализация БД
/* ---------------------------------------------- */