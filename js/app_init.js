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

$(document).ready(function() {
    /*  categories */
    categoriesLoad();
    categoriesSeotmpLoad();

    /*  products */
    productsLoad();

    // manufacturers
    manufacturersLoad();

    /*  orders  */
    ordersLoad(); 

    /* Initialise the DataTable */
    var oTable = $('#tableWrap').dataTable({
        "oLanguage": {
          "sSearch": "Поиск:"
        },
        "iDisplayLength": 15,
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bFilter": true,
    });
    /* END DataTable */
    
    // Фильтр по категориям
    $('#mySelect').on('change',function(){
        var selectedValue = $(this).val();
        
        if(selectedValue != 'default') {
            oTable.fnFilter("^"+selectedValue+"$", 0, true); //Exact value, column, reg
        } else{
            location.reload();
        }
    });
    // 
    $('#mainTab li:first-child a').tab('show');
    // 
    $('#checkForUpdates').click(function(){
        checkForUpdates();
    });
  // Скрываем прелоадер
//   $('#status').fadeOut();
//   $('#preloader').delay(300).fadeOut('slow');
  });

/* ---------------------------------------------- /*
 * !Инициализация Приложения
/* ---------------------------------------------- */