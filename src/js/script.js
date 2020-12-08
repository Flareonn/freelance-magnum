function testWebP(callback) {
  let webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
  if (support == true) {
    document.querySelector("body").classList.add("webp");
  } else {
    document.querySelector("body").classList.add("no-webp");
  }
});

let mySwiper = new Swiper('.gallery-slider', {
  loop: true,
  navigation: {
    nextEl: '.gallery-nav__arrow-next',
    prevEl: '.gallery-nav__arrow-prev',
  }
})
$(document).ready(function () {
  if(!$("main").hasClass("main")) {
    $(".header,.header-burger").addClass("black");
  }
  // Кнопка бургер на телефонах
  $(".header-burger").click(function () {
    $(".header-burger").hasClass("active") && $(".popup").hasClass("active")
      ? $(".popup,.header,.header-burger").toggleClass("active")
      : $(".header-burger,.header-menu,.main-text").toggleClass("active");
    $("body").toggleClass("lock");
  });

  // Вызов popup окна
  $("#call-action-header,#call-action-footer,.main-text__link").click(function () {
    $("body").toggleClass("lock");
    $(".header,.popup,.header-burger,.header-action__link").toggleClass("active");
    let button = $(".header-action__link");
    $(".header").hasClass("active")
      ? button.html("Закрыть")
      : button.html("Обратный звонок");
  })
  
  // Отслеживание кликов по кол-ву комнат
  $('.settings-fieldset__label').children("input").click(function(){
    $(this).parent().toggleClass('active');
    $(this).parent().hasClass("active")
      ? $(this).prop('checked', true)
      : $(this).prop('checked', false);
  });

  // Кнопка сброса
  $("#flat-reset").click(function(){
    // getRequestRoom($(".settings-form input:checked,.settings-form input.settings-fieldset__input"));
    $(".settings-form fieldset label.active").toggleClass("active");
    $(this).toggleClass("disabled");
    $('.settings-form fieldset input:checked').prop('checked', false);
  });

  const getRequestRoom = (array) => {
    let request = {};
    for(let item of Array.from(array)){
      if($(item)[0].value) {
        let nameOfProperty = $(item)[0].name;
        if(!(nameOfProperty in request)) request[nameOfProperty] = []
        request[nameOfProperty].push(+$(item)[0].value);
      }
    }
    let { price, square } = request;
    if(price[0] > price[1]) {
      let temp = price[0];
      price[0] = price[1];
      price[1] = temp;
    }
    if(square[0] > square[1]) {
      let temp = square[0];
      square[0] = square[1];
      square[1] = temp;
    }
    // console.log(request);
  }

  const getSortPseudoTable = ({target}) => {
    target.classList.toggle("active");
    const order = (target.dataset.order = -(target.dataset.order || -1));
    let arr = Array.from($(".flat-table .thead .flat-table__element div"));
    let index = 0;
    arr.forEach((item, idx) => {
      if(item == target) index = idx;
    });
    const collator = new Intl.Collator(["en", "ru"], { numeric: true });
    const comparator = (index, order) => (a, b) =>
      order *
      collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
      );
    
    let arrCells = target.closest("#testedTable").children[1].children;
    let tBody = target.closest("#testedTable").children[1]
    for(const item of Array.from(arrCells)){
      tBody.append(...[...arrCells].sort(comparator(index, order)));
    }

    // for (const tBody of target.closest("table").tBodies) {
    //   tBody.append(...[...tBody.rows].sort(comparator(index, order)));
    // }
  };

  const getSort = ({target}) => {
    target.classList.toggle("active");
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(["en", "ru"], { numeric: true });
    const comparator = (index, order) => (a, b) =>
      order *
      collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
      );

    for (const tBody of target.closest("table").tBodies) {
      console.log(tBody.rows)
      tBody.append(...[...tBody.rows].sort(comparator(index, order)));
    }

    // for (const cell of target.parentNode.cells)
    //   cell.classList.toggle("sorted", cell === target);
  };

  const changeReset = (value) => {
    let resetButton = $(".settings-form__reset");
    if(value && resetButton.hasClass("disabled")) resetButton.removeClass("disabled");
    else if (!value) resetButton.addClass("disabled");
  }

  const onlyNumber = (target) => {
    if(target.getAttribute("type") === "text"){
      target.value = target.value.replace(/\D/g, "");
    } else if (target.getAttribute("type") === "tel"){
      target.value = target.value.replace(/[a-zA-Z ]+/g, "");
    }
    return target.value;
  }

  const isSelected = ({target}) => {
    target.value = onlyNumber(target);
    let arr = Array.from(document.querySelectorAll(".settings-fieldset input"));
    let map = new Set(arr.map(item => {
      if(item.checked || (item.getAttribute("type") === "text" && item.value)) return item
    }));    
    map.forEach(item => (!item ? map.delete(item) : null));
    
    changeReset(map.size > 0);
  }

  const popupTable = ({target}) => {
    let popup = $(
    '<div class="flat-table__element_popup" id="flat-table-popup">' +
      '<div class="flat-popup__wrapper">' +
        '<img class="flat-popup__image" src="img/flat-info.jpg" alt="" />' +
        '<div class="flat-popup__icon">' +
          '<svg width="69" height="75" viewBox="0 0 69 75" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.94531 10C6.4541 10 7.40625 9.2041 7.40625 7.96875C7.40625 7.03125 6.6543 6.32324 5.70215 6.2793V6.24023C6.4834 6.13281 7.0791 5.50293 7.0791 4.71191C7.0791 3.62305 6.24414 2.9541 4.85742 2.9541H1.58105V10H4.94531ZM3.37305 4.22363H4.38379C4.98438 4.22363 5.33594 4.5166 5.33594 5.00977C5.33594 5.51758 4.94531 5.8252 4.2959 5.8252H3.37305V4.22363ZM3.37305 8.73047V6.91406H4.42773C5.16504 6.91406 5.58496 7.23633 5.58496 7.8125C5.58496 8.4082 5.1748 8.73047 4.4375 8.73047H3.37305Z" fill="#0B2647"/><path d="M64.6162 10.1904C66.7109 10.1904 68.0391 8.76953 68.0391 6.47461C68.0391 4.18457 66.7061 2.76367 64.6162 2.76367C62.7754 2.76367 61.5107 3.87695 61.2471 5.71777H60.373V2.9541H58.5811V10H60.373V7.1582H61.2373C61.4814 9.04785 62.7363 10.1904 64.6162 10.1904ZM64.6113 4.24805C65.5684 4.24805 66.2129 5.11719 66.2129 6.47461C66.2129 7.83691 65.5732 8.70605 64.6113 8.70605C63.6396 8.70605 63 7.83691 63 6.47461C63 5.11719 63.6494 4.24805 64.6113 4.24805Z" fill="#0B2647"/><path d="M61.3096 70.0703H62.2324C62.9307 70.0703 63.3506 70.3779 63.3506 70.8906C63.3506 71.418 62.9111 71.7793 62.2568 71.7793C61.5439 71.7793 61.0801 71.4473 61.0557 70.9102H59.3467C59.4102 72.292 60.5479 73.1904 62.2227 73.1904C63.9707 73.1904 65.1865 72.3018 65.1865 71.0273C65.1865 70.0898 64.5713 69.4258 63.6143 69.3232V69.2842C64.4102 69.1328 64.9521 68.4932 64.9521 67.6875C64.9521 66.5352 63.8779 65.7637 62.2666 65.7637C60.5967 65.7637 59.5176 66.6426 59.4883 68.0195H61.1191C61.1387 67.4678 61.5732 67.1064 62.2275 67.1064C62.877 67.1064 63.2725 67.4141 63.2725 67.9121C63.2725 68.4102 62.8574 68.7324 62.2324 68.7324H61.3096V70.0703Z" fill="#0B2647"/><path d="M3.78906 72.1221C5.61035 72.1221 6.9043 71.0186 6.9873 69.3438H5.26367C5.15625 70.1689 4.58496 70.6865 3.79395 70.6865C2.80762 70.6865 2.19238 69.8516 2.19238 68.4697C2.19238 67.1025 2.81738 66.2676 3.78906 66.2676C4.5752 66.2676 5.16602 66.8145 5.25391 67.6445H6.97754C6.92383 65.9795 5.57129 64.832 3.78906 64.832C1.68945 64.832 0.371094 66.1748 0.371094 68.4746C0.371094 70.7793 1.67969 72.1221 3.78906 72.1221Z" fill="#0B2647"/><circle cx="33" cy="38" r="24.5" stroke="#0B2647"/><line x1="8.35355" y1="11.6464" x2="59.3536" y2="62.6464" stroke="#0B2647"/><line x1="58.3536" y1="12.3536" x2="8.35355" y2="62.3536" stroke="#0B2647"/></svg>' + 
        '</div>' +
      '</div>' +
      '<div class="flat-popup__wrapper">' +
        '<h2 class="flat-popup__title">Квартиры № 107</h2>' +
        '<div class="flat-popup__inner flat-inner">' +
          '<div class="flat-inner__block">' +
            '<span>9</span>' +
            '<p>Этаж</p>' +
          '</div>' +
          '<div class="flat-inner__block">' +
            '<span>34.79</span>' +
            '<p>Площадь</p>' +
          '</div>' +
          '<div class="flat-inner__block">' +
            '<span>1</span>' +
            '<p>Комната</p>' +
          '</div>' +
          '<div class="flat-inner__block">' +
            '<span>4</span>' +
            '<p>Окна</p>' +
          '</div>' +
        '</div>' +
        '<p class="flat-popup__description">Magnum Opus — «великое дело», главный труд жизни. Самое значимое творение человека в искусстве, науке или любой другой сфере деятельности.</p>' +
        '<div class="flat-popup__inner flat-inner">' + 
          '<a class="flat-inner__link">Оставить заявку</a>' +
          '<a class="flat-inner__link active">Скачать PDF</a>' +
        '</div>' +
      '</div>' +
    '</div>')[0]
    let parentOfTarget = target.closest(".flat-table__element");
    parentOfTarget.classList.toggle("active");
    if(parentOfTarget.classList.contains("active") && !$(parentOfTarget).parent()[0].classList.contains("thead")){
      parentOfTarget.after(popup);
    } else {
      console.log(parentOfTarget.nextSibling.remove());
    }

  }

  document
    .querySelectorAll(".flat-table__element")
    .forEach(element => element.addEventListener("click", (e) => popupTable(e)))

  // document
  //   .querySelectorAll(".flat-table thead")
  //   .forEach((tableTH) => tableTH.addEventListener("click", (e) => getSort(e)));
  document
    .querySelectorAll(".flat-table .thead")
    .forEach((tableTH) => tableTH.addEventListener("click", (e) => getSortPseudoTable(e)));
  document
    .querySelectorAll(".settings-fieldset input")
    .forEach((item) => {
      item.addEventListener('click', (e) => isSelected(e))
      item.addEventListener('keyup', (e) => isSelected(e))
    });

  document
    .querySelectorAll(".proposal-form__input[type=\"tel\"],.popup-form__input[type=\"tel\"]")
    .forEach(item => item.addEventListener('keyup', (e) => onlyNumber(e.target)))//({target}) => target.value = onlyNumber(target)));
});

