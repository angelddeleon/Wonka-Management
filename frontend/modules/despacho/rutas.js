// Initiate and authenticate your connection to the HERE platform:
/*const platform = new H.service.Platform({
    apikey: 'GOdm4EI-zu94iYyyCugZc0CJ1MUYqio36JoTAhF3b_c',
})

// Obtain the default map types from the platform object:
const defaultLayers = platform.createDefaultLayers()

// Instantiate (and display) a map:
// Zoom and center parameters are overriden by the bounding box
// that contains the route and marker objects
const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
        zoom: 7,
        center: { lat: 10.2363953, lng: -67.9649982 },
        // Add space around the map edges to ensure markers are not cut off:
        padding: { top: 50, right: 50, bottom: 50, left: 50 },
    }
)

const origin = { lat: 10.2363953, lng: -67.9649982 }
const destination = { lat: 10.2723516, lng: -67.9406976 }

// Create the parameters for the routing request:
const routingParameters = {
    routingMode: 'fast',
    transportMode: 'car',
    // The start point of the route:
    origin: `${origin.lat},${origin.lng}`,
    // The end point of the route:
    destination: `${destination.lat},${destination.lng}`,
    // Include the route shape in the response
    return: 'polyline',
}

// Define a callback function to process the routing response:
const onResult = function (result) {
    // Ensure that at least one route was found
    if (result.routes.length) {
        const lineStrings = []
        result.routes[0].sections.forEach((section) => {
            // Create a linestring to use as a point source for the route line
            lineStrings.push(
                H.geo.LineString.fromFlexiblePolyline(section.polyline)
            )
        })

        // Create an instance of H.geo.MultiLineString
        const multiLineString = new H.geo.MultiLineString(lineStrings)

        // Create a polyline to display the route:
        const routeLine = new H.map.Polyline(multiLineString, {
            style: {
                strokeColor: 'blue',
                lineWidth: 3,
            },
        })

        // Create a marker for the start point:
        const startMarker = new H.map.Marker(origin)

        // Create a marker for the end point:
        const endMarker = new H.map.Marker(destination)

        // Create a H.map.Group to hold all the map objects and enable us to obtain
        // the bounding box that contains all its objects within
        const group = new H.map.Group()
        group.addObjects([routeLine, startMarker, endMarker])
        // Add the group to the map
        map.addObject(group)

        // Set the map viewport to make the entire route visible:
        map.getViewModel().setLookAtData({
            bounds: group.getBoundingBox(),
        })
    }
}

// Get an instance of the routing service version 8:
const router = platform.getRoutingService(null, 8)

// Call the calculateRoute() method with the routing parameters,
// the callback, and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult, function (error) {
    alert(error.message)
})

// MapEvents enables the event system.
// The behavior variable implements default interactions for pan/zoom (also on mobile touch environments).
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

// Enable dynamic resizing of the map, based on the current size of the enclosing container
window.addEventListener('resize', () => map.getViewPort().resize())

const boton = document.querySelector('.mostrar')

boton.addEventListener('click', () => {
    const mapa = document.getElementById('mapContainer')
    if (mapa) {
        print('mapa existe')
    }
    mapa.style.display = 'block'
})*/
/*mport { response } from "Express"*/
document.addEventListener('DOMContentLoaded', async () => { 
  const address = localStorage.getItem('direccionPedido') + ' Carabobo Venezuela' 
//Pedir del Local
console.log(address)

const url=`https://geocode.search.hereapi.com/v1/geocode?q=${address}&apikey=GOdm4EI-zu94iYyyCugZc0CJ1MUYqio36JoTAhF3b_c`

  // Reemplaza esto con tu URL
  const response = await fetch(url);
  console.log('Antes del Response', response)
  data = await response.json();

// async function getDatos(container) {
//     const data = await fetchData(url)
//   console.log('Datos', data)
//   container = data.items[0].position
//     return data
// }

// fetchData(url).then(responseData => {
//     // Ahora puedes usar responseData directamente
//     console.log('locationData', responseData);
// });
  
  console.log('locationData', data.items[0])
  const { lat, lng } = data.items[0].position
  console.log('lat', lat)
  console.log('lng', lng)
/*data = fetchData(url).then(responseData => {
    data = responseData;
    console.log(data);
    return data
    // Now you can use the data variable
});*/
  const route = await fetch(`https://router.hereapi.com/v8/routes?transportMode=truck&origin=10.2363953,-67.9649982&destination=${lat},${lng}&return=summary&apikey=GOdm4EI-zu94iYyyCugZc0CJ1MUYqio36JoTAhF3b_c`)
const dataRoute = await route.json()
  const { length, duration } = dataRoute.routes[0].sections[0].summary
  console.log('distance', length)
  console.log('duration', duration)
  console.log('dataRoute', dataRoute)
  const distance = document.getElementById('destino')
  const municipio = document.getElementById('municipio')
  distance.value = length
  municipio.value = duration
  // Initiate and authenticate your connection to the HERE platform:
const platform = new H.service.Platform({
    apikey: 'GOdm4EI-zu94iYyyCugZc0CJ1MUYqio36JoTAhF3b_c',
})

// Obtain the default map types from the platform object:
const defaultLayers = platform.createDefaultLayers()

// Instantiate (and display) a map:
// Zoom and center parameters are overriden by the bounding box
// that contains the route and marker objects
const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
        zoom: 7,
        center: { lat: 10.2363953, lng: -67.9649982 },
        // Add space around the map edges to ensure markers are not cut off:
        padding: { top: 50, right: 50, bottom: 50, left: 50 },
    }
)

