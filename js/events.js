/* ---------------------------------------------- /*
 _____                _       
|  ___|              | |      
| |____   _____ _ __ | |_ ___ 
|  __\ \ / / _ \ '_ \| __/ __|
| |___\ V /  __/ | | | |_\__ \
\____/ \_/ \___|_| |_|\__|___/
/* ---------------------------------------------- */
// Синхронизация

$('#sync').click(function () {
    dropDB();
    localStorage.setItem('syncronize', '1');
    location.reload();
});

if (localStorage.getItem('syncronize') === '1') {
    $('#status').fadeIn();
    $('#preloader').delay(300).fadeIn('slow');
    localStorage.setItem('syncronize', '0');
    syncInit();
}

function syncInit() {
    // (╯°□°）╯︵ ┻━┻
    Promise.all([
        getCategories(),
        getProducts(),
        getManufacturers(),
        getOrders(),
        getOrderProducts(),
        getOptions(),
        getOptionValues()
    ])
        .then(function () {
            location.reload();
        })
        .catch(error => {
            $('#progress').html('Упс, что-то пошло не так'); // Error
        });
    // \(T.T)/
}
// 

// Редактирование сео шаблонов
$(document).delegate('.seocat_row', 'click', function (event) {
    event.preventDefault();
    $('#seotmptitle').val("");
    $('#seotmpdescr').val("");
    // $('#seotmph1').val("");
    var catID = $(this).data("catid");
    seo_template = seo.queryAll("seo_templates", {
        query: {
            category_id: catID
        }
    });
    console.log(catID);

    openModalWindow('#seotmp-edit_form');

    $('#seo_hiddenid').attr("value", catID);

    if (seo_template[0]) {
        $('#seotmptitle').val(seo_template[0].title);

        $('#seotmpdescr').val(seo_template[0].descr);

        // $('#seotmph1').val(seo_template[0].h1);
    }

});
// Фильтр по категориям
$('#mySelect').on('change', function () {
    var selectedValue = $(this).val();

    if (selectedValue != 'default') {
        oTable.fnFilter("^" + selectedValue + "$", 0, true); //Exact value, column, reg
    } else {
        location.reload();
    }
});
// 
// Фильтр по производителям
$('#manufacturersSelect').on('change', function () {
    var selectedValue = $(this).val();

    if (selectedValue != 'default') {
        oTable.fnFilter("^" + selectedValue + "$", 1, true); //Exact value, column, reg
    } else {
        location.reload();
    }
});
$('#status-sel').on('change', function () {
    var selectedValue = $(this).val();

    if (selectedValue != 'default') {
        oTable.fnFilter("^" + selectedValue + "$", 2, true); //Exact value, column, reg
    } else {
        location.reload();
    }
});
$('#seotmp_edit').click(function () {

    var category_id = $('#seo_hiddenid').val();
    var title = $('#seotmptitle').val();
    var descr = $('#seotmpdescr').val();
    // var h1 = $('#seotmph1').val();

    console.log(category_id);
    console.log(title);
    console.log(descr);
    // console.log(h1);   

    seo.insertOrUpdate("seo_templates", {
        category_id: category_id
    }, {
            category_id: category_id,
            title: title,
            descr: descr
            // h1: h1
        });
    seo.commit();
    closeModalWindow();
});
// 
$('#generate_seo').click(function () {
    if ($('#add_product-category').val() != 'default') {
        var gen_cat_id = $('#add_product-category').val();
        var template = seo.queryAll("seo_templates", {
            query: {
                category_id: gen_cat_id
            }
        });
        let meta_gen = {
            name: $('#add_product-name').val(),
            model: $('#add_product-model').val(),
            price: $('#add_product-price').val(),
            brand: $('#add_product-manufacturer option:selected').text(),
            category: $("#add_product-category :selected").text()
        },
            title_template = template[0].title;
        descr_template = template[0].descr;

        // Ищем "a-z_"-символы между фигурных скобок
        let title_result = title_template.replace(/{\s*([a-z_]+)\s*}/ig, (_, key) => key in meta_gen ? meta_gen[key] : _);
        $('#add_product-meta_title').val(title_result);
        // Ищем "a-z_"-символы между фигурных скобок
        let descr_result = descr_template.replace(/{\s*([a-z_]+)\s*}/ig, (_, key) => key in meta_gen ? meta_gen[key] : _);
        $('#add_product-meta_description').val(descr_result);



        // _____________________________________


    }
});
// 
// Редактирование товара
$(document).delegate('.product-row_item', 'click', function (event) { // лoвим клик пo строке в таблице
    event.preventDefault(); // выключaем стaндaртную рoль элементa(на всякий случай xD)
    console.log('Edit product');
    var productID = $(this).parent().attr('id'); //получаем id товара

    var products = lib.queryAll("products", {
        query: {
            product_id: productID
        }
    });
    renderOptions(productID);

    openModalWindow('#modal_form');

    $('#pProductId').text(productID);
    $('#input-name').val(products[0].name);
    $('#input-meta_title').val(products[0].meta_title);
    $('#input-meta_description').val(products[0].meta_description);
    $('#input-model').val(products[0].model);
    $('#input-quantity').val(products[0].quantity);
    $('#input-price').val(products[0].price);
    $('#input-price_zak').val(products[0].price_zak);
    if (products[0].discount_quantity == null) {
        $('#input-discount_quantity').val('0');
    } else {
        $('#input-discount_quantity').val(products[0].discount_quantity);
    };
    if (products[0].discount_price == null) {
        $('#input-discount_price').val('0');
    } else {
        $('#input-discount_price').val(products[0].discount_price);
    };

});
//
// #########################
// Массовое редактирование
// #########################

