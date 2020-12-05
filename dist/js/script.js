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
});

