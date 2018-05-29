/* ---------------------------------------------- /*
  ___              _ _           _   _               _____      _ _   
 / _ \            | (_)         | | (_)             |_   _|    (_) |  
/ /_\ \_ __  _ __ | |_  ___ __ _| |_ _  ___  _ __     | | _ __  _| |_ 
|  _  | '_ \| '_ \| | |/ __/ _` | __| |/ _ \| '_ \    | || '_ \| | __|
| | | | |_) | |_) | | | (_| (_| | |_| | (_) | | | |  _| || | | | | |_ 
\_| |_/ .__/| .__/|_|_|\___\__,_|\__|_|\___/|_| |_|  \___/_| |_|_|\__|
      | |   | |                                                       
      |_|   |_|
/* ---------------------------------------------- */

// Развернуть окно на весь экран
require('nw.gui').Window.get().maximize();

$(document).ready(function () {

    /*  categories */
    categoriesLoad();
    categoriesSeotmpLoad();

    /*  products */
    productsLoad();

    // manufacturers
    manufacturer_filterLoad();
    manufacturersLoad();

    /*  orders  */
    ordersLoad();

    /* Initialise the DataTable */
    var oTable = $('#tableWrap').dataTable({
        "oLanguage": {
            "sSearch": "Поиск:",
            "lengthMenu": "Показать:"
        },
        "iDisplayLength": 15,
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bFilter": true,
    });
    /* END DataTable */
    $('a[href="#products"]').tab('show');

    // 
    $('#mainTab li:first-child a').tab('show');
    // 
    $('#checkForUpdates').click(function () {
        checkForUpdates();
    });
    // Скрываем прелоадер
    $('#status').fadeOut();
    $('#preloader').delay(300).fadeOut('slow');
});

/* ---------------------------------------------- /*
 * !Инициализация Приложения
/* ---------------------------------------------- */




/* ---------------------------------------------- /*
___  ___      _        ______                _   _                 
|  \/  |     (_)       |  ___|              | | (_)                
| .  . | __ _ _ _ __   | |_ _   _ _ __   ___| |_ _  ___  _ __  ___ 
| |\/| |/ _` | | '_ \  |  _| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
| |  | | (_| | | | | | | | | |_| | | | | (__| |_| | (_) | | | \__ \
\_|  |_/\__,_|_|_| |_| \_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
/* ---------------------------------------------- */
// Загрузка товаров в таблицу
function productsLoad() {
    /*  products */
    var products = lib.queryAll("products");
    var j = 0;
    while (j <= products.length - 1) {
        $('#tablebody').append(`
      <tr class="product-wrap ${products[j].category_id}" id="${products[j].product_id}">
          <td style="display:none;">${products[j].category_id}</td>
          <td style="display:none;">${products[j].manufacturer_id}</td>
          <td style="display:none;">${products[j].status}</td>
          <td class="product-id">
            <input type="checkbox" class="product_id-checkbox" value="${products[j].product_id}"/> ${products[j].product_id}            
          </td>
          <td class="product-row_item product-name">${products[j].name}</td>
          <td class="product-model"><button class="assoc_init btn btn-info" data-model="${products[j].model}"><i class="fa fa-anchor" aria-hidden="true"></i> ${products[j].model}</button></td>
          <td class="product-row_item product-quantity">${products[j].quantity}</td>
          <td class="product-row_item product-price">${products[j].price}</td>
          <td class="product-row_item product-price_zak">${products[j].price_zak}</td>
          <td class="product-row_item product-discount_quantity">${products[j].discount_quantity}</td>
          <td class="product-row_item product-discount_price">${products[j].discount_price}</td>
      </tr>
     `);
        j++;
    } //while
}

// Загрузка категорий в фильтр
function categoriesLoad() {
    /*  categories */
    var categories = lib.queryAll("categories");
    var k = 0;
    while (k <= categories.length - 1) {
        $('#mySelect').append(`
        <option value="${categories[k].category_id }">${categories[k].parrent_catname} - ${categories[k].name}</option>
    `);

        $('#add_product-category').append(`
        <option value="${categories[k].category_id }">${categories[k].parrent_catname} - ${categories[k].name}</option>
    `);

        $('#cat_select').append(`
        <option value="${categories[k].category_id }">${categories[k].parrent_catname} - ${categories[k].name}</option>
    `);

        k++;
    } //while
}
// 
// Загрузка производителей в фильтр
function manufacturer_filterLoad() {
    var manufacturers = lib.queryAll("manufacturers");
    var m = 0;
    while (m <= manufacturers.length - 1) {
        $('#manufacturersSelect').append(`
        <option value="${manufacturers[m].manufacturer_id }">${manufacturers[m].name}</option>
    `);
        m++;
    } //while
}
// 