//Открытие окна
$('#open_mass-modal').click(function () {
    if ($(".product_id-checkbox").is(":checked")) {
        $('.mass-input').val('не менять');
        openModalWindow('#mass-edit_form');
    }
});

// 

// так как у этого окна может быть 2 эвента
// редактирование связанных товаров
// и массовое редактирование
// то  создадим переменную, чтобы понимать какой из эвентов происходит


//Запуск эвента 
$('#mass_edit').click(function () {
    console.log(localStorage.getItem('init_model'));
    if (localStorage.getItem('init_model') == 'false') {

        massQueryInputs();

        closeModalWindow();

    } else {
        massAssociatedSync(localStorage.getItem('init_model'));
        closeModalWindow();
        localStorage.setItem('init_model', 'false');
    }
});
// ###########################

// связанные товары
$(document).delegate('.assoc_init', 'click', function (event) {
    init_model = $(this).data('model');
    console.log(init_model);
    localStorage.setItem('init_model', init_model);
    $('.mass-input').val('не менять');
    openModalWindow('#mass-edit_form');

});






// ###########################



//Синхронизация изменений
$('#rept-sync').click(function () {

    var sync = lib.queryAll("sync_table");
    var j = 0;
    while (j <= sync.length - 1) {
        console.log(sync[j]);
        syncChanges(sync[j]);
        j++;
    } //while
    lib.deleteRows("sync_table");

    var sync_opt = lib.queryAll("option_upate");
    var o = 0;
    while (o <= sync_opt.length - 1) {
        console.log(sync_opt[o]);
        updateProductOptions(sync_opt[o]);
        o++;
    } //while
    lib.deleteRows("option_upate");

    var sync_new_products = lib.queryAll("new_products");
    var n = 0;
    while (n <= sync_new_products.length - 1) {
        console.log(sync_new_products[n]);

        addProducts(sync_new_products[n]);
        n++;
    } //while
    lib.deleteRows("new_products");


    $('#rept-modal-inner').html('');
    lib.commit();
    closeModalWindow();

});
// 
// Очистка списка синхронизации
$('#reset').click(function () {
    $('#rept-modal-inner').html('');
    lib.deleteRows("sync_table");
    lib.deleteRows("new_products");
    lib.deleteRows("option_upate");
    lib.commit();
    closeModalWindow();
});

// 


