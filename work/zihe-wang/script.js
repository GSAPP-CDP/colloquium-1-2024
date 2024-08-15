mapboxgl.accessToken = 'pk.eyJ1IjoiemloZXdhbmciLCJhIjoiY2x6bHB5M29iMDVtbDJub3BwdTJ0bzF4ZCJ9.w-po7ajkWC4c0uylaDc8Qg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/zihewang/clzlq16ih004f01qsgcagfyn0',
    center: [-73.9857, 40.7288],
    zoom: 10,
    pitch: 0,
    bearing: 0,
    interactive: false
});

// 定义每个章节的配置
const chapters = {
    'chapter-1': { center: [-73.9857, 40.7288], zoom: 10, bearing: 0, pitch: 0 },
    'chapter-2': { center: [-73.9718, 40.7821], zoom: 11, bearing: 0, pitch: 0 },
    'chapter-3': { center: [-73.9906, 40.7511], zoom: 12.5, bearing: 0, pitch: 0 },
    'chapter-4': { center: [-73.9890, 40.7428], zoom: 13, bearing: -10, pitch: 60 },
    'chapter-5': { center: [-73.9890, 40.7428], zoom: 12.5, bearing: -10, pitch: 60 },
    'chapter-6': { center: [-73.9857, 40.7288], zoom: 13.5, bearing: 0, pitch: 0 }  // 新增的第六章
};

const chapterNames = Object.keys(chapters);

