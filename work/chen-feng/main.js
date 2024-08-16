mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmZlbmc5MjkiLCJhIjoiY2x6Znh3ZjVlMWR5djJpcTJtc2JoamFlbCJ9.p8sYODV2j8QLx1aheHvKLA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // Mapbox提供的浅色样式，接近单色效果
    center: [-73.962, 40.807], // 地图的初始中心点
    zoom: 17.15, // 地图的初始缩放级别
    bearing: 8.2, // 地图的初始方向
    pitch: 69, // 地图的初始倾斜度
    interactive: false // 禁用地图交互
    });

map.on('load', () => {
    // 添加3D建筑物图层
    map.addLayer({
        'id': '3d-buildings', // 图层ID
        'source': 'composite', // 数据源
        'source-layer': 'building', // 数据源中的图层
        'filter': ['==', 'extrude', 'true'], // 过滤条件，只显示extrude属性为true的建筑物
        'type': 'fill-extrusion', // 图层类型，填充拉伸
        'minzoom': 1, // 最小缩放级别
        'paint': {
            'fill-extrusion-color': 'rgba(255, 255, 255, 1)', // 填充颜色
            'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'], // 插值函数，根据缩放级别调整高度
                15, 0,
                15.05, ['get', 'height'] // 获取建筑物的高度属性
            ],
            'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'], // 插值函数，根据缩放级别调整基础高度
                15, 0,
                15.05, ['get', 'min_height'] // 获取建筑物的最小高度属性
            ],
            'fill-extrusion-opacity': 0.7 // 填充透明度
        }
    });
});

const chapters = {
    'chapter-1': { center: [-73.74, 40.711], zoom: 10.18, bearing: 0, pitch: 0 },
    'chapter-2': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-3': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-4': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-5': { center: [-73.95309, 40.72622], zoom: 12.82, bearing: 35.2, pitch: 73.5 },
    'chapter-6': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-7': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-8': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-9': { center: [-73.79, 40.725], zoom: 10.43, bearing: 0, pitch: 0 },
    'chapter-10': { center: [-74.27942, 39.06451], zoom: 3.3, bearing: 0, pitch: 5 },
    'chapter-11': { center: [100, 33], zoom: 1.5, bearing: 0, pitch: 0 },
};

let currentChapterIndex = 0;
const chapterNames = Object.keys(chapters);