// Открытие списка синхронизации
$('#open-sync-modal').click(function () {
    $('#rept-modal-inner').html('');
    // формируем шаблон окна
    var sync = lib.queryAll("sync_table");
    var rept = '';
    var j = 0;
    while (j <= sync.length - 1) {
        rept += `
            <tr class="sync_chdelid${sync[j].product_id}">
                <td>${sync[j].product_id}</td>
                <td class="product-name">${sync[j].name}</td>
                <td class="product-name">${sync[j].model}</td>
                <td class="product-quantity">${sync[j].quantity}</td>
                <td class="product-price">${sync[j].price}</td>
                <td class="product-price_zak">${sync[j].price_zak}</td>
                <td class="product-discount_quantity">${sync[j].discount_quantity}</td>
                <td class="product-discount_price">${sync[j].discount_price}</td>
                <td class="product-discount_del"><button class="btn btn-danger syncrow_del" data-chdelid="${sync[j].product_id}"><i class="fas fa-trash-alt"></i></button></td>
            </tr>
        `;
        j++;
    } //while
    $('#rept-modal-inner').html(rept);

    $('#reptadd-modal-inner').html('');
    // формируем шаблон окна
    var addsync = lib.queryAll("new_products");
    var addrept = '';
    var a = 0;
    while (a <= addsync.length - 1) {
        addrept += `
            <tr class="createrow${addsync[a].ID}">
                <td class="product-name">${addsync[a].name}</td>
                <td class="product-name">${addsync[a].model}</td>
                <td class="product-price">${addsync[a].price}</td>
                <td class="product-name"><button class="btn btn-danger createrow_del" data-chdelid="${addsync[a].ID}"><i class="fas fa-trash-alt"></i></button></td>
            </tr>
        `;
        a++;
    } //while
    $('#reptadd-modal-inner').html(addrept);



    openModalWindow('#rept-modal_form');

});
// 
// 
$(document).delegate('.syncrow_del', 'click', function (e) {
    var childid = $(this).data('chdelid');
    lib.deleteRows("sync_table", {
        product_id: childid
    });
    $('.sync_chdelid' + childid).remove();
    lib.commit();
});
// 
$(document).delegate('.createrow_del', 'click', function (e) {
    var childid = $(this).data('chdelid');
    lib.deleteRows("new_products", {
        ID: childid
    });
    $('.createrow' + childid).remove();
    lib.commit();
});

// Запись данных для синхронизации
$(document).delegate('#btn-product-update', 'click', function () {
    var reptProductID = $('#pProductId').text(); //получаем id товара
    var reptProductName = $('#input-name').val();
    var reptMetaTitle = $('#input-meta_title').val();
    var reptMetaDescription = $('#input-meta_description').val();
    var reptProductModel = $('#input-model').val();
    var productNewQuantity = $('#input-quantity').val();
    var productNewPrice = $('#input-price').val();
    var productNewPrice_zak = $('#input-price_zak').val();
    var productNewDiscount_quantity = $('#input-discount_quantity').val();
    var productNewDiscount_price = $('#input-discount_price').val();



    lib.insertOrUpdate("sync_table", {
        product_id: reptProductID
    }, {
            product_id: reptProductID,
            name: reptProductName,
            meta_title: reptMetaTitle,
            meta_description: reptMetaDescription,
            model: reptProductModel,
            quantity: productNewQuantity,
            price: productNewPrice,
            price_zak: productNewPrice_zak,
            discount_quantity: productNewDiscount_quantity,
            discount_price: productNewDiscount_price
        });



    if ($('#apply_update_options:checked').val() !== undefined) {

        $('.input-option_quantity').each(function () {
            var data_valueid = $(this).attr("data-valueid");
            var data_quantity = $(this).val();
            lib.insert("option_upate", {
                product_option_value_id: data_valueid,
                product_id: reptProductID,
                quantity: data_quantity
            });
        });

        // for(i in inputs) {
        //     console.log(inputs[i].option_value_id);

        // }

    }



    lib.commit();
    closeModalWindow();
});
// 

$('#refresh_pr_opt').click(function () {
    var opt_id = $('#pProductId').text();
    console.log(opt_id);
    $('#options').html('');
    getProductOptions(opt_id);
});

// Добавление товара в чек
$(document).delegate('#btn-to-cheque', 'click', function () {
    var reptProductID = $('#pProductId').text(); //получаем id товара
    var reptProductName = $('#input-name').val();
    var reptProductModel = $('#input-model').val();
    var productNewQuantity = $('#btn-to-cheque-quantity').val(); //$('#input-quantity').val()
    var productNewPrice = $('#input-price').val();
    var productNewPrice_zak = $('#input-price_zak').val();
    var productNewDiscount_quantity = $('#input-discount_quantity').val();
    var productNewDiscount_price = $('#input-discount_price').val();

    lib.insert("cheque", {
        product_id: reptProductID,
        name: reptProductName,
        model: reptProductModel,
        quantity: productNewQuantity,
        price: productNewPrice,
        price_zak: productNewPrice_zak,
        discount_quantity: productNewDiscount_quantity,
        discount_price: productNewDiscount_price
    });
    lib.commit();
    closeModalWindow();
});
// 

