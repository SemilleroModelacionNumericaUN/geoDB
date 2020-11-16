// const { auth } = require("firebase-admin");

// const { auth } = require("firebase");
var currentProject = sessionStorage.getItem('currentProject');
let projectName = sessionStorage.currentProjName;
let currentRole = sessionStorage.currentRol;

// Set current project's name and role
if(currentRole){
    document.getElementById('rol_p').innerHTML = currentRole;
}
if(projectName){
    document.getElementById('proj_p').innerHTML = projectName;
}

const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedInLinks = document.querySelectorAll('.logged-in')
const loggedInForms = document.querySelectorAll('.formul')
var userUid = null; // Id del usuario para trar info 

const loginCheck = user => {
    if (user) {
        loggedInLinks.forEach(link => {
            link.style.display = 'block'
        })
        loggedOutLinks.forEach(link => {
            link.style.display = 'none'
        })

    } else {
        loggedInLinks.forEach(link => {
            link.style.display = 'none'
        })
        document.getElementById('goback').click();
    }
}


//Logout
const logout = document.querySelector('#logout')

logout.addEventListener('click', e => {
    e.preventDefault()
    auth.signOut().then(() => {
        // console.log('Sign out correcto')
    })
})


// Unpack
var dict = {}
var dictLevel = {}
const unpack = (obj, lenObj, ID, status, ID_prev, i, dicc, col, depth, rec) => {
    Object.keys(obj).forEach(key => {

        if (typeof (obj[key]) === 'object' && obj[key] !== null && i <= depth) {

            var id = ''

            color_btn = ['btn-primary', 'btn-primary', 'btn-success', 'btn-primary', 'btn-info',
                'btn-warning', 'btn-danger'
            ]

            color = ['text-primary', 'text-primary', 'text-secondary', 'text-success', 'text-danger',
                'text-warning', 'text-info'
            ]

            color_tr = ['table-primary', 'table-primary', 'table-success', 'table-primary', 'table-info', 'table-warning', 'table-danger']
            position = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']

            id = key + uniqueID() // Para crear ids unicos
            if (status === true) {
                dicc = get(dicc, ID, [color_btn[i], color_tr[i], position[i]])
            } else {
                dicc = get(dicc, ID, [color_btn[i], color_tr[i], position[i]])
            }

            Level = get(dictLevel, key + ID, get(dictLevel, ID_prev, 0)[ID_prev] + 1)

            if (status === true) {
                t = `
                <tr>
                    <td colspan="10">
                        <div class="${ID} collapse ${dicc[ID][2]}" id="${key+ID}" >
                            <button class="btn ${dicc[ID][0]} btn-sm sticky" type="button" data-toggle="collapse" data-target=".${id}" aria-expanded="false" aria-controls="${id}">
                                ${key}
                            </button>
                        </div>    

                        <div class = "collapse ${id}" >
                            <table class="table table-bordered" >
                                <tbody id="tbody${id}">
                                    
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
                `;

                var doc = document.querySelector('#tbody' + ID)

            } else {
                t = `
                <div id="${key+ID}">
                    <table class="table borderless w-auto small table-sm" >
                        <tbody>
                            <tr>
                                <td>
                                    <button class="btn btn-outline-primary btn-sm sticky" type="button" data-toggle="collapse" data-target=".${id}" aria-expanded="false" aria-controls="${id}">
                                        ${key}
                                    </button>
                                </td>
                                <td>
                                    <div class = "collapse ${id}" >
                                        <table class="table table-bordered">
                                            <tbody id="tbody${id}">
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                
                `;

                var doc = document.querySelector('#' + ID_prev);

            }

            doc.innerHTML += t;

            i = dictLevel[key + ID]
            i += 1

            var color = dicc[ID][1]

            return unpack(obj[key], Object.values(obj[key]).filter(v => typeof v === 'object').length, id, true, key + ID, i, dicc, color, depth, true);

        } else {

            color_tr = ['table-primary', 'table-success', 'table-info', 'table-warning', 'table-danger']

            t_r = `
                        <tr class="${col}">
                            <th scope="row">${key}</td>
                            <td>${obj[key]}</td>
                        </tr>
            `

            var docInfo = document.querySelector('#tbody' + ID);
            docInfo.innerHTML += t_r;

        }


    })
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function uniqueID() {
    return Math.floor(Math.random() * Date.now())
}

function get(object, key, default_value) {
    if (typeof object[key] == "undefined") {
        object[key] = default_value
    }
    // var result = object[key];
    return object
}

//Events
//List data for auth state changes

auth.onAuthStateChanged(user => {
    if (user) {
        userUid = user.uid
        loggedInLinks.forEach(link => {
            link.style.display = 'block'
        })

        dbRt.ref('PROYECTOS').child(currentProject).on('value', snap => {
            var obj = snap.val()
            graphGeoMarkers(obj)
        })

        dbRt.ref('COORDS').on('value', (snap) => {
            var obj = snap.val(); //equivalente a Dictionary en pyhon

        // Por el momento se trabaja con geoJSON pero NO descartar

        });
        document.getElementById('welcome-message').innerHTML += ' ' + String(user.displayName).match(/(\w*)/)[1] + '! Bienvenido a tu gestor de información geotécnica';

        // dbRt.ref('COORDS').on('value', (snap) => { 
        //     var obj = snap.val(); //equivalente a Dictionary en pyhon

        //     // obj = {'EXPLORACIONES': obj}
        //     // console.log(obj);
        //     graphMarkers(obj)

        // });

        // Grafica todos los marcadores contenidos en COORDSGEOJSON
        dbRt.ref('COORDSGEOJSON').on('value', (snap) => {
            var obj = snap.val();
            // graphGeoMarkers(obj)
        })


    } else {
        userUid = null
        loginCheck(user);
    }
})

// Starting to work on the map
const mapdiv = document.getElementById('mapid');
const navbar = document.getElementById('navbarid');
const alertnotif = document.getElementById('alert-notif');
const optionsBtn = document.getElementById('sidebar-button');
const mainfo = document.getElementById('maininfo');

navbar.style.height = String(navbar.getBoundingClientRect().height / 2) + 'px';
mainfo.style.height = String(navbar.getBoundingClientRect().height) + 'px';
mapdiv.style.height = String(window.innerHeight - navbar.getBoundingClientRect().height * 2) + 'px';

window.addEventListener('resize', (evt) => {
    mapdiv.style.height = String(window.innerHeight - navbar.getBoundingClientRect().height) + 'px';
    if (window.innerWidth < 1300) {
        document.getElementById('welcome-message').style.display = 'none';
    } else {
        document.getElementById('welcome-message').style.display = 'inline';
    }
})

alertnotif.addEventListener('click', () => {
    alertnotif.style.display = 'none';
})

const map = L.map('mapid').setView([4.6384979, -74.082547], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// const marker = L.marker([4.6384979,-74.082547]).addTo(map);

var inicio = document.querySelector('#inicio')
var list = []
var clicked = false

const graphMarkers = (Obj) => {

    Object.keys(Obj).forEach(key => {

        window['marker' + key] = L.marker([Obj[key]['Norte'], Obj[key]['Este']]).addTo(map)

        window['clicked'+'marker'+key] = false
        window['marker' + key].bindPopup(`<b>ID_EXPLORACION:</b><br>${key}`)
        // list.push(['marker'+key]) // Utilizar para agrupar exploraciones

        var infoRequested = {} // Objeto que evita solicitar informacion mas de una vez para
                                // un objeto de firebase

        window['marker' + key].on('click', e => {

            if (!infoRequested['marker' + key]) {
                infoRequested['marker' + key] = true
                dbRt.ref('PROYECTOS/PUBLIC/BOGOTA').child(key).on('value', (snap) => {
                    var obj = snap.val()
                    dict = {}
                    dictLevel = {}

                    div = `<div class="table-responsive text-nowrap col-md-12 mx-auto inicio" id="${key}inicio">
                    
                    </div>`
                    inicio.innerHTML += div

                    var objMod = {}
            
                    objMod[key] = obj
                    unpack(objMod, Object.values(obj).filter( v => typeof v === 'object').length, '', false, key+'inicio', 0, dict, '', 8, false)
                })
            } else {
                console.log('Object requested')
            }


            openNav()
            $('#inicio').toggle()
            window['marker' + key].openPopup()
            if (!clicked) {
                //     // window['marker'+key].setIcon(greenIcon)
                window['marker' + key].openPopup()
                clicked = true
                $("#inicio").children().hide();
                $('#' + key + 'inicio').show()
            } else {
                // window['marker'+key].setIcon(blueIcon)
                clicked = false
            }
        }).on('mouseover', e => {
            console.log('mouse over')
            window['marker' + key].openPopup()
        }).on('mouseout', e => {
            console.log('Fueraa')
            if (!window['clicked' + 'marker' + key]) {
                window['marker' + key].closePopup()
            }
        })
        // list.push(eval('marker'+key))
    })
}  

var groupGen = new L.FeatureGroup();
var overlayMaps = {}
var name

const graphGeoMarkers = (Obj) => {

    var infoRequested = {} // Objeto que evita solicitar informacion mas de una vez para
                                // un objeto de firebase

    Object.keys(Obj).forEach(key => {
        var group = new L.FeatureGroup()
        var ObjPerf = Obj[key]
        name = key
        Object.keys(ObjPerf).forEach(key => {
            group.addLayer(L.geoJSON(ObjPerf[key], {
                onEachFeature: {
                    title: key 
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(`<b>ID_EXPLORACION:</b><br>${key}`)
                    layer.on({
                        click: (e) => {
                            if (!infoRequested['marker' + key]) {
                                infoRequested['marker' + key] = true
                                dbRt.ref('PROYECTOS/PUBLIC/BOGOTA').child(key).on('value', (snap) => {
                                    var obj = snap.val()
                                    dict = {}
                                    dictLevel = {}
                
                                    div = `<div class="table-responsive text-nowrap col-md-12 mx-auto inicio" id="${key}inicio">
                                    
                                    </div>`
                                    inicio.innerHTML += div
                
                                    var objMod = {}
                            
                                    objMod[key] = obj
                                    unpack(objMod, Object.values(obj).filter( v => typeof v === 'object').length, '', false, key+'inicio', 0, dict, '', 8, false)
                                })
                            } else {
                                console.log('Object requested')
                            }
    
                            openNav()
    
                            $('#inicio').toggle()
                            layer.openPopup()
    
                            if (!clicked) {
                                layer.openPopup()
                                clicked = true
                                $("#inicio").children().hide();
                                $('#' + key + 'inicio').show()
                            } else {
                                clicked = false
                            }
                        },
                    mouseover: e => {
                        layer.openPopup()
                    },
                    mouseout: e => {
                        layer.closePopup()
                    }
                    });
                }
            }).addTo(map))
        })
        groupGen.addLayer(group)
        overlayMaps[name] = group
        map.addLayer(group)
    })
    
    L.control.layers({}, overlayMaps, {
        position: 'bottomleft'
    }).addTo(map);
}

map.addLayer(groupGen)

map.on('click', e => {
    if (clicked) {
        $('#inicio').toggle()
        clicked = false
    }
})

// General structures filter
var overLayers = [
	{
		group: "Filtro general",
		layers: [
			{   
				active: true,
				name: "Estructuras",
                layer: groupGen,
                
            }
        ]
    }
]

var panelLayers = new L.Control.PanelLayers({}, overLayers, {
	compact: true,
    collapsibleGroups: true,
    position: 'bottomleft',
});

map.addControl(panelLayers);

// Icons for markers
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

var blueIcon = new L.Icon({
iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
shadowSize: [41, 41]
});

// Search control
var controlSearch = new L.Control.Search({
    position:'topleft',		
    layer: groupGen,
    initial: true,
    zoom: 20,
    marker: false,
    firstTipSubmit: true,
    textErr: 'Exploración no encontrada',
    textPlaceholder: 'Buscar',
});

controlSearch.on('search:locationfound', e => {
    e.layer.setIcon(greenIcon)
    e.layer.openPopup()
})

map.addControl(controlSearch)

showMsg = (msg, className = 'alert alert-primary') => {
    // Options for className:
    // - alert alert-secondary
    // - alert alert-success
    // - alert alert-danger
    // - alert alert-warning
    // - alert alert-info
    // - alert alert-light
    // - alert alert-dark
    alertnotif.className = className;
    document.getElementById('alertMsgP').innerHTML = msg;
    alertnotif.style.display = 'block';
}

mapdiv.addEventListener('click', () => {
    showMsg("Hizo click en el mapa", 'alert alert-info')
    // optionsBtn.style.display = "block";
})

// Working on the side panel
const sidePanel = document.getElementById("mySidebar");
sidePanel.style.height = mapdiv.style.height;

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "50%";
    document.getElementById("map-div").style.marginRight = "50%";
    optionsBtn.style.display = "none";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("map-div").style.marginRight = "0";
    optionsBtn.style.display = "block";
}