window.onscroll = () => {
    for (let i = 0; i < chapterNames.length; i++) {
        const chapterName = chapterNames[i];
        const chapter = document.getElementById(chapterName);
        const rect = chapter.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            map.flyTo(chapters[chapterName]);
            currentChapterIndex = i;

            map.flyTo(chapters[chapterName]);
            currentChapterIndex = i;

            // 添加哥伦比亚大学的坐标点数据源和图层
            if (!map.getSource('columbia-university-source')) {
                map.addSource('columbia-university-source', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [-73.9626, 40.8075] // 哥伦比亚大学的经纬度坐标
                            },
                            properties: {
                                title: 'Columbia University'
                            }
                        }]
                    }
                });

                map.addLayer({
                    id: 'columbia-university-layer',
                    type: 'circle',
                    source: 'columbia-university-source',
                    paint: {
                        'circle-radius': 4, // 点的大小
                        'circle-color': '#0000FF', // 点的颜色
                        'circle-stroke-color': 'rgba(166, 81, 97, 0.7)', 
                        'circle-stroke-width': 1 // 外框宽度
                    }
                });

                // 添加文字标签图层
                map.addLayer({
                    id: 'columbia-university-label',
                    type: 'symbol',
                    source: 'columbia-university-source',
                    layout: {
                        'text-field': ['get', 'title'], // 获取属性中的title字段
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // 字体
                        'text-size': 8, // 文字大小
                        'text-offset': [0, -1.8], // 偏移量
                        'text-anchor': 'top' // 锚点
                    },
                    paint: {
                        'text-color': '#000000' // 文字颜色
                    }
                });
                // 将图层移动到最上层
                map.moveLayer('columbia-university-layer');
                map.moveLayer('columbia-university-label');
            }

            // 在地图加载完成后添加图层
            map.on('load', () => {
                map.addSource('rental', {
                    type: 'geojson',
                    data: 'Data/rental.geojson'
                });

                map.addLayer({
                    id: 'New_York_City',
                    type: 'fill',
                    source: 'rental',
                    layout: {},
                    paint: {
                        'fill-color': '#9e8267',
                        'fill-opacity': 0.3
                    }
                });

                // 添加 hotpot-restaurants 数据源
                map.addSource('hotpot-restaurants', {
                    type: 'geojson',
                    data: 'Data/NYC_Hotpot_Restaurants_New.geojson'
                });
            });
            
            // 在第一章节时添加图层
            if (chapterName === 'chapter-1') {
                if (!map.getSource('rental')) {
                    map.addSource('rental', {
                        type: 'geojson',
                        data: 'Data/rental.geojson'
                    });

                    map.addLayer({
                        id: 'New_York_City',
                        type: 'fill',
                        source: 'rental',
                        layout: {},
                        paint: {
                            'fill-color': '#9e8267',
                            'fill-opacity': 0.3
                        }
                    });
                }
            } else {
                // 离开第一章节时移除图层
                if (map.getLayer('New_York_City')) {
                    map.removeLayer('New_York_City');
                    map.removeSource('rental');
                }
            }

            // 在第三章节时添加Traffic图层
            if (chapterName === 'chapter-3') {
                if (!map.getSource('traffic')) {
                    map.addSource('traffic', {
                        type: 'geojson',
                        data: 'Data/Traffic.geojson'
                    });

                    map.addLayer({
                        id: 'traffic-points',
                        type: 'circle',
                        source: 'traffic',
                        paint: {
                            'circle-radius': 50,
                            'circle-color': [
                                'interpolate',
                                ['linear'],
                                ['get', 'travel_time'], // travel_time
                                50, 'rgb(124, 219, 0)', // 绿色
                                100, 'rgb(124, 219, 0)', 
                                200, 'rgba(246, 255, 0, 0.56)', 
                                300, 'rgba(255, 219, 15, 0.32)', 
                                500, 'rgb(240, 0, 0)'  // 红色
                            ],
                            'circle-opacity': 0.01,
                            'circle-blur': 0.6 // 设置模糊效果
                        }
                    });
                }
            } else {
                // 离开第三章节时移除图层
                if (map.getLayer('traffic-points')) {
                    map.removeLayer('traffic-points');
                    map.removeSource('traffic');
                }
            }
            
            // 在第四章节时添加 Range 图层
            if (chapterName === 'chapter-4') {
                if (!map.getSource('range-source')) {
                    map.addSource('range-source', {
                        type: 'geojson',
                        data: 'Data/NYC_Hotpot_Restaurants_New.geojson'
                    });

                    // 添加点图层
                    map.addLayer({
                        id: 'range-layer',
                        type: 'circle',
                        source: 'range-source',
                        paint: {
                            'circle-radius': 4, // 调整点的半径大小
                            'circle-color': '#8B0000', // 深红色填充
                            'circle-stroke-color': '#D2B48C', // 棕黄色外框
                            'circle-stroke-width': 1 // 外框宽度
                        }
                    });

                    // 添加第一个圆圈图层
                    map.addLayer({
                        id: 'range-circle-1',
                        type: 'circle',
                        source: 'range-source',
                        paint: {
                            'circle-radius': 150, // 第一个圆圈的半径
                            'circle-stroke-color': 'rgba(166, 81, 97, 0.4)', // 第一个圆圈的线条颜色
                            'circle-stroke-width': 0.3, // 第一个圆圈的线条宽度
                            'circle-color': 'rgba(166, 81, 97, 0.07)' // 透明填充
                        }
                    });
                }
            } else {
                // 离开第四章节时移除图层和源
                if (map.getLayer('range-layer')) {
                    map.removeLayer('range-layer');
                }
                if (map.getLayer('range-circle-1')) {
                    map.removeLayer('range-circle-1');
                }
                if (map.getLayer('range-circle-2')) {
                    map.removeLayer('range-circle-2');
                }
                if (map.getSource('range-source')) {
                    map.removeSource('range-source');
                }
            }

            // 在第五章节或第九章节时添加 rental 图层
            if (chapterName === 'chapter-5' || chapterName === 'chapter-9') {
                if (!map.getSource('rental')) {
                    map.addSource('rental', {
                        type: 'geojson',
                        data: 'Data/rental.geojson'
                    });
                }

                if (!map.getLayer('rental-layer')) {
                    map.addLayer({
                        id: 'rental-layer',
                        type: 'fill-extrusion', // 使用 fill-extrusion 类型
                        source: 'rental',
                        paint: {
                            'fill-extrusion-color': [
                                'interpolate',
                                ['linear'],
                                ['get', 'Average Rental Price'], // 根据租金数值填充颜色
                                30, 'rgba(164, 245, 140, 0.6)', // 低租金，浅绿色
                                40, 'rgba(255, 255, 15, 0.6)', // 中等租金，浅橙色
                                400, 'rgba(255, 170, 0, 0.6)', // 高租金，橙色
                                2600, 'rgba(247, 2, 2, 0.5)', // 更高租金，红色
                                3000, 'rgba(112, 11, 11, 0.8)' // 最高租金，深红色
                            ],
                            'fill-extrusion-height': [
                                'interpolate',
                                ['linear'],
                                ['get', 'Average Rental Price'], // 根据租金数值调整高度
                                30, 10, // 低租金，低高度
                                3000, 300 // 高租金，高高度
                            ],
                            'fill-extrusion-opacity': 0.5 // 调整透明度
                        }
                    }, 'waterway-label'); // 将图层添加到最下层
                }
            } else {
                // 离开第五章节或第九章节时移除 rental 图层
                if (map.getLayer('rental-layer')) {
                    map.removeLayer('rental-layer');
                }
                if (map.getSource('rental')) {
                    map.removeSource('rental');
                }
            }
            // 在第六到第十章节时添加 hotpot-restaurants 图层
            if (['chapter-6', 'chapter-7', 'chapter-8', 'chapter-9', 'chapter-10'].includes(chapterName)) {
                if (!map.getSource('hotpot-restaurants')) {
                    map.addSource('hotpot-restaurants', {
                        type: 'geojson',
                        data: 'Data/NYC_Hotpot_Restaurants_New.geojson'
                    });
                }

                if (!map.getLayer('hotpot-layer')) {
                    map.addLayer({
                        id: 'hotpot-layer',
                        type: 'circle',
                        source: 'hotpot-restaurants',
                        paint: {
                            'circle-radius': 4, // 调整点的半径大小
                            'circle-color': '#8B0000', // 深红色填充
                            'circle-stroke-color': '#D2B48C', // 棕黄色外框
                            'circle-stroke-width': 1 // 外框宽度
                        }
                    });

                    map.addLayer({
                        id: 'hotpot-labels',
                        type: 'symbol',
                        source: 'hotpot-restaurants',
                        layout: {
                            'text-field': ['get', 'name'], // 显示属性名称
                            'text-size': 8, // 调整文字大小
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        },
                        paint: {
                            'text-color': '#000000' // 文字颜色
                        }
                    });
                }
            } else {
                // 离开第六到第十章节时移除 hotpot-restaurants 图层
                if (map.getLayer('hotpot-layer')) {
                    map.removeLayer('hotpot-layer');
                }
                if (map.getLayer('hotpot-labels')) {
                    map.removeLayer('hotpot-labels');
                }
                if (map.getSource('hotpot-restaurants')) {
                    map.removeSource('hotpot-restaurants');
                }
            }
            // 在第七章节时添加 Drone_Route 图层
            if (chapterName === 'chapter-7') {
                fetch('Data/NYC_Hotpot_Restaurants_New.geojson')
                    .then(response => response.json())
                    .then(data => {
                        // 添加火锅店坐标点图层
                        if (!map.getSource('hotpot-restaurants')) {
                            map.addSource('hotpot-restaurants', {
                                type: 'geojson',
                                data: data
                            });
                        }
                        if (!map.getLayer('hotpot-layer')) {
                            map.addLayer({
                                id: 'hotpot-layer',
                                type: 'circle',
                                source: 'hotpot-restaurants',
                                paint: {
                                    'circle-radius': 4, // 调整点的半径大小
                                    'circle-color': '#8B0000', // 深红色填充
                                    'circle-stroke-color': '#D2B48C', // 棕黄色外框
                                    'circle-stroke-width': 1 // 外框宽度
                                }
                            });
                        }

                        // 添加连接线段图层
                        const columbiaUniversity = [-73.9626, 40.8075]; // 哥伦比亚大学坐标
                        const lines = {
                            type: 'FeatureCollection',
                            features: data.features.map(feature => ({
                                type: 'Feature',
                                geometry: {
                                    type: 'LineString',
                                    coordinates: [feature.geometry.coordinates, columbiaUniversity]
                                }
                            }))
                        };

                        if (!map.getSource('drone-route')) {
                            map.addSource('drone-route', {
                                type: 'geojson',
                                data: lines
                            });
                        }
                        if (!map.getLayer('drone-route-layer')) {
                            map.addLayer({
                                id: 'drone-route-layer',
                                type: 'line',
                                source: 'drone-route',
                                paint: {
                                    'line-width': 1,
                                    'line-color': 'rgba(88, 122, 209, 0.6)' // 0.5表示50%的透明度
                                }
                            });

                            // 监听线段点击事件
                            map.on('click', 'drone-route-layer', (e) => {
                                const coordinates = e.features[0].geometry.coordinates;
                                const line = turf.lineString(coordinates);
                                const length = turf.length(line, { units: 'miles' });

                                // 计算时间，单位为分钟
                                const speedMph = 35; // 35英里每小时
                                const timeMinutes = (length / speedMph) * 60;

                                // 创建一个弹出框并显示距离和时间
                                new mapboxgl.Popup()
                                    .setLngLat(e.lngLat)
                                    .setHTML(`<p>Distance: ${length.toFixed(2)} miles</p><p>Time: ${timeMinutes.toFixed(2)} minutes</p>`)
                                    .addTo(map);
                            });

                            // 改变鼠标指针样式
                            map.on('mouseenter', 'drone-route-layer', () => {
                                map.getCanvas().style.cursor = 'pointer';
                            });
                            map.on('mouseleave', 'drone-route-layer', () => {
                                map.getCanvas().style.cursor = '';
                            });
                        }
                    });
            } else {
                // 离开第七章节时移除 Drone_Route 图层
                if (map.getLayer('drone-route-layer')) {
                    map.removeLayer('drone-route-layer');
                }
                if (map.getSource('drone-route')) {
                    map.removeSource('drone-route');
                }
            }
            // 在第八章节时添加 Drone_Range 图层
            if (chapterName === 'chapter-8') {
                fetch('Data/NYC_Hotpot_Restaurants_New.geojson')
                    .then(response => response.json())
                    .then(data => {
                        // 添加 Drone_Range 图层
                        if (!map.getSource('drone-range')) {
                            map.addSource('drone-range', {
                                type: 'geojson',
                                data: data
                            });
                        }

                        if (!map.getLayer('drone-range-layer-small')) {
                            map.addLayer({
                                id: 'drone-range-layer-small',
                                type: 'circle',
                                source: 'drone-range',
                                paint: {
                                    'circle-radius': 150, // 第一个圆圈的半径
                                    'circle-stroke-color': 'rgba(166, 81, 97, 0.5)', // 第一个圆圈的线条颜色
                                    'circle-stroke-width': 1, // 第一个圆圈的线条宽度
                                    'circle-color': 'rgba(166, 81, 97, 0.04)' // 透明填充
                                }
                            });
                        }

                        if (!map.getLayer('drone-range-layer-large')) {
                            map.addLayer({
                                id: 'drone-range-layer-large',
                                type: 'circle',
                                source: 'drone-range',
                                paint: {
                                    'circle-radius': 320, // 第一个圆圈的半径
                                    'circle-stroke-color': 'rgba(79, 175, 196, 0.5)', // 第一个圆圈的线条颜色
                                    'circle-stroke-width': 1, // 第一个圆圈的线条宽度
                                    'circle-color': 'rgba(79, 175, 196, 0.02)' // 透明填充
                                }
                            });
                        }
                    });
            } else {
                // 离开第八章节时移除 Drone_Range 图层
                if (map.getLayer('drone-range-layer-small')) {
                    map.removeLayer('drone-range-layer-small');
                }
                if (map.getLayer('drone-range-layer-large')) {
                    map.removeLayer('drone-range-layer-large');
                }
                if (map.getSource('drone-range')) {
                    map.removeSource('drone-range');
                }
            }
            // 在第十章节时添加 Zone 图层
            if (chapterName === 'chapter-10') {
                if (!map.getSource('zone-source')) {
                    map.addSource('zone-source', {
                        type: 'geojson',
                        data: 'Data/National_Security_UAS_Flight_Restrictions.geojson'
                    });

                    // 添加多边形图层
                    map.addLayer({
                        id: 'zone-layer',
                        type: 'fill',
                        source: 'zone-source',
                        paint: {
                            'fill-color': 'rgba(200, 0, 0, 0.5)', // 红色，半透明
                            'fill-outline-color': 'rgba(200, 0, 0, 1)' // 红色，实线
                        }
                    });
                }
            } else {
                // 离开第十章节时移除图层和源
                if (map.getLayer('zone-layer')) {
                    map.removeLayer('zone-layer');
                }
                if (map.getSource('zone-source')) {
                    map.removeSource('zone-source');
                }
            }
            // 在第十一章节时添加 WorldFlight 图层
            if (chapterName === 'chapter-11') {
                if (!map.getSource('world-flight-source')) {
                    fetch('Data/airline_routes.json')
                        .then(response => response.json())
                        .then(data => {
                            const features = [];

                            for (const airportCode in data) {
                                const airport = data[airportCode];
                                const { latitude, longitude, routes } = airport;

                                routes.forEach(route => {
                                    const destination = data[route.iata];
                                    if (destination) {
                                        features.push({
                                            type: 'Feature',
                                            geometry: {
                                                type: 'LineString',
                                                coordinates: [
                                                    [parseFloat(longitude), parseFloat(latitude)],
                                                    [parseFloat(destination.longitude), parseFloat(destination.latitude)]
                                                ]
                                            },
                                            properties: {
                                                airline: route.carriers.map(carrier => carrier.name).join(', '),
                                                distance: route.km
                                            }
                                        });
                                    }
                                });
                            }

                            const geojson = {
                                type: 'FeatureCollection',
                                features: features
                            };

                            map.addSource('world-flight-source', {
                                type: 'geojson',
                                data: geojson
                            });

                            map.addLayer({
                                id: 'world-flight-layer',
                                type: 'line',
                                source: 'world-flight-source',
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                paint: {
                                    'line-color': 'rgba(138, 206, 237, 0.3)', // 线条颜色
                                    'line-width': 0.04 // 线条宽度
                                }
                            });
                        });
                }
            } else {
                // 离开第十一章节时移除图层和源
                if (map.getLayer('world-flight-layer')) {
                    map.removeLayer('world-flight-layer');
                }
                if (map.getSource('world-flight-source')) {
                    map.removeSource('world-flight-source');
                }
            }
        }
    }
};
const scrollToNextChapter = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    if (currentChapterIndex < chapterNames.length - 1) {
        currentChapterIndex++;
        const nextChapter = document.getElementById(chapterNames[currentChapterIndex]);
        nextChapter.scrollIntoView({ behavior: 'smooth' });
    }
};

document.querySelector('.scroll-indicator').addEventListener('click', scrollToNextChapter);
document.querySelector('.scroll-indicator .triangle').addEventListener('click', scrollToNextChapter);