// Чек из заказа
$(document).delegate('#order-print-cheque', 'click', function () {
    var order_to_cheque_id = $(this).data('orderprintid');

    var order_products = lib.queryAll("order_products", {
        query: {
            order_id: order_to_cheque_id
        }
    });

    var k = 0;
    while (k <= order_products.length - 1) {
        var product_to_cheque = lib.queryAll("products", {
            query: {
                product_id: order_products[k].product_id
            }
        });

        lib.insert("cheque", {
            product_id: product_to_cheque[0].product_id,
            name: product_to_cheque[0].name,
            model: product_to_cheque[0].model,
            quantity: order_products[k].quantity,
            price: product_to_cheque[0].price,
            price_zak: product_to_cheque[0].price_zak,
            discount_quantity: product_to_cheque[0].discount_quantity,
            discount_price: product_to_cheque[0].discount_price
        });


        k++;
    }
    lib.commit();
});
// 

// Статус заказа

$(document).delegate('.order_status_item', 'click', function (e) {
    e.preventDefault();
    $('.order_status_item-selected').toggleClass('order_status_item-selected');
    $(this).toggleClass('order_status_item-selected');
    var status_name = $(this).text();
    var status_item_selected = $(this).attr('data-orderstatusitemid');
    console.log(status_item_selected);
    console.log(status_name);
    $('#order-status_button').text(status_name);

    $('#order-status_button').attr("data-orderbtnid", status_item_selected);
});
$(document).delegate('#order-status_button', 'click', function (e) {
    var get_order_status_id = $(this).attr("data-orderbtnid");
    console.log(get_order_status_id);
    var order_id = $(this).attr("data-oid");
    if (get_order_status_id != '0') {
        var change_order_status_submit = confirm("Изменить статус заказа?");
        if (change_order_status_submit) {
            setOrderStatus(order_id, get_order_status_id);
        }
    }
});

// 

// Генерация тайтлов

$(document).delegate('.titlecenter', 'click', function (e) {
    e.preventDefault();
    $('.titlecenter_selected').toggleClass('titlecenter_selected');
    $(this).toggleClass('titlecenter_selected');
    var titlecenter_name = $(this).text();
    var data_titlecenter = $(this).attr("data-titlecenter");
    $('#button_titlemain').text(titlecenter_name);

    $('#button_titlemain').attr("data-titlemain", data_titlecenter);
});
// description generate
$(document).delegate('.descrcenter', 'click', function (e) {
    e.preventDefault();
    $('.descrcenter_selected').toggleClass('descrcenter_selected');
    $(this).toggleClass('descrcenter_selected');
    var descrcenter_name = $(this).text();
    var data_descrcenter = $(this).attr("data-titlecenter");
    $('#button_descrmain').text(descrcenter_name);

    $('#button_descrmain').attr("data-descrmain", data_descrcenter);
});
// 
// печать посфылки

$(document).delegate('#show_printpost', 'click', function () {
    var disp_setting = "toolbar=yes,location=no,directories=yes,menubar=yes,";
    disp_setting += "scrollbars=yes,width=1024, height=768, left=100, top=25";
    var content_vlue = document.getElementById("printpost-content").innerHTML;

    var docprint = window.open("", "", disp_setting);
    docprint.document.open();
    docprint.document.write(`		<STYLE TYPE="text/css">
  <!--
      @page { margin-left: 0.79in; margin-right: 0.79in; margin-top: 0.59in; margin-bottom: 1.18in }
      P { margin-bottom: 0.08in; direction: ltr; color: #000000; line-height: 115%; widows: 2; orphans: 2 }
      P.western { font-family: "Calibri", sans-serif; font-size: 11pt; so-language: ru-RU }
      P.cjk { font-family: "Times New Roman", serif; font-size: 11pt }
      P.ctl { font-family: "Calibri", sans-serif; font-size: 11pt; so-language: ar-SA }
      H2 { margin-top: 0in; margin-bottom: 0in; direction: ltr; color: #000000; line-height: 100%; widows: 2; orphans: 2 }
      H2.western { font-size: 10pt; so-language: ru-RU; font-style: italic; font-weight: normal }
      H2.cjk { font-family: "Times New Roman", serif; font-size: 10pt; font-style: italic; font-weight: normal }
      H2.ctl { font-family: "Times New Roman", serif; font-size: 10pt; so-language: ar-SA; font-weight: normal }
  -->
  </STYLE></head><body onLoad="self.print()" style="width: 800px; font-size: 13px; font-family: arial;">`);
    docprint.document.write(content_vlue);
    docprint.document.close();
    docprint.focus();
});
// 