map.on('load', () => {
    // 添加白色透明图层覆盖底图
    map.addLayer({
        id: 'white-overlay',
        type: 'fill',
        source: {
            type: 'geojson',
            data: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [[
                                [-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]
                            ]]
                        }
                    }
                ]
            }
        },
        paint: {
            'fill-color': 'rgba(255, 255, 255, 0.4)' // 白色，透明度40%
        }
    });
    
    // 添加 rental 图层
    map.addSource('rental', {
        type: 'geojson',
        data: './rental.geojson'
    });

    map.addLayer({
        id: 'New_York_City',
        type: 'fill',
        source: 'rental',
        layout: {},
        paint: {
            'fill-color': '#9e8267',
            'fill-opacity': 0.2
        }
    });

    // 确保 rental 图层在 parking-positions-layer 之下
    map.addSource('parking-positions', {
        type: 'geojson',
        data: './parking_positions.geojson'
    });

    map.addLayer({
        id: 'parking-positions-layer',
        type: 'circle',
        source: 'parking-positions',
        paint: {
            'circle-radius': 4,
            'circle-color': '#d6ff6e' // 亮黄色
        }
    });

    // Industry Data
    map.addSource('industry-data', {
        type: 'geojson',
        data: './Industry_data.geojson'
    });

    map.addLayer({
        id: 'industry-layer',
        type: 'circle',
        source: 'industry-data',
        paint: {
            'circle-radius': [
                'match',
                ['get', 'Industry'], // 使用正确的属性名称大小写
                'Garage', 8,
                'Parking Lot', 6,
                'Garage and Parking Lot', 10,
                5 // 默认半径
            ],
            'circle-color': [
                'match',
                ['get', 'Industry'], // 使用正确的属性名称大小写
                'Garage', 'rgba(255, 105, 180, 0.6)', // 粉色
                'Parking Lot', 'rgba(255, 140, 0, 0.6)', // 橙色
                'Garage and Parking Lot', 'rgba(138, 43, 226, 0.6)', // 紫色
                'rgba(255, 0, 0, 0.6)' // 默认红色
            ],
            'circle-opacity': 0.6 // 设置透明度
        }
    });

    // Open Hours Data
    map.addSource('hours-data', {
        type: 'geojson',
        data: './Open_Hours_data.geojson'
    });
    map.addLayer({
        id: 'hours-layer',
        type: 'circle',
        source: 'hours-data',
        paint: {
            'circle-radius': [
                'match', ['get', 'Open_Hours'],
                '24 hours', 12,         // 更大的半径表示全天开放的停车点
                '6am-11pm', 10,         // 中等大小的圆圈表示早上6点到晚上11点开放
                '7am-9pm', 8,          // 较小的圆圈表示早上7点到晚上9点开放
                '8am-10pm', 8,         // 较小的圆圈表示早上8点到晚上10点开放
                4                     // 默认半径
            ],
            'circle-color': [
                'match', ['get', 'Open_Hours'],
                '24 hours', 'rgba(60, 179, 113, 0.6)',  // 深紫色
                '6am-11pm', 'rgba(70, 130, 180, 0.6)',  // 中等绿色
                '7am-9pm', 'rgba(100, 149, 237, 0.6)',  // 橙色
                '8am-10pm', 'rgba(72, 61, 139, 0.6)',  // 深红色
                'rgba(30, 144, 255, 0.8)'              // 默认为天蓝色
            ],
        }
    });

    // Price Data
    map.addSource('price-data', {
        type: 'geojson',
        data: './Price_data.geojson'
    });

    map.addLayer({
        id: 'price-layer',
        type: 'circle',
        source: 'price-data',
        paint: {
            'circle-radius': 6, // 设置点的半径
            'circle-color': [
                'step',
                ['get', 'Price'],
                'rgba(255, 245, 235, 0.6)', 5,   // 5-9: 浅橙色
                'rgba(255, 218, 185, 0.6)', 10,  // 10-14: 橙色
                'rgba(255, 178, 102, 0.6)', 15,  // 15-19: 深橙色
                'rgba(255, 140, 0, 0.6)', 20,    // 20-24: 更深的橙色
                'rgba(205, 92, 0, 0.6)'          // 25-29: 深棕橙色
            ],
            'circle-opacity': 1 // 设置透明度
        }
    });

    // Capacity Data
    map.addSource('capacity-data', {
        type: 'geojson',
        data: './Capacity_data.geojson'
    });

    map.addLayer({
        id: 'capacity-layer',
        type: 'circle',
        source: 'capacity-data',
        paint: {
            'circle-radius': 6, // 设置点的半径
            'circle-color': [
                'step',
                ['get', 'Capacity'],
                'rgba(255, 182, 193, 0.6)', 50,   // 50-99: 浅粉红色
                'rgba(255, 105, 180, 0.6)', 100,  // 100-199: 粉红色
                'rgba(255, 20, 147, 0.6)', 200,   // 200-299: 深粉红色
                'rgba(219, 112, 147, 0.6)', 300,  // 300-399: 中等深粉红色
                'rgba(199, 21, 133, 0.6)'        // 400-499: 深玫瑰色
            ],
            'circle-opacity': 0.8 // 设置透明度
        }
    });

    // Parking Allowed vs Not Allowed Data
    map.addSource('parking-status', {
        type: 'geojson',
        data: './combined_parking.geojson'
    });

    map.addLayer({
        id: 'parking-status-layer',
        type: 'circle',
        source: 'parking-status',
        paint: {
            'circle-radius': 4,
            'circle-color': [
                'match',
                ['get', 'parking_allowed'],
                'True', 'rgba(0, 255, 0, 0.6)',  // 绿色表示允许停车
                'False', 'rgba(255, 0, 0, 0.6)', // 红色表示禁止停车
                'rgba(128, 128, 128, 0.6)'       // 默认颜色
            ]
        }
    });

    // 监听滚动事件，根据章节更改地图
    window.onscroll = () => {
        for (let i = 0; i < chapterNames.length; i++) {
            const chapterName = chapterNames[i];
            const chapter = document.getElementById(chapterName);
            const rect = chapter.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                map.flyTo(chapters[chapterName]);

                // 控制图层的可见性
                switch (chapterName) {
                    case 'chapter-1':
                        map.setLayoutProperty('parking-positions-layer', 'visibility', 'visible');
                        map.setLayoutProperty('industry-layer', 'visibility', 'none');
                        map.setLayoutProperty('hours-layer', 'visibility', 'none');
                        map.setLayoutProperty('price-layer', 'visibility', 'none');
                        map.setLayoutProperty('capacity-layer', 'visibility', 'none');
                        map.setLayoutProperty('parking-status-layer', 'visibility', 'none');
                        break;
                    case 'chapter-2':
                        map.setLayoutProperty('parking-positions-layer', 'visibility', 'none');
                        map.setLayoutProperty('industry-layer', 'visibility', 'visible');
                        map.setLayoutProperty('hours-layer', 'visibility', 'none');
                        map.setLayoutProperty('price-layer', 'visibility', 'none');
                        map.setLayoutProperty('capacity-layer', 'visibility', 'none');
                        map.setLayoutProperty('parking-status-layer', 'visibility', 'none');
                        break;
                    case 'chapter-3':
                        map.setLayoutProperty('parking-positions-layer', 'visibility', 'none');
                        map.setLayoutProperty('industry-layer', 'visibility', 'none');
                        map.setLayoutProperty('hours-layer', 'visibility', 'visible');
                        map.setLayoutProperty('price-layer', 'visibility', 'none');
                        map.setLayoutProperty('capacity-layer', 'visibility', 'none');
                        map.setLayoutProperty('parking-status-layer', 'visibility', 'none');
                        break;
                    case 'chapter-4':
                        map.setLayoutProperty('parking-positions-layer', 'visibility', 'none');
                        map.setLayoutProperty('industry-layer', 'visibility', 'none');
                        map.setLayoutProperty('hours-layer', 'visibility', 'none');
                        map.setLayoutProperty('price-layer', 'visibility', 'visible');
                        map.setLayoutProperty('capacity-layer', 'visibility', 'none');
                        map.setLayoutProperty('parking-status-layer', 'visibility', 'none');
                        break;
                    case 'chapter-5':
                        map.setLayoutProperty('parking-positions-layer', 'visibility', 'none');
                        map.setLayoutProperty('industry-layer', 'visibility', 'none');
                        map.setLayoutProperty('hours-layer', 'visibility', 'none');
                        map.setLayoutProperty('price-layer', 'visibility', 'none');
                        map.setLayoutProperty('capacity-layer', 'visibility', 'visible');
                        map.setLayoutProperty('parking-status-layer', 'visibility', 'none');
                        break;
                    case 'chapter-6':
                        map.setLayoutProperty('parking-positions-layer', 'visibility', 'none');
                        map.setLayoutProperty('industry-layer', 'visibility', 'none');
                        map.setLayoutProperty('hours-layer', 'visibility', 'none');
                        map.setLayoutProperty('price-layer', 'visibility', 'none');
                        map.setLayoutProperty('capacity-layer', 'visibility', 'none');
                        map.setLayoutProperty('parking-status-layer', 'visibility', 'visible');
                        break;
                }
            }
        }
    };
});

document.querySelector('.scroll-indicator').addEventListener('click', scrollToNextChapter);
