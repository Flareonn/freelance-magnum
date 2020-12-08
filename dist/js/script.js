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
    $(".flat-table__element_popup").remove();
    $(".flat-table__element").removeClass("active");
    const order = (target.dataset.order = -(target.dataset.order || -1));
    let arr = Array.from($(".flat-table .thead .flat-table__element div"));
    let index = 0;
    arr.forEach((item, idx) => {if(item == target) index = idx});
    const collator = new Intl.Collator(["en", "ru"], { numeric: true });
    const comparator = (index, order) => (a, b) =>
      order *
      collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
      );
    
    let tBody = target.closest("#testedTable").children[1]
    for(const item of Array.from(tBody.children)){
      tBody.append(...[...tBody.children].sort(comparator(index, order)));
    }
  };

  const changeReset = (value) => {
    let resetButton = $(".settings-form__reset");
    if(value && resetButton.hasClass("disabled")) resetButton.removeClass("disabled");
    else if (!value) resetButton.addClass("disabled");
  }

  const onlyNumber = (target) => target.value = target.value.replace(/\D/g, "");

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
      '<h2 class="flat-popup__title">Квартиры № 107</h2>' +
      '<div class="flat-popup__wrapper">' +
        '<img class="flat-popup__image" src="img/flat-info.jpg" alt="" />' +
        '<div class="flat-popup__icon">' +
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
      parentOfTarget.nextSibling.remove();
    }
  }
  document
    .querySelectorAll(".tbody .flat-table__element")
    .forEach(elementOfTable => elementOfTable.addEventListener("click", (e) => popupTable(e)))

  document
    .querySelectorAll(".flat-table .thead")
    .forEach((headerItem) => headerItem.addEventListener("click", (e) => getSortPseudoTable(e)));
  document
    .querySelectorAll(".settings-fieldset input")
    .forEach((item) => {
      item.addEventListener('click', (e) => isSelected(e))
      item.addEventListener('keyup', (e) => isSelected(e))
    })

  document
    .querySelectorAll(".popup-form__input,.proposal-form__input")
    .forEach(item => item.addEventListener('keyup', (e) => onlyNumber(e.target)))

  $("input[type=\"tel\"]").inputmask("+7 (999) 999-9999");
    
});
