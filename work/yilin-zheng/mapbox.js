mapboxgl.accessToken = 'pk.eyJ1IjoicXVpeWlsIiwiYSI6ImNsemoxNHlhMTBsa2UyaXByd3pvcjM4ZjgifQ.JTxA-uHyVmgrVrRoNJiAyA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/quiyil/clzs1hi5j00g301qs202bgqyb',
    center: [-74.0060, 40.7128],
    zoom: 9
});

var chapters = {
    'chapter-1': { center: [-73.74, 40.711], zoom: 10.18},
    'chapter-2': { center: [-73.901, 40.695], zoom: 10.88},
    'chapter-3': { center: [-73.77, 40.7], zoom: 10.5},
    'chapter-4': { center: [-73.77, 40.7], zoom: 10.5},
    'chapter-5': { center: [-73.77, 40.7], zoom: 10.5},
};

map.on('load', function() {
    var layers = map.getStyle().layers;
    layers.forEach(layer => {
        console.log('Layer ID:', layer.id);
    });

    // Setup chapter clicks
    document.querySelectorAll('.chapter').forEach(function(chapter) {
        chapter.addEventListener('click', function() {
            var chapterId = chapter.id;

            // Fly to the specific part of the map
            map.flyTo({
                center: chapters[chapterId].center,
                zoom: chapters[chapterId].zoom
            });

            // Hide all layers first
            Object.keys(chapters).forEach(function(key) {
                var layerId = chapters[key].layer;
                if (map.getLayer(layerId)) {
                    map.setLayoutProperty(layerId, 'visibility', 'none');
                }
            });

            // Then show the current chapter's layer
            var currentLayerId = chapters[chapterId].layer;
            if (map.getLayer(currentLayerId)) {
                map.setLayoutProperty(currentLayerId, 'visibility', 'visible');
            }
        });
    });
});

// function setupLayers() {
//     map.on('load', function() {
//         // Example of adding a layer
//         map.addLayer({
//             'id': 'overview-layer',
//             'type': 'fill',
//             'source': 'some-source', // This should be defined in your style or added as a new source
//             'layout': {},
//             'paint': {
//                 'fill-color': '#888',
//                 'fill-opacity': 0.4
//             },
//             'filter': ['==', '$type', 'Polygon']
//         }, 'waterway-label'); // This second parameter ensures the layer is added below labels

//         // You can add more layers for other chapters similarly
//     });
// }
// setupLayers();


// let currentChapterIndex = 0;
// const chapterNames = Object.keys(chapters);

// // 在地图加载完成后添加图层
// map.on('load', () => {
//     map.addSource('rental', {
//         type: 'geojson',
//         data: 'Data/rental.geojson'
//     });

//     map.addLayer({
//         id: 'New_York_City',
//         type: 'fill',
//         source: 'rental',
//         layout: {},
//         paint: {
//             'fill-color': '#9e8267',
//             'fill-opacity': 0.3
//         }
//     });

//     // 添加 hotpot-restaurants 数据源
//     map.addSource('hotpot-restaurants', {
//         type: 'geojson',
//         data: 'Data/NYC_Hotpot_Restaurants_New.geojson'
//     });
// });

// window.onscroll = () => {
//     for (let i = 0; i < chapterNames.length; i++) {
//         const chapterName = chapterNames[i];
//         const chapter = document.getElementById(chapterName);
//         const rect = chapter.getBoundingClientRect();
//         if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
//             map.flyTo(chapters[chapterName]);
//             currentChapterIndex = i;

//             // 在第一章节时添加图层
//             if (chapterName === 'chapter-1') {
//                 if (!map.getSource('rental')) {
//                     map.addSource('rental', {
//                         type: 'geojson',
//                         data: 'Data/rental.geojson'
//                     });

//                     map.addLayer({
//                         id: 'New_York_City',
//                         type: 'fill',
//                         source: 'rental',
//                         layout: {},
//                         paint: {
//                             'fill-color': '#9e8267',
//                             'fill-opacity': 0.3
//                         }
//                     });
//                 }
//             } else {
//                 // 离开第一章节时移除图层
//                 if (map.getLayer('New_York_City')) {
//                     map.removeLayer('New_York_City');
//                     map.removeSource('rental');
//                 }
//             }

//             // 在第二章节时添加图层
//             if (chapterName === 'chapter-2') {
//                 if (!map.getSource('road')) {
//                     map.addSource('road', {
//                         type: 'geojson',
//                         data: 'Data/road.geojson'
//                     });

//                     map.addLayer({
//                         id: 'road-layer',
//                         type: 'line',
//                         source: 'road',
//                         layout: {},
//                         paint: {
//                             'line-color': '#9e8267',
//                             'line-width': 0.8
//                         }
//                     });
//                 }
//             } else {
//                 // 离开第二章节时移除图层
//                 if (map.getLayer('road-layer')) {
//                     map.removeLayer('road-layer');
//                     map.removeSource('road');
//                 }
//             }

//             // 在第三章节时添加Traffic图层
//             if (chapterName === 'chapter-3') {
//                 if (!map.getSource('traffic')) {
//                     map.addSource('traffic', {
//                         type: 'geojson',
//                         data: 'Data/Traffic.geojson'
//                     });
            
