ymaps.ready(init);

function init() {
    var LAYER_NAME = 'user#layer';
    MAP_TYPE_NAME = 'user#customMap';
    TILES_PATH = 'img/map/tile',
    MAX_ZOOM = 4,
    PIC_WIDTH = 1200,
    PIC_HEIGHT = 668;


    var Layer = function() {
        var layer = new ymaps.Layer(TILES_PATH + '/%z/tile-%x-%y.jpg', {
        });
        layer.getZoomRange = function () {
            return ymaps.vow.resolve([0, 4]);
        };
        layer.getCopyrights = function () {
            return ymaps.vow.resolve('©');
        };
        return layer;
    };
    ymaps.layer.storage.add(LAYER_NAME, Layer);
    var mapType = new ymaps.MapType(MAP_TYPE_NAME, [LAYER_NAME]);
    ymaps.mapType.storage.add(MAP_TYPE_NAME, mapType);
    var worldSize = Math.pow(2, MAX_ZOOM) * 256
    var myMap = new ymaps.Map('map', {
            center: [0, 0],
            zoom: 0,
            controls: [],
            type: MAP_TYPE_NAME
        }, {
            projection: new ymaps.projection.Cartesian([[PIC_HEIGHT / 2 - worldSize, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, worldSize - PIC_WIDTH / 2]], [false, false]),
            restrictMapArea: [[-PIC_HEIGHT / 2, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, PIC_WIDTH / 2]]
        })
    var objectManager = new ymaps.ObjectManager({})
    myMap.geoObjects.add(objectManager);

    // Создадим 5 пунктов выпадающего списка.
    var listBoxItems = ['Развлечения', 'Культура', 'Школы', 'Детские сады', 'Здоровье']
            .map(function (title) {
                return new ymaps.control.ListBoxItem({
                    data: {
                        content: title
                    },
                    state: {
                        selected: false
                    }
                })
            }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Теперь создадим список, содержащий 5 пунктов.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Фильтр',
                title: 'Фильтр'
            },
            items: listBoxItems,
            state: {
                // Признак, развернут ли список.
                expanded: true,
                filters: listBoxItems.reduce(reducer, {})
            }
        });
    myMap.controls.add(listBoxControl);
    myMap.behaviors.disable('drag');

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });
    
    // Создаем меню фильтрации
    listBoxItems.forEach((item, idx) => $(".location-list").append("<li class=\"location-list__item\"id=\"ya-map-"+idx+"\">" +item.data._data.content + "</li>"));

    // Добавляем обработчик на каждый элемент меню
    document
        .querySelectorAll(".location-list__item")
        .forEach(item => item.addEventListener('click', e => myFilter(e)))

    let isAll = false;
    // Симуляция клика по менюшке которая на карте
    const myFilter = e => {        
        let filterAll = $(".location-list").children()[0]
        if(filterAll == $(e.target)[0]) {
          $(".location-list").children().removeClass("active")
          $(e.target).addClass("active");
        } else {
          filterAll.classList.remove("active");
          $(e.target).toggleClass("active");
        }
        
        let yaMapListBoxItems = ymaps.util.extend({}, listBoxControl.state.get('filters'))
        let nameOfFilter = e.target.innerText.substr(0, 1).toUpperCase() + e.target.innerText.substr(1).toLowerCase()
        
        if(nameOfFilter == "Все объекты") {
            let temp = Object.assign({}, yaMapListBoxItems)
            temp[Symbol.iterator] = function* () {
                var k;
                for(k in this) {
                    yield [k, this[k]]
                }
            }
            isAll = !isAll
            for(item of temp) {
                 yaMapListBoxItems[item[0]] = isAll;
            }
        } else {
            yaMapListBoxItems[nameOfFilter] = !yaMapListBoxItems[nameOfFilter];
        }
        let result = listBoxControl.state.set('filters', yaMapListBoxItems);
        getFilterFunction(result)
    };
    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        objectManager.setFilter(getFilterFunction(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
            var content = obj.properties.balloonContent;
            return categories[content];
        }
    }
    var placemark = new ymaps.Placemark([0, -50], {
        hintContent: "Наш офис",
        balloonContentHeader: '<b class="my-company-baloon__header">IQ квартал</b>',
        balloonContentBody: '<span class=\"my-company-baloon__body\">Ленина, 35</span>'
    }, {
        iconLayout: "default#image",
        iconImageHref: "img/map/index.svg",
        iconImageSize: [50, 50],
        balloonOffset: [80, -30],
        balloonCloseButton: false,
        hideIconOnBalloonOpen: false,
        balloonMinWidth: 300,
        balloonMinHeight: 50,
        balloonShadowOffset: [0, 2.43346, 2.43346]
    })
    myMap.geoObjects.add(placemark);
    myMap.geoObjects.options.set('balloonPanelMaxMapArea', 0)
    placemark.balloon.open();
    $.ajax({
        url: "https://api.jsonbin.io/b/5fce251c516f9d1270293446/4"
    }).done(function (data) {
        objectManager.add(data);
    });

}