const origin = { lat: 10.2363953, lng: -67.9649982 }
const destination = { lat, lng}

// Create the parameters for the routing request:
const routingParameters = {
    routingMode: 'fast',
    transportMode: 'car',
    // The start point of the route:
    origin: `${origin.lat},${origin.lng}`,
    // The end point of the route:
    destination: `${destination.lat},${destination.lng}`,
    // Include the route shape in the response
    return: 'polyline',
}

// Define a callback function to process the routing response:
const onResult = function (result) {
    // Ensure that at least one route was found
    if (result.routes.length) {
        const lineStrings = []
        result.routes[0].sections.forEach((section) => {
            // Create a linestring to use as a point source for the route line
            lineStrings.push(
                H.geo.LineString.fromFlexiblePolyline(section.polyline)
            )
        })

        // Create an instance of H.geo.MultiLineString
        const multiLineString = new H.geo.MultiLineString(lineStrings)

        // Create a polyline to display the route:
        const routeLine = new H.map.Polyline(multiLineString, {
            style: {
                strokeColor: 'blue',
                lineWidth: 3,
            },
        })

        // Create a marker for the start point:
        const startMarker = new H.map.Marker(origin)

        // Create a marker for the end point:
        const endMarker = new H.map.Marker(destination)

        // Create a H.map.Group to hold all the map objects and enable us to obtain
        // the bounding box that contains all its objects within
        const group = new H.map.Group()
        group.addObjects([routeLine, startMarker, endMarker])
        // Add the group to the map
        map.addObject(group)

        // Set the map viewport to make the entire route visible:
        map.getViewModel().setLookAtData({
            bounds: group.getBoundingBox(),
        })
    }
}

// Get an instance of the routing service version 8:
const router = platform.getRoutingService(null, 8)

// Call the calculateRoute() method with the routing parameters,
// the callback, and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult, function (error) {
    alert(error.message)
})

// MapEvents enables the event system.
// The behavior variable implements default interactions for pan/zoom (also on mobile touch environments).
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

// Enable dynamic resizing of the map, based on the current size of the enclosing container
window.addEventListener('resize', () => map.getViewPort().resize())
})