// Загрузка категорий в Редактор СЕО шаблонов
function categoriesSeotmpLoad() {
    /*  categories */
    var categories = lib.queryAll("categories");
    var d = 0;
    while (d <= categories.length - 1) {
        $('#seotmpbody').append(`
        <tr class="seocat_row" data-catid="${categories[d].category_id}">
            <td class="">${categories[d].category_id}</td>
            <td class="">${categories[d].parrent_catname} - ${categories[d].name}</td>
        </tr>
    `);


        d++;
    } //while
}
// 

// Загрузка брендов
function manufacturersLoad() {
    /*  categories */
    var manufacturers = lib.queryAll("manufacturers");
    var m = 0;
    while (m <= manufacturers.length - 1) {
        $('#add_product-manufacturer').append(`
            <option value="${manufacturers[m].manufacturer_id }">${manufacturers[m].name}</option>
        `);
        $('#manufacturerbody').append(`
            <tr>
                <th>${manufacturers[m].name}&nbsp&nbsp-&nbsp&nbsp</th>
                <th>${manufacturers[m].manufacturer_id }</th>
            </tr>
        `);
        m++;
    } //while
}
// 

// Загрузка заказов
function ordersLoad() {
    /*  products */
    var orders = lib.queryAll("orders_table");
    var j = 0;
    while (j <= orders.length - 1) {
        $('#orderbody').append(`
      <tr class="orders-wrap">
        <td class="order-row_item">
            <button class="btn btn-info order-products-button" data-orderid="${orders[j].order_id}">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i> ${orders[j].order_id}
            </button>
        </td>  
        <td class="order-row_item">${orders[j].customer}</td>
        <td class="order-row_item">${orders[j].status}</td>
        <td class="order-row_item">${orders[j].email}</td>
        <td class="order-row_item">${orders[j].telephone}</td>
        <td class="order-row_item">${orders[j].total}</td>
        <td class="order-row_item">${orders[j].date_added}</td>
      </tr>
     `);
        j++;
    } //while
}
// 

// Загрузка опций товара
function renderOptions(productID) {
    $('#options').html('');
    var html = "";
    var product_options = lib.queryAll("option_to_product", {
        query: {
            product_id: productID
        }
    });
    for (o in product_options) {

        var option = lib.queryAll("option_values", {
            query: {
                option_value_id: product_options[o].option_value_id
            }
        });
        html += `
        <div class="col-sm-2">
            <div class="input-group">
                <span class="input-group-addon">${option[0].name}</span>
                <input type="text" class="form-control input-option_quantity" data-valueid="${product_options[o].option_value_id}" value="${product_options[o].quantity}">
            </div>

        </div>
        `;
    }
    $('#options').html(html);
}
// 

