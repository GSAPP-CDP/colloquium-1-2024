mapboxgl.accessToken = 'pk.eyJ1IjoiemloZXdhbmciLCJhIjoiY2x6bHB5M29iMDVtbDJub3BwdTJ0bzF4ZCJ9.w-po7ajkWC4c0uylaDc8Qg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/zihewang/clzrlm3pp00fd01qs3g1bfgzo', // 使用您自己的Mapbox底图样式
    center: [-73.9857, 40.7580], // 曼哈顿的中心点
    zoom: 14,
    interactive: true
});

let destinationMarker;
let userLocation;
let routeLayerId = null;

// 获取设备当前位置
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const coords = [position.coords.longitude, position.coords.latitude];
                userLocation = coords;
                resolve(coords);
            }, error => {
                reject(error);
            });
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

map.on('load', () => {
    // 加载自定义的停车场和路边停车的图标
    map.loadImage('parking.png', (error, image) => {
        if (error) throw error;
        map.addImage('parking-lot-icon', image);

        map.loadImage('street_parking.png', (error, image) => {
            if (error) throw error;
            map.addImage('street-parking-icon', image);

            // 添加停车场数据源
            map.addSource('parking-lots', {
                type: 'geojson',
                data: './your_data.geojson' // 停车场数据集
            });

            // 添加路边停车数据源
            map.addSource('street-parking', {
                type: 'geojson',
                data: './parking_allowed.geojson' // 路边停车数据集
            });

            // 显示停车场图标
            map.addLayer({
                id: 'parking-lots-layer',
                type: 'symbol',
                source: 'parking-lots',
                layout: {
                    'icon-image': 'parking-lot-icon',
                    'icon-size': 0.04, // 调整图标大小
                    'icon-allow-overlap': true
                }
            });

            // 显示路边停车图标
            map.addLayer({
                id: 'street-parking-layer',
                type: 'symbol',
                source: 'street-parking',
                layout: {
                    'icon-image': 'street-parking-icon',
                    'icon-size': 0.04, // 调整图标大小
                    'icon-allow-overlap': true
                }
            });
        });
    });

    // 获取当前位置
    getCurrentLocation()
        .then(coords => {
            console.log('User Location:', coords);
            map.flyTo({ center: coords, zoom: 16 });
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat(coords)
                .addTo(map);
        })
        .catch(error => console.error('Error getting user location:', error));

    // 当用户点击地图上的任意一点时，设置为目的地
    map.on('click', function(e) {
        const coords = e.lngLat;
        setDestination([coords.lng, coords.lat]);
    });
});

// 使用 Directions API 获取并设置目的地的精确路线
function setDestination(destinationCoords) {
    if (!userLocation) {
        console.error('User location is not available.');
        return;
    }

    const directionsClient = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
    const accessToken = mapboxgl.accessToken;

    // 构建 Directions API URL
    const url = `${directionsClient}${userLocation.join(',')};${destinationCoords.join(',')}.json?geometries=geojson&access_token=${accessToken}`;

    // Fetch Directions API 数据
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.routes.length > 0) {
                const route = data.routes[0];
                const preciseDestinationCoord = route.geometry.coordinates[route.geometry.coordinates.length - 1];

                console.log('Precise Destination Coordinates:', preciseDestinationCoord);

                // 在地图上添加精确坐标的标记
                if (destinationMarker) {
                    destinationMarker.remove(); // 移除之前的标记
                }

                destinationMarker = new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat(preciseDestinationCoord)
                    .addTo(map);

                // 移除已有的路线图层
                if (routeLayerId) {
                    map.removeLayer(routeLayerId);
                    map.removeSource(routeLayerId);
                }

                // 添加路线到地图
                routeLayerId = `route-${Date.now()}`;
                map.addSource(routeLayerId, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: route.geometry
                    }
                });
                map.addLayer({
                    id: routeLayerId,
                    type: 'line',
                    source: routeLayerId,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });

                // 显示路线详情和停车信息
                showRouteDetails(route);
                showNearbyParking(preciseDestinationCoord);

                map.flyTo({ center: preciseDestinationCoord, zoom: 16 });
            } else {
                console.error('No routes found.');
            }
        })
        .catch(error => console.error('Error with Directions API:', error));
}


// 显示路线详情
function showRouteDetails(route) {
    // 检查 route 数据是否为 null 或 undefined
    if (!route || !route.legs || !route.legs[0]) {
        console.error('Route data is not valid.');
        return;
    }

    const duration = route.duration ? Math.round(route.duration / 60) : 'N/A'; // 转换为分钟
    const distance = route.distance ? (route.distance / 1000).toFixed(2) : 'N/A'; // 转换为公里并保留两位小数

    // 获取并填充路线详情的侧边栏
    const directionsElement = document.getElementById('directions');
    directionsElement.innerHTML = `
        <h3>Trip Details</h3>
        <p><strong>Duration:</strong> ${duration} min</p>
        <p><strong>Distance:</strong> ${distance} km</p>
    `;
    directionsElement.style.display = 'block';
}


function showNearbyParking(destinationCoords) {
    const maxDistance = 200; // 最大搜索范围，单位为米

    // 查找视野范围内的停车场
    const parkingLots = map.queryRenderedFeatures({
        layers: ['parking-lots-layer']
    }).filter(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        return calculateDistance(destinationCoords, [lng, lat]) <= maxDistance;
    });

    // 查找视野范围内的路边停车点
    const streetParking = map.queryRenderedFeatures({
        layers: ['street-parking-layer']
    }).filter(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        return calculateDistance(destinationCoords, [lng, lat]) <= maxDistance;
    });

    // 在侧边栏显示停车信息
    const parkingInfoElement = document.getElementById('parking-info');
    parkingInfoElement.innerHTML = '<h3>Nearby Parking Spots within 200 meters</h3>';

    // 显示停车场信息
    parkingInfoElement.innerHTML += '<h4>Parking Lots:</h4><ul>';
    parkingLots.forEach(parkingLot => {
        const properties = parkingLot.properties;

        const businessName = properties["Business Name"];
        const priceData = properties["Price"];
        const openHours = properties["Open_Hours"];
        const industry = properties["Industry"];
        const capacity = properties["Capacity"];
        const detail = properties["Detail"];

        const listItem = `
            <li>
                <strong>${businessName}</strong><br>
                Price: ${priceData}<br>
                Open Hours: ${openHours}<br>
                Industry: ${industry}<br>
                Capacity: ${capacity}<br>
                Detail: ${detail}
            </li>`;
        parkingInfoElement.innerHTML += listItem;
    });
    parkingInfoElement.innerHTML += '</ul>';

    // 显示路边停车点数量
    const streetParkingCount = streetParking.length;
    parkingInfoElement.innerHTML += `<h4>Street Parking Spots: ${streetParkingCount}</h4>`;

    // 高亮显示范围内的停车场和路边停车点图标
    map.setPaintProperty('parking-lots-layer', 'icon-opacity', [
        'case',
        ['in', ['get', 'coordinates'], parkingLots.map(lot => lot.geometry.coordinates)],
        1, // 高亮显示
        0.5 // 其他图标半透明
    ]);

    map.setPaintProperty('street-parking-layer', 'icon-opacity', [
        'case',
        ['in', ['get', 'coordinates'], streetParking.map(spot => spot.geometry.coordinates)],
        1, // 高亮显示
        0.5 // 其他图标半透明
    ]);

    parkingInfoElement.style.display = 'block';
}


// 计算两点之间的距离
function calculateDistance(coord1, coord2) {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;

    const R = 6371e3; // 地球半径（米）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 返回距离，单位米
}
