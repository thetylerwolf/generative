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

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
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

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
    // directionalLight.position.set(0,0,-10);
    // directionalLight.castShadow = true;
    // scene.add( directionalLight );

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 )
    scene.add( ambientLight )

    renderer.setClearColor(bgColor, 1)

    drawSphere()

    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target = new THREE.Vector3( 0, 0, 0 )
    controls.minDistance = 0;
    controls.maxDistance = 100;
}

function drawSphere() {

    const numPoints = 5,
        noiseScale = 0.05,
        points = []

    let prevX = 0,
        prevY = 0,
        prevZ = 0

    let yAngleV = 10,
        xAngleV = 10

    for( let i = 0; i < numPoints; i++ ) {

        let yAngle = prevY + yAngleV,
            xAngle = prevX + xAngleV,
            radius = i * 3

        prevY = yAngle
        prevX = xAngle

        yAngleV += noise.perlin2( 0, i * noiseScale ) * 10
        xAngleV += noise.perlin2( 1000, i * noiseScale ) * 10

        xAngleV *= 0.99
        yAngleV *= 0.99

        const yPos = Math.cos( xAngle ) * radius,
            xPos = ( Math.sin( xAngle ) * Math.sin( yAngle ) ) * radius,
            zPos = ( Math.cos( xAngle ) * Math.cos( yAngle ) ) * radius

        let p = new THREE.Vector3( xPos, yPos, zPos )
        points.push(p)

        // let g = new THREE.SphereGeometry(0.1),
        //     m = new THREE.MeshBasicMaterial(),
        //     mm = new THREE.Mesh(g,m)

        // mm.position.x = xPos
        // mm.position.y = yPos
        // mm.position.z = zPos

        // scene.add(mm)
        // const movementXZ = noise.perlin2(4,i * 0.05)

        // let xPos = prevX - Math.cos(movementXZ * Math.PI * 3) * 2 * radius
        // prevX = mesh.position.x = xPos


        // let zPos = prevZ + Math.sin(movementXZ * Math.PI * 3) * 2 * radius
        // prevZ = mesh.position.z = zPos

        // const movementY = noise.perlin2( 0, i * noiseScale )

        // let yPos = prevY + movementY * 10
        // mesh.position.y = yPos

        // mesh.rotation.x = movementY * Math.PI * 2
        // mesh.rotation.y = movementY * Math.PI

    }

    const curve = new THREE.CatmullRomCurve3( points, false, 'catmullrom', 0 )

    const geometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints( 1000 ) )

    const material = new THREE.LineBasicMaterial({
        // side: THREE.DoubleSide,
        color: 0xe85c5c,
        // metalness: 0.1,
        // roughness: 0.4,
    })

    const lineObject = new THREE.Line( geometry, material )

    scene.add( lineObject )

    meshes.push( lineObject )

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