// 
function orderProductsLoad(order_id) {
    $('#order_products_list').html("");
    $('#order_details').html("");
    $('#order_product_footer').html("");
    $('#order_products_body').html("");
    $('#order-print-cheque').data("orderprintid", order_id);
    openModalWindow('#order_product_modal');

    var products = lib.queryAll("order_products", {
        query: {
            order_id: order_id
        }
    });

    var order = lib.queryAll("orders_table", {
        query: {
            order_id: order_id
        }
    });

    var k = 0;
    while (k <= products.length - 1) {
        $('#order_products_body').append(`
        <tr class="orders-wrap"> 
            <td class="order-row_item">${products[k].product_id}</td>
            <td class="order-row_item">${products[k].name}</td>
            <td class="order-row_item">${products[k].model}</td>
            <td class="order-row_item">${products[k].quantity}</td>
        </tr>
    `);
        k++;
    } //while


    $('#summ').html(`
        <strong>Итого: ${order[0].total + 'р.'}</strong>        
    `);


    $('#order_details').append(`
        <div class="panel panel-default">
            <div class="panel-heading">Имя:</div>
            <div class="panel-body">
            ${order[0].customer}
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Телефон:</div>
            <div class="panel-body">
            ${order[0].telephone}
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Email:</div>
            <div class="panel-body">
            ${order[0].email}
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Доставка:</div>
            <div class="panel-body">
            ${order[0].shipping_method}
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Город:</div>
            <div class="panel-body">
            ${order[0].payment_city}
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">Адрес:</div>
            <div class="panel-body">
            ${order[0].payment_address_1}
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading"><i class="fa fa-question-circle" aria-hidden="true"></i> Статус заказа</div>
            <div class="input-group col-sm-6">                
                <div class="input-group-btn">
                    <button type="button" class="btn btn-default" id="order-status_button" data-orderbtnid="0" data-oid="${order[0].order_id}">${order[0].status}</button>
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="caret"></span> <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li><a href="#" class="order_status_item" data-orderstatusitemid="1">Ожидание</a></li>
                        <li><a href="#" class="order_status_item" data-orderstatusitemid="2">В обработке</a></li>
                        <li><a href="#" class="order_status_item" data-orderstatusitemid="5">Сделка завершена</a></li>
                        <li><a href="#" class="order_status_item" data-orderstatusitemid="9">Отмена и аннулирование</a></li>
                    </ul>
                </div>
            </div>
        </div>


        
    `);

    $('#order_product_footer').append(`
        <button class="btn btn-info" id="show_printpost">Отправка</button>
        <button class="btn btn-info" id="order-print-cheque" data-orderprintid="${order[0].order_id}"><i class="fa fa-print" aria-hidden="true"></i> Добавить в чек</button>
    `);

    // Посылка
    $('#sender-name').text(localStorage.getItem('settings_seller'));
    $('#sender-adress').text(localStorage.getItem('settings_addr'));
    $('#sender-index').text(localStorage.getItem('settings_index'));

    $('#res-name').text(order[0].customer);
    $('#res-adress').text("г." + order[0].payment_city + ", " + order[0].payment_address_1);
    $('#res-index').text(order[0].payment_postcode);

}
// 

// ДОбавление товара в синхронизацию
function massInsertSync(this_id, this_name, this_title, this_descr, this_model, this_quantity, this_price, this_price_zak, this_discount_quantity, this_discount_price) {
    lib.insertOrUpdate("sync_table", {
        product_id: this_id
    }, {
        product_id: this_id,
        name: this_name,
        meta_title: this_title,
        meta_description: this_descr,
        model: this_model,
        quantity: this_quantity,
        price: this_price,
        price_zak: this_price_zak,
        discount_quantity: this_discount_quantity,
        discount_price: this_discount_price
    });
}
// 

function addNewProduct(data) {
    lib.insert("new_products", {
        name: data['name'],
        meta_title: data['meta_title'],
        meta_description: data['meta_description'],
        description: data['description'],
        category_id: data['category_id'],
        main_category: "1",
        model: data['model'],
        image: data['image'],
        keyword: data['keyword'],
        price: data['price'],
        price_zak: data['price_zak'],
        quantity: data['quantity'],
        stock_status_id: data['stock_status_id'],
        location: data['location'],
        status: data['status'],
        manufacturer_id: data['manufacturer_id'],
        minimum: data['minimum'],
        substract: data['substract'],
        shipping: data['shipping'],
        points: data['points'],
        weight: data['weight'],
        weight_class_id: data['weight_class_id'],
        tax_class_id: data['tax_class_id'],
        sort_order: data['sort_order'],
        pr_length: data['length'],
        width: data['width'],
        height: data['height'],
        length_class_id: data['length_class_id'],
        discount_price: data['discount_price'],
        discount_quantity: data['discount_quantity']
    });
    lib.commit();

}

// Редактирование связанных товаров
function massAssociatedSync(assoc_model) {

    var box_arr = new Array();
    var box_arr = lib.queryAll("products", {
        query: {
            model: assoc_model
        }
    });
    var b = 0;
    while (b <= box_arr.length - 1) {
        var this_id = box_arr[b].product_id;
        massValidate(this_id);
        b++;
    }
    lib.commit();

}
// 

