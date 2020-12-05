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
  $(".header-burger").click(function () {
    if($(".header-burger").hasClass("active") && $(".popup").hasClass("active"))
    {
      $(".popup").toggleClass("active");
      $(".header").toggleClass("active");
      $(".header-burger").toggleClass("active");
      $("body").toggleClass("lock");
    } else {
      $(".header-burger,.header-menu").toggleClass("active");
      $("body").toggleClass("lock");
      $(".main-text").toggleClass("visible");
    }
  });

  $("#call-action-header,#call-action-footer,.main-text__link").click(function () {
    $(".header-burger").toggleClass("active");
    $("body").toggleClass("lock");
    $(".popup").toggleClass("active");
    $(".header").toggleClass("active");
    let button = $(".header-action__link");
    button.toggleClass("active")
    $(".header").hasClass("active")
      ? button.html("Закрыть")
      : button.html("Обратный звонок");
  })
  
  $('#rooms-1,#rooms-2,#rooms-3,#rooms-4,#area-1,#area-2').click(function(){
    $(this).parent().toggleClass('active');
    $(this).parent().hasClass("active")
      ? $(this).prop('checked', true)
      : $(this).prop('checked', false);
  });
  $("#flat-reset").click(function(){
    // getRequestRoom($(".settings-form input:checked,.settings-form input.settings-fieldset__input"));
    $(".settings-form fieldset label.active").toggleClass("active");
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
    let { price } = request;
    if(price[0] > price[1]) {
      let temp = price[0];
      price[0] = price[1];
      price[1] = temp;
    }
    // console.log(request);
  }

  const getSort = ({ target }) => {
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
      tBody.append(...[...tBody.rows].sort(comparator(index, order)));
      console.log(tBodies);
    }

    for (const cell of target.parentNode.cells)
      cell.classList.toggle("sorted", cell === target);
  };

  document
    .querySelectorAll(".flat-table thead")
    .forEach((tableTH) => tableTH.addEventListener("click", (e) => getSort(e)));

});

