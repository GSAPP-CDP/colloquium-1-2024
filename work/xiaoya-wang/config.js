var config = {    
    accessToken: 'pk.eyJ1IjoiY2VudHJpZnVnZTEiLCJhIjoiY2x6bnIxMHNzMG9ubTJrb2Y1bG1jemtveCJ9.fKd_y9EvYpi8OZtdxoGxLw',
    style: 'mapbox://styles/centrifuge1/clznm7klz009p01pb659b4qs4',
    theme: 'light',
    alignment: 'left',
    title: 'TREE HEALTH IN NEW YORK CITY AND THE IMPACT OF URBAN DEVELOPMENT ON IT',
    description: '<p>Next we will analyze some examples to prove these claims, and we will look at the correlation of these data.</p><p>As one of the most densely populated urban centers, New York City has undergone extensive development, which includes the expansion of building footprints, the construction of roads and infrastructure. Are the city’s trees suffering as a result of increased construction, pollution, and the spread of infrastructure, or have they been able to adapt and thrive despite these challenges? The following is the exploration of the correlation between changes in tree health and urban development.Now we are going to look at what happens to these numbers</p><p>Scroll to continue ▼</p>',
    chapters: [
        {
            id: 'tree distribution',
            title: 'The Change in the Number of Trees from 1995 to 2015',
            description:  `The number of street trees increased from 1995 to 2015. In 2015, the number of street trees was 683,798. In 1995, the number of street trees was 516,989, an overall increase of 16,679 trees. On average, 32 trees grew in each cell.
            If you just look at the number of trees, you would think that trees in New York City are getting better. However, when we look at other aspects, things become different.
            <img src="picture_tree/color1.png" alt="Number of Trees">`,
            image: 'picture_tree/Number of trees.png',
            location: {
                center: [-74.17, 40.74],
                zoom: 9.9,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'tree_population', opacity: 1,
                },
                {
                    layer: 'building number difference',
                    opacity:0
                },
                {
                    layer: 'difference',
                    opacity:0
                },
                {
                    layer: 'line number difference',
                    opacity:0
                }
            ],
            onChapterExit: [
                {
                    layer: 'tree_population',opacity:0,
                }
            ]
        },
        {
            id: 'Tree Health in 1995',
            title: 'Tree Health in 1995',
            description: `I calculate the ratio of the number of healthy trees in each cell to the total number of trees in the cell. In 1995, With an average of 83.4% of the trees in each grid in good condition, it can be seen that the vast majority of trees are in good health.
            <img src="picture_tree/color2.png" alt="Number of Trees">`,
            location: {
                center: [-74.17, 40.74],
                zoom: 9.9,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'tree_condition_1995', opacity: 1,
                },
                {
                    layer: 'building number difference',
                    opacity:0
                },
                {
                    layer: 'difference',
                    opacity:0
                },
                {
                    layer: 'line number difference',
                    opacity:0
                },
            ],
            onChapterExit: [
                {
                    layer: 'tree_condition_1995',opacity:0,
                },
            ]
        },
        {
            id: 'tree condition 2015',
            title: 'Tree Health in 2015',
            image: 'picture_tree/tree_health1.png',
            description: `However, in 2015, that average fell to 76 percent, a total drop of 7.4 percentage points, even as the total number of trees rose (governments and residents certainly did not plant trees that were already sick in the city). From the data that has been visualized, it can also be found that the overall color is fading. Overall, the health of trees is declining.
                        <img src="picture_tree/color2.png" alt="Number of Trees">`,
            location: {
                center: [-74.17, 40.74],
                zoom: 9.9,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'tree_condition_2015',
                    opacity:1
                },
                {
                    layer: 'building number difference',
                    opacity:0
                },
                {
                    layer: 'difference',
                    opacity:0
                },
                {
                    layer: 'line number difference',
                    opacity:0
                }
            ],
            onChapterExit: [
                {
                    layer:'tree_condition_2015',
                    opacity:0
                }
            ]
        },
        {
            id: 'building area',
            title: 'Building Footprint and Tree Health',
            image: 'picture_tree/correlation_building_tree.png',
            description: `Now I am going to find out the correlation between the development of city and tree health in 2015. The above is a scatter plot of building footprint and tree health. There may be some relationship between them, but there is no clear positive or negative correlation.
                        <img src="picture_tree/color6.png" alt="Number of Trees">`,
            location: {
                center: [-74.17, 40.74],
                zoom: 9.9,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'building area',
                    opacity:1
                },
                {
                    layer: 'building number difference',
                    opacity:0
                },
                {
                    layer: 'difference',
                    opacity:0
                },
                {
                    layer: 'line number difference',
                    opacity:0
                }
            ],
            onChapterExit: [
                {
                    layer: 'building area',
                    opacity:0
                }
            ]
        },
        {
            id: 'change of condition',
            title: 'Changes in the Health of the Tree from 1995 to 2015',
            description: `Grids with declining tree health accounted for 67.1 percent of all grids, and the distribution was relatively uniform, indicating a decline in tree health in all areas of New York City,  with some areas showing greater changes in tree health.
                        <img src="picture_tree/color3.png" alt="Number of Trees">
                        <img src="picture_tree/color3_1.png" alt="Number of Trees">`,
            location: {
                center: [-74.1, 40.73],
                zoom: 10.28,
                pitch: 80,
                bearing: -12
            },
            onChapterEnter: [
                {
                    layer: 'difference',
                    opacity:1
                },
                {
                    layer: 'building number difference',
                    opacity:0
                },
                {
                    layer: 'line number difference',
                    opacity:0
                }
            ],
            onChapterExit: [
                {
                    layer: 'difference',
                    opacity:0
                }
            ]
        },
        {
            id: 'change of building',
            title: 'Number of Buildings and Tree Health',
            image: 'picture_tree/correlation_newbuilding_tree.png',
            description: `A comparison of the scatter plot and the 3D models shows that there is no obvious linear relationship between the decline of tree health and the number of buildings in New York City. The coincidence of the two models is relatively low, and the distribution of points in the scatter plot is scattered.
                        <img src="picture_tree/color4.png" alt="Number of Trees">
                        <img src="picture_tree/color4_1.png" alt="Number of Trees">`,
            location: {
                center: [-74.1, 40.73],
                zoom: 10.28,
                pitch: 80,
                bearing: -12
            },
            onChapterEnter: [
                {
                    layer: 'building number difference',
                    opacity:1
                },
                {
                    layer: 'line number difference',
                    opacity:0
                }
            ],
            onChapterExit: [
                {
                    layer: 'building number difference',
                    opacity:0
                }
            ]
        },
        {
            id: 'change of line',
            title: 'Tree Health and Changes in the Number of Roads',
            image: 'picture_tree/correlation_line_tree.png',
            description: `The correlation between these two variables is still not high, and the distribution of points is relatively scattered. As the value of x coordinate increases, the number of samples decreases, and the results obtained are not representative.
                        <img src="picture_tree/color5.png" alt="Number of Trees">
                        <img src="picture_tree/color5_1.png" alt="Number of Trees">`,
            location: {
                center: [-74.1, 40.73],
                zoom: 10.28,
                pitch: 80,
                bearing: -12
            },
            onChapterEnter: [
                {
                    layer: 'line number difference',
                    opacity:1
                },
            ],
            
        },
        {
            id: 'conclusion ',
            title: 'Conclusion',
            description: `Now we can say that even if we don't know exactly why trees are in poor health, the decline in tree health in New York City is not directly related to the development of the city. `,
            location: {
                center: [-74.1, 40.73],
                zoom: 10.28,
                pitch: 80,
                bearing: -12
            },
            onChapterEnter: [
                {
                    layer: 'line number difference',
                    opacity:1
                },
            ],
            onChapterExit: [
                {
                    layer: 'line number difference',
                    opacity:0
                }
            ]
        },
    ]
};