// 
function massValidate(validate_id) {


    var box_model = $('#mass_model').val();
    var box_quantity = $('#mass_quantity').val();
    var box_price = $('#mass_price').val();
    var box_price_zak = $('#mass_price_zak').val();
    var box_discount_quantity = $('#mass_discount_quantity').val();
    var box_discount_price = $('#mass_discount_price').val();


    var this_box_id = validate_id;

    var box_arr = new Array();
    var box_arr = lib.queryAll("products", {
        query: {
            product_id: this_box_id
        }
    });

    var this_box_name = box_arr[0].name;
    console.log(this_box_name);


    var this_box_descr = box_arr[0].meta_description;
    var apply_titles = $('#apply_generate_titles:checked').val();
    console.log("apply_titles: " + apply_titles);

    if ($('#apply_generate_titles:checked').val() !== undefined) {

        var li_selected = $('.titlecenter_selected').attr("data-titlecenter");
        console.log("li_selected: " + li_selected);
        $('#button_titlemain').attr("data-titlemain", li_selected);


        var selected = $('#button_titlemain').attr("data-titlemain");
        console.log("selected: " + selected);
        var pre = $('#pre_title').val();
        console.log("pre: " + pre);
        if (selected == "name") {
            var main = this_box_name;
        }
        if (selected == "title") {
            var main = box_arr[0].meta_title;
        }
        if (selected == "") {
            var main = "";
        }
        var aft = $('#after_title').val();
        console.log("aft: " + aft);

        var this_box_title = pre + main + aft;

    } else {
        var this_box_title = box_arr[0].meta_title;
    }
    console.log("Генерируемый тайтл: " + this_box_title);

    if ($('#apply_generate_descr:checked').val() !== undefined) {

        var lidescr_selected = $('.descrcenter_selected').attr("data-descrcenter");
        console.log("lidescr_selected: " + lidescr_selected);
        $('#button_descrmain').attr("data-descrmain", lidescr_selected);


        var descrselected = $('#button_descrmain').attr("data-descrmain");
        console.log("descrselected: " + descrselected);
        var descrpre = $('#pre_descr').val();
        console.log("descrpre: " + descrpre);
        if (descrselected == "name") {
            var descrmain = this_box_name;
        }
        if (descrselected == "descr") {
            var descrmain = box_arr[0].meta_description;
        }
        if (descrselected == "") {
            var descrmain = "";
        }
        var descraft = $('#after_descr').val();
        console.log("descraft: " + descraft);

        var this_box_descr = descrpre + descrmain + descraft;

    } else {
        var this_box_descr = box_arr[0].meta_description;
    }
    console.log("Генерируемый дескрипшн: " + this_box_descr);

    if (box_model == 'не менять') {
        this_box_model = box_arr[0].model;
    } else {
        this_box_model = box_model;
    }
    if (box_quantity == 'не менять') {
        this_box_quantity = box_arr[0].quantity;
    } else {
        this_box_quantity = box_quantity;
    }

    console.log("цена перед if: " + box_price);

    if (box_price == "не менять") {
        this_box_price = box_arr[0].price;
    } else {
        this_box_price = box_price;
    }
    console.log("цена после if: " + this_box_price);

    if (box_price_zak == "не менять") {
        this_box_price_zak = box_arr[0].price_zak;
    } else {
        this_box_price_zak = box_price_zak;
    }
    console.log("ценаZAK после if: " + this_box_price_zak);

    if (box_discount_quantity == "не менять") {
        this_box_discount_quantity = box_arr[0].discount_quantity;
    } else {
        this_box_discount_quantity = box_discount_quantity;
    }
    if (box_discount_price == "не менять") {
        this_box_discount_price = box_arr[0].discount_price;
    } else {
        this_box_discount_price = box_discount_price;
    }

    box_arr = false;
    massInsertSync(this_box_id, this_box_name, this_box_title, this_box_descr, this_box_model, this_box_quantity, this_box_price, this_box_price_zak, this_box_discount_quantity, this_box_discount_price);

}

// 
function massQueryInputs() {

    //получение ID из чекбоксов 
    var boxes = new Array();
    boxes = $("input[class='product_id-checkbox']:checked");

    var j = 0;
    while (j <= boxes.length - 1) {

        console.log(boxes[j].value);

        var this_box_id = boxes[j].value;

        massValidate(this_box_id);

        j++;

    };

    lib.commit();
}
// 