// Показать чек
$('#show-cheque').click(function () {
    $('#print_edit-body').html('');
    $('.chdelid').remove();
    $('#overlay').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
        function () { // пoсле выпoлнения предъидущей aнимaции
            $('#modal_cheque')
                .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                .animate({
                    opacity: 1,
                    top: '50%'
                }, 200); //'появляем' окно
            var modal_selector = '#modal_cheque';
            var modal_height = $(modal_selector).height();
            var height_offset = (modal_height - (modal_height * 2)) / 2;
            var modal_width = $(modal_selector).width();
            var width_offset = (modal_width - (modal_width * 2)) / 2;
            $(modal_selector)
                .css('margin-top', height_offset)
                .css('margin-left', width_offset);

            $('#ch_sallername').text(localStorage.getItem('settings_seller'));
            $('#ch_salleraddr').text(localStorage.getItem('settings_addr'));
            $('#ch_sallerinn').text(localStorage.getItem('settings_inn'));
            $('#ch_sallerogrn').text(localStorage.getItem('settings_ogrn'));


            var chequeList = lib.queryAll("cheque");
            var ch = 0;
            var summ = 0;

            while (ch <= chequeList.length - 1) {
                var rowsumm = chequeList[ch].quantity * chequeList[ch].price;
                $('#print_head').after(`
            <TR class="chdelid chdelid${chequeList[ch].product_id}" VALIGN=TOP>
                <TD HEIGHT=19 STYLE="border-top: none; border-bottom: 1px solid #000000; border-left: none; border-right: none; padding: 0in">
                    <P LANG="ru-RU" CLASS="western"><BR>
                    ${chequeList[ch].name}
                    </P>
                </TD>
                <TD STYLE="border-top: none; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: none; padding: 0in">
                    <P LANG="ru-RU" CLASS="western" ALIGN=CENTER><BR>
                    ${chequeList[ch].model}
                    </P>
                </TD>
                <TD STYLE="border-top: none; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: none; padding: 0in">
                    <P LANG="ru-RU" CLASS="western print_cheque_quntity" ALIGN=CENTER><BR>
                    ${chequeList[ch].quantity}
                    </P>
                </TD>
                <TD STYLE="border-top: none; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: none; padding: 0in">
                    <P LANG="ru-RU" CLASS="western print_cheque_price" ALIGN=CENTER><BR>
                    ${chequeList[ch].price}
                    </P>
                </TD>
                <TD STYLE="border-top: none; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: none; padding: 0in">
                    <P LANG="ru-RU" CLASS="western" ALIGN=CENTER><BR>
                    ${rowsumm}
                    </P>
                </TD>
            </TR>
                       
                `);
                $('#print_edit-body').append(`
                <tr class="chdelid${chequeList[ch].product_id}">
                    <th scope="row">${ch}</th>
                    <td>${chequeList[ch].name}</td>
                    <td><input class="edit_cheque_quantity" data-chdelid="${chequeList[ch].product_id}" type="text" value="${chequeList[ch].quantity}" /></td>
                    <td><input class="edit_cheque_price" data-chdelid="${chequeList[ch].product_id}" type="text" value="${chequeList[ch].price}" /></td>
                    <td><button class="btn btn-danger chrow_del" data-chdelid="${chequeList[ch].product_id}"><i class="fas fa-trash-alt"></i></button></td>
                </tr>`);

                summ = summ + rowsumm;
                ch++;
            } //while
            $('#cheque_summ').html(`             
                ${summ + 'р.'}
            `);
        }
    );
});
// 
$(document).delegate('.edit_cheque_quantity', 'focusout', function (e) {
    var childid = $(this).data('chdelid');
    var val = $(this).val();

    lib.insertOrUpdate("cheque", {
        product_id: childid
    }, {
            product_id: childid,
            quantity: val
        });
    $('.chdelid' + childid + ' .print_cheque_quntity').html('<br>' + val);
    lib.commit();
});
// 
$(document).delegate('.edit_cheque_price', 'focusout', function (e) {
    var childid = $(this).data('chdelid');
    var val = $(this).val();

    lib.insertOrUpdate("cheque", {
        product_id: childid
    }, {
            product_id: childid,
            price: val
        });
    $('.chdelid' + childid + ' .print_cheque_price').html('<br>' + val);
    lib.commit();
});
// 
$(document).delegate('.chrow_del', 'click', function (e) {
    var childid = $(this).data('chdelid');
    lib.deleteRows("cheque", {
        product_id: childid
    });
    $('.chdelid' + childid).remove();
    lib.commit();
});
// Печать чека
$('#print').click(function () {
    var disp_setting = "toolbar=yes,location=no,directories=yes,menubar=yes,";
    disp_setting += "scrollbars=yes,width=1024, height=768, left=100, top=25";
    var content_vlue = document.getElementById("print-content").innerHTML;

    var docprint = window.open("", "", disp_setting);
    docprint.document.open();
    docprint.document.write(`		<STYLE TYPE="text/css">
  <!--
      @page { margin-left: 0.79in; margin-right: 0.79in; margin-top: 0.59in; margin-bottom: 1.18in }
      P { margin-bottom: 0.08in; direction: ltr; color: #000000; line-height: 115%; widows: 2; orphans: 2 }
      P.western { font-family: "Calibri", sans-serif; font-size: 11pt; so-language: ru-RU }
      P.cjk { font-family: "Times New Roman", serif; font-size: 11pt }
      P.ctl { font-family: "Calibri", sans-serif; font-size: 11pt; so-language: ar-SA }
      H2 { margin-top: 0in; margin-bottom: 0in; direction: ltr; color: #000000; line-height: 100%; widows: 2; orphans: 2 }
      H2.western { font-size: 10pt; so-language: ru-RU; font-style: italic; font-weight: normal }
      H2.cjk { font-family: "Times New Roman", serif; font-size: 10pt; font-style: italic; font-weight: normal }
      H2.ctl { font-family: "Times New Roman", serif; font-size: 10pt; so-language: ar-SA; font-weight: normal }
  -->
  </STYLE></head><body onLoad="self.print()" style="width: 800px; font-size: 13px; font-family: arial;">`);
    docprint.document.write(content_vlue);
    docprint.document.close();
    docprint.focus();
    closeModalWindow();
});
// 

