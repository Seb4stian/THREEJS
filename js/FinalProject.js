/***********
 * HW 4 Question 2 - tori Animation
 * Ed Castro-Puello
 * Feb 2024
 ***********/
//import { GLTFLoader } from './js/GLTFLoader.js';
//import GLTFLoader from 'three-gltf-loader';
var camera, scene, renderer;
var cameraControls;
var gui;
var currentMat, wireframeMat, currentMesh;
var currentObjectName;
var clock = new THREE.Clock();
let root = null;

let controls = new function() {
    this.NumTorus = 14
	this.BigRadius = 15;
	this.SmallRadius = 0.4;
    this.Go = update2;
}

function createScene() {
 
    let axes = new THREE.AxesHelper(10);
	var light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 220);
	scene.add(light);
	var light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(0, 0, -220);
	scene.add(light2);

	var light3 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light3.position.set(0, 100, 0);
	scene.add(light3);
	
	var light4 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light4.position.set(0, -100, 0);
	scene.add(light4);
	
	var light5 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light5.position.set(220, 0, 0);
	scene.add(light5);
	
	var light6 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light6.position.set(-220, 0, 0);
	scene.add(light6);
	
	scene.add(axes);

	/*
	let NumTorus = controls.NumTorus;
    let BigRadius = controls.BigRadius;
	let SmallRadius = controls.SmallRadius;
    if (root)
        scene.remove(root);*/
    root = createFish(1000);
	
    scene.add(root);
	
}

function createFish(n) {
	let root1 = new THREE.Object3D();
	let color = new THREE.Color('#ff3232');
    let opacity = 1.0
    let matArgs = {color: color, transparent: true, opacity: opacity};
    mat = new THREE.MeshLambertMaterial(matArgs);
	for (let i = 0; i < n; i++){
		let geom = new THREE.CylinderGeometry(1, 0.2, 0.5, 3);
		let mesh = new THREE.Mesh(geom, mat);
		mesh.rps = 0.5;
		mesh.position.x = getRandomFloat(-100,100);
		mesh.position.y = getRandomFloat(-100,100);
		mesh.position.z = getRandomFloat(-100,100);
		root1.add(mesh);
	}
	return root1;
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
	renderer.setAnimationLoop(function () {
        update();
        renderer.render(scene, camera);
    });
	
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 200, 60);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    initGui();
}
/*
function PiramideOnTorus(NumTorus, BigRadius, SmallRadius){
	let root = new THREE.Object3D();
	for (let i = 0; i < NumTorus; i++){
		let innerColor = getRandomColor();
		geom = new THREE.TorusGeometry(BigRadius-((BigRadius-SmallRadius)/NumTorus)*i, SmallRadius, 24, 36);
		currentMat = new THREE.MeshLambertMaterial({color: innerColor, flatShading: true});
		Torus = new THREE.Mesh(geom, currentMat);
		Torus.rps = 0.5;
		root.add(Torus);
		root.rotation.x = Math.PI / 2;
	}
	geom = new THREE.SphereGeometry(SmallRadius, 24, 24);
	let innerColor = getRandomColor();
	currentMat = new THREE.MeshLambertMaterial({color: innerColor, flatShading: true});
	Sphere = new THREE.Mesh(geom, currentMat);
	Sphere.rps = 0.5;
	//Sphere.position.z = -NumTorus;
	root.add(Sphere);
	root.rps = 0.05;
	return root;
}*/
function update2() {
	let NumTorus = controls.NumTorus;
    let BigRadius = controls.BigRadius;
	let SmallRadius = controls.SmallRadius;
    //if (root)
    //    scene.remove(root);
    //root = PiramideOnTorus(NumTorus, BigRadius, SmallRadius);
    //scene.add(root);
}
let t = 0;
function update() {
	/*let delta = clock.getDelta();
	t += delta;
	t %= controls.NumTorus;
	if (root){
		let children = root.children;
		for (let i = 0; i < children.length; i++) {
			 let child = children[i];
			 let deltaRevRadians = rpsToRadians(child.rps, delta);
			 child.position.z = Math.sin(((i)/controls.NumTorus)*(2 * Math.PI)+t)*10;
		}
		let deltaRotRadians = rpsToRadians(root.rps, delta);
		root.rotation.y += deltaRotRadians;
		root.rotation.y %= 2 * Math.PI;
    }*/
}

function initGui() {

	let gui = new dat.GUI();
    gui.add(controls, 'NumTorus', 5, 20).step(1).name('Num. Torus');
	gui.add(controls, 'BigRadius', 4, 20).name('Torus Big radius');
    gui.add(controls, 'SmallRadius',0.1,1).name('Torus Small radius');
    gui.add(controls, 'Go');
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}



init();
createScene();
addToDOM();
//animate();