// 
function initDelete() {
    //получение ID из чекбоксов 
    var boxes = new Array();
    boxes = $("input[class='product_id-checkbox']:checked");

    var j = 0;
    while (j <= boxes.length - 1) {

        console.log(boxes[j].value);

        var product_id = boxes[j].value;

        deleteProduct(product_id);

        j++;

    };

    lib.commit();
}
// 

// 
function initDuplicate() {
    //получение ID из чекбоксов 
    var boxes = new Array();
    boxes = $("input[class='product_id-checkbox']:checked");

    var j = 0;
    while (j <= boxes.length - 1) {

        console.log(boxes[j].value);

        var product_id = boxes[j].value;

        duplicateProduct(product_id);

        j++;

    };

    lib.commit();
}
// 


// Открытие окна
function openModalWindow(modal_selector) {
    console.log('Open modal:' + modal_selector);
    $('#overlay').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
        function () { // пoсле выпoлнения предъидущей aнимaции
            $(modal_selector)
                .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                .animate({
                    opacity: 1,
                    top: '50%'
                }, 200); //'появляем' окно
            var modal_height = $(modal_selector).height();
            var height_offset = (modal_height - (modal_height * 2)) / 2;
            var modal_width = $(modal_selector).width();
            var width_offset = (modal_width - (modal_width * 2)) / 2;
            $(modal_selector)
                .css('margin-top', height_offset)
                .css('margin-left', width_offset);
        }
    );
}

// Закрытие окна
function closeModalWindow() {
    $('.modal_window')
        .animate({
                opacity: 0,
                top: '45%'
            }, 200, // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
            function () { // пoсле aнимaции
                $(this).css('display', 'none'); // делaем ему display: none;
                $('#overlay').fadeOut(400); // скрывaем пoдлoжку
            }
        );
}

// 

// Транслитерация SEO URL
function translit(text) {
    // Символ, на который будут заменяться все спецсимволы
    var space = '-';


    // Массив для транслитерации
    var transl = {
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ё': 'e',
        'ж': 'zh',
        'з': 'z',
        'и': 'i',
        'й': 'j',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'h',
        'ц': 'c',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'sh',
        'ъ': space,
        'ы': 'y',
        'ь': space,
        'э': 'e',
        'ю': 'yu',
        'я': 'ya',
        ' ': space,
        '_': space,
        '`': space,
        '~': space,
        '!': space,
        '@': space,
        '#': space,
        '$': space,
        '%': space,
        '^': space,
        '&': space,
        '*': space,
        '(': space,
        ')': space,
        '-': space,
        '\=': space,
        '+': space,
        '[': space,
        ']': space,
        '\\': space,
        '|': space,
        '/': space,
        '.': space,
        ',': space,
        '{': space,
        '}': space,
        '\'': space,
        '"': space,
        ';': space,
        ':': space,
        '?': space,
        '<': space,
        '>': space,
        '№': space
    }

    var result = '';
    var curent_sim = '';

    for (i = 0; i < text.length; i++) {
        // Если символ найден в массиве то меняем его
        if (transl[text[i]] != undefined) {
            if (curent_sim != transl[text[i]] || curent_sim != space) {
                result += transl[text[i]];
                curent_sim = transl[text[i]];
            }
        }
        // Если нет, то оставляем так как есть
        else {
            result += text[i];
            curent_sim = text[i];
        }
    }

    result = TrimStr(result);

    // Выводим результат 
    return result;

}

function TrimStr(s) {
    s = s.replace(/^-/, '');
    return s.replace(/-$/, '');
}
// Выполняем транслитерацию при вводе текста в поле
$(function () {
    $('#add_product-name').keyup(function () {
        // Берем значение из нужного поля и переводим в нижний регистр
        var text = $(this).val().toLowerCase();
        $('#add_product-seo_url').val(translit(text));
        return false;
    });
});

function filterManufacturerTable() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('parse_manufacturer_form');
    filter = input.value.toUpperCase();
    ul = document.getElementById("manufacturerbody");
    li = ul.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            a.style.display = "";
        } else {
            a.style.display = "none";
        }
    }
}
// 
/* ---------------------------------------------- /*
 * !Основные функции 
/* ---------------------------------------------- */