// Очистка чека
$('#print-clean').click(function () {
    lib.deleteRows("cheque");
    lib.commit();
    $('#modal_cheque_inner').html('');
    $('#modal_cheque')
        .animate({
            opacity: 0,
            top: '45%'
        }, 200, // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
            function () { // пoсле aнимaции
                $(this).css('display', 'none'); // делaем ему display: none;
                $('#overlay').fadeOut(400); // скрывaем пoдлoжку
            }
        );
    alert("print buffer cleaned!");
    closeModalWindow();
});
// 

// 
$('#del_products').click(function () {
    var confirm_delete = confirm('Удалить выделенные товары?');
    if (confirm_delete) {
        initDelete();
    }

});
// 

// 
$('#duplicate_products').click(function () {
    var confirm_duplicate = confirm('Дублировать выделенные товары?');
    if (confirm_duplicate) {
        initDuplicate();
    }

});

// 


// Табы
$('#mainTab a').on('click', function (e) {
    e.preventDefault();
    $('.show').toggleClass('show');
    $(this).tab('show');
});
// 

// товары в заказе
$(document).delegate('.order-products-button', 'click', function (event) { // лoвим клик пo строке в таблице
    event.preventDefault(); // выключaем стaндaртную рoль элементa(на всякий случай xD)
    var order_button_id = $(this).data('orderid');
    console.log('send');
    orderProductsLoad(order_button_id);
});

// 


// Закрытие модального окна
$('.modal_close, #overlay').click(function () { // лoвим клик пo крестику или пoдлoжке
    $('.modal-content').html('');
    closeModalWindow();
});
// 
// Сервисные события
$('#drop').click(function () { //Очистка бд
    dropDB();
    location.reload();
});

function dropDB() {
    lib.drop();
    lib.commit();
    console.log("Dropped!");
}
$('#drop_seo').click(function () { //Очистка бд
    seo.drop();
    seo.commit();
    alert("Dropped!");
});
$('#reload').click(function () { //Обновление страницы
    location.reload();
});
$('#quit').click(function () { //Выход
    nw.App.quit();
});
// 


