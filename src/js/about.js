let firstSlider = new Swiper('.firstSlider', {
  loop: true,
  navigation: {
    nextEl: '.firstSlider-next',
    prevEl: '.firstSlider-prev',
  }
})
let secondSlider = new Swiper('.secondSlider', {
  loop: true,
  navigation: {
    nextEl: '.secondSlider-next',
    prevEl: '.secondSlider-prev',
  }
})
let thirdSlider = new Swiper('.thirdSlider', {
  loop: true,
  navigation: {
    nextEl: '.thirdSlider-next',
    prevEl: '.thirdSlider-prev',
  }
})


$(document).ready(function () {
  $(".location-list__item").click(function () {
    let filterAll = $(".location-list").children()[0]
    if(filterAll == $(this)[0]) {
      $(".location-list").children().removeClass("active")
      $(this).addClass("active");
    } else {
      filterAll.classList.remove("active");
      $(this).toggleClass("active");
    }
  })
})