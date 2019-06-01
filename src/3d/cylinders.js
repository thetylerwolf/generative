import * as THREE from 'three'
import '../lib/noise'

noise.seed(Math.random())
window.THREE = THREE
require('three/examples/js/controls/OrbitControls')

// const glslify = require('glslify')
// const TW = require('./lib/TW')

let camera, scene, renderer
let geometry, material, mesh, spotLight, ambient, lightTarget, meshes = []
let bgColor = 0xfaebe0
let width = 30,
    height = width * window.innerHeight/window.innerWidth

// colors : '#a4036f' '#16db93' '#2364aa' '#fec601' '#ea7317'

function init() {

    camera = new THREE.OrthographicCamera( -width/2, width/2, height/2, -height/2, 1, 1000)
    // camera.position.x = 200
    // camera.position.y = 50
    // camera.position.z = 200
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = -20
    camera.lookAt( new THREE.Vector3(0,0,0) )


    scene = new THREE.Scene()
    // scene.background = new THREE.Color( bgColor )

    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap

    document.body.appendChild( renderer.domElement )

}

function setupVisual() {

    const directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
    directionalLight.position.set(0,0,-10);
    // directionalLight.castShadow = true;
    scene.add( directionalLight );

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 )
    scene.add( ambientLight )

    renderer.setClearColor(bgColor, 1)

    placeCylinders()

    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target = new THREE.Vector3( 0, 0, 0 )
    controls.minDistance = 0;
    controls.maxDistance = 100;
}

function placeCylinders() {

    let radius = 0.5,
        height = 10,
        segCount = 19.9,
        noiseScale = 0.005

    let prevX = width/2,
        prevY = height/2,
        prevZ = 0

    for( let i = 0; i < 100; i++ ) {

        let geometry = new THREE.CylinderGeometry( radius, radius, height, segCount )

        let mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({
                // side: THREE.DoubleSide,
                color: 0xe85c5c,
                metalness: 0.1,
                roughness: 0.4,
            }) )

        const movementXZ = noise.perlin2(4,i * 0.05)

        let xPos = prevX - Math.cos(movementXZ * Math.PI * 3) * 2 * radius
        prevX = mesh.position.x = xPos


        let zPos = prevZ + Math.sin(movementXZ * Math.PI * 3) * 2 * radius
        prevZ = mesh.position.z = zPos

        const movementY = noise.perlin2( 0, i * noiseScale )

        let yPos = prevY + movementY * 10
        mesh.position.y = yPos

        mesh.rotation.x = movementY * Math.PI * 2
        // mesh.rotation.y = movementY * Math.PI

        scene.add( mesh )

        meshes.push( mesh )

    }

    renderer.render( scene, camera )

}

let iterations = 0

function animate( time ) {
    requestAnimationFrame( animate )

    // meshes.forEach((mesh, i) => {
    //     mesh.rotation.x = noise.perlin2( 0, (i + iterations) * 0.005 ) * Math.PI * 2
    // })

    // iterations++

    renderer.render( scene, camera )

}

init()
setupVisual()

requestAnimationFrame( animate )