// Добавление товара
$('#add_product-init').click(function () {

    var data = [];

    data['name'] = $('#add_product-name').val();
    data['model'] = $('#add_product-model').val();
    data['meta_title'] = $('#add_product-meta_title').val();
    data['keyword'] = $('#add_product-seo_url').val();
    data['meta_description'] = $('#add_product-meta_description').val();
    data['description'] = $('#add_product-description').val();
    data['price'] = $('#add_product-price').val();
    data['price_zak'] = $('#add_product-price_zak').val();
    data['discount_price'] = $('#add_product-discount_price').val();
    data['quantity'] = $('#add_product-quantity').val();
    data['stock_status_id'] = $('#add_product-stock_status option:selected').val();
    data['discount_quantity'] = $('#add_product-discount_quantity').val();
    data['location'] = $('#add_product-city').val();
    data['status'] = $('#add_product-status').val();
    if ($('#add_product-category').val() != 'default') {
        data['category_id'] = $('#add_product-category').val();
    } else {
        data['category_id'] = "0";
    }
    data['manufacturer_id'] = $('#add_product-manufacturer').val();





    data['image'] = $('#get_img_name').val();
    data['minimum'] = "1";
    data['substract'] = "1";
    data['shipping'] = "1";
    data['points'] = "0";
    data['weight'] = "0";
    data['weight_class_id'] = "1";
    data['tax_class_id'] = "0";
    data['sort_order'] = "1";
    data['length'] = "0";
    data['width'] = "0";
    data['height'] = "0";
    data['length_class_id'] = "1";


    console.log(data);
    addNewProduct(data);
    alert("Товар добавлен в список синхронизации!");
});
// 

// Загрузка изображения
var image_files; // переменная. будет содержать данные файлов
// заполняем переменную данными файлов, при изменении значения file поля
$('#input_image').on('change', function () {
    image_files = this.files;
    image_name = this.files[0].name;
    $('#get_img_name').val("connector/" + image_name);
    console.log(image_name);
});
$('#upload_image').click(function () {
    console.log(image_files);
    // ничего не делаем если files пустой
    if (typeof image_files == 'undefined') return;
    // создадим данные файлов в подходящем для отправки формате
    var data = new FormData();
    $.each(image_files, function (key, value) {
        data.append(key, value);
    });
    // добавим переменную идентификатор запроса
    data.append('my_file_upload', 1);
    $.ajax({
        crossDomain: true,
        url: String(settings_url) + '/index.php?route=connector/' + String(settings_key) + '/uploadImage',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        beforeSend: function () {
            console.log("uploading");
        },
        success: function (json) {
            console.log(json);
            alert("Файл успешно загружен!");
        }
    });
});
// 

// Настройки
$('#settings').click(function () {

    $('#settings_url').val(localStorage.getItem('settings_url'));
    $('#settings_key').val(localStorage.getItem('settings_key'));
    $('#settings_seller').val(localStorage.getItem('settings_seller'));
    $('#settings_inn').val(localStorage.getItem('settings_inn'));
    $('#settings_ogrn').val(localStorage.getItem('settings_ogrn'));
    $('#settings_addr').val(localStorage.getItem('settings_addr'));
    $('#settings_index').val(localStorage.getItem('settings_index'));

    openModalWindow('#settings_modal');

});
$('#settings_edit').click(function () {
    var set_url = $('#settings_url').val();
    var set_key = $('#settings_key').val();
    var settings_seller = $('#settings_seller').val();
    var settings_addr = $('#settings_addr').val();
    var settings_index = $('#settings_index').val();
    var settings_inn = $('#settings_inn').val();
    var settings_ogrn = $('#settings_ogrn').val();

    localStorage.setItem('settings_url', set_url);
    localStorage.setItem('settings_key', set_key);
    localStorage.setItem('settings_seller', settings_seller);
    localStorage.setItem('settings_addr', settings_addr);
    localStorage.setItem('settings_index', settings_index);
    localStorage.setItem('settings_inn', settings_inn);
    localStorage.setItem('settings_ogrn', settings_ogrn);
    closeModalWindow('#settings_modal');
});

// 

/* ---------------------------------------------- /*
 * !События
/* ---------------------------------------------- */