//                     map.addLayer({
//                         id: 'traffic-points',
//                         type: 'circle',
//                         source: 'traffic',
//                         paint: {
//                             'circle-radius': 30,
//                             'circle-color': [
//                                 'interpolate',
//                                 ['linear'],
//                                 ['get', 'travel_time'], // 使用小写的 travel_time
//                                 0, 'rgba(0, 128, 0, 0.03)', // 深绿色
//                                 100, 'rgba(34, 139, 34, 0.03)', // 森林绿
//                                 200, 'rgba(173, 255, 47, 0.03)', // 黄绿色
//                                 300, 'rgba(255, 215, 0, 0.06)', // 金色
//                                 400, 'rgba(255, 69, 0, 0.06)'  // 橙红色
//                             ]
//                         }
//                     });
//                 }
//             } else {
//                 // 离开第三章节时移除图层
//                 if (map.getLayer('traffic-points')) {
//                     map.removeLayer('traffic-points');
//                     map.removeSource('traffic');
//                 }
//             }

//             // 在第四章节时添加 hotpot-restaurants 图层
//             if (chapterName === 'chapter-4' || chapterName === 'chapter-5') {
//                 if (!map.getSource('hotpot-restaurants')) {
//                     map.addSource('hotpot-restaurants', {
//                         type: 'geojson',
//                         data: 'Data/NYC_Hotpot_Restaurants_New.geojson'
//                     });
//                 }

//                 if (!map.getLayer('hotpot-layer')) {
//                     map.addLayer({
//                         id: 'hotpot-layer',
//                         type: 'circle',
//                         source: 'hotpot-restaurants',
//                         paint: {
//                             'circle-radius': 7, // 调整点的半径大小
//                             'circle-color': '#8B0000', // 深红色填充
//                             'circle-stroke-color': '#D2B48C', // 棕黄色外框
//                             'circle-stroke-width': 2 // 外框宽度
//                         }
//                     });

//                     map.addLayer({
//                         id: 'hotpot-labels',
//                         type: 'symbol',
//                         source: 'hotpot-restaurants',
//                         layout: {
//                             'text-field': ['get', 'name'], // 显示属性名称
//                             'text-size': 8, // 调整文字大小
//                             'text-offset': [0, 1.25],
//                             'text-anchor': 'top'
//                         },
//                         paint: {
//                             'text-color': '#000000' // 文字颜色
//                         }
//                     });
//                 }
//             } else {
//                 // 离开第五章节时移除 hotpot-restaurants 图层
//                 if (map.getLayer('hotpot-layer')) {
//                     map.removeLayer('hotpot-layer');
//                 }
//                 if (map.getLayer('hotpot-labels')) {
//                     map.removeLayer('hotpot-labels');
//                 }
//                 if (map.getSource('hotpot-restaurants')) {
//                     map.removeSource('hotpot-restaurants');
//                 }
//             }

//             // 在第五章节时添加 rental 图层
//             if (chapterName === 'chapter-5') {
//                 if (!map.getSource('rental')) {
//                     map.addSource('rental', {
//                         type: 'geojson',
//                         data: 'Data/rental.geojson'
//                     });
//                 }

//                 if (!map.getLayer('rental-layer')) {
//                     map.addLayer({
//                         id: 'rental-layer',
//                         type: 'fill',
//                         source: 'rental',
//                         paint: {
//                             'fill-color': [
//                                 'interpolate',
//                                 ['linear'],
//                                 ['get', 'Average Rental Price'], // 根据租金数值填充颜色
//                                 0, 'rgba(255, 255, 178, 0.6)', // 低租金，浅黄色
//                                 1000, 'rgba(254, 204, 92, 0.6)', // 中等租金，浅橙色
//                                 2000, 'rgba(253, 141, 60, 0.6)', // 高租金，橙色
//                                 3000, 'rgba(240, 59, 32, 0.6)', // 更高租金，红色
//                                 4000, 'rgba(189, 0, 38, 0.6)' // 最高租金，深红色
//                             ],
//                             'fill-opacity': 0.9 // 调整透明度
//                         }
//                     });

//                     // 将 rental 图层移动到 hotpot 图层之下
//                     map.moveLayer('rental-layer', 'hotpot-layer');
//                 }
//             } else {
//                 // 离开第五章节时移除 rental 图层
//                 if (map.getLayer('rental-layer')) {
//                     map.removeLayer('rental-layer');
//                 }
//                 if (map.getSource('rental')) {
//                     map.removeSource('rental');
//                 }
//             }
//         }
//     }
// };

// const scrollToNextChapter = (event) => {
//     event.stopPropagation(); // 阻止事件冒泡
//     if (currentChapterIndex < chapterNames.length - 1) {
//         currentChapterIndex++;
//         const nextChapter = document.getElementById(chapterNames[currentChapterIndex]);
//         nextChapter.scrollIntoView({ behavior: 'smooth' });
//     }
// };

// document.querySelector('.scroll-indicator').addEventListener('click', scrollToNextChapter);
// document.querySelector('.scroll-indicator .triangle').addEventListener('click', scrollToNextChapter);