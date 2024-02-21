/***********
 * Final Project Boid Simulation
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
    this.NumFish = 1000;
	this.FishRadius = 30;
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

    root = createFish(controls.NumFish);
	
    scene.add(root);
	
}
let rootAnterior = [];
function createFish(n) {
	let root1 = new THREE.Object3D();
	let color = new THREE.Color('#ff3232');
    let opacity = 1.0
    let matArgs = {color: color, transparent: true, opacity: opacity};
    mat = new THREE.MeshLambertMaterial(matArgs);
	for (let i = 0; i < n; i++){
		let geom = new THREE.CylinderGeometry(1, 0.2, 0.5, 3);
		let mesh = new THREE.Mesh(geom, mat);
		mesh.rps = 0.020;
		mesh.position.x = getRandomFloat(-100,100);
		mesh.position.y = getRandomFloat(-100,100);
		mesh.position.z = getRandomFloat(-100,100);
		rootAnterior.push([getRandomFloat(-90,90),getRandomFloat(-90,90),getRandomFloat(-90,90)]);
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

function update2() {

	if (root)
        scene.remove(root);
    root = createFish(controls.NumFish);
	
    scene.add(root);
}

let t = 0;
function getDistance(child,x,y,z){
	a = child.position.x - x;
	b = child.position.y - y;
	c = child.position.z - z;
	return Math.sqrt(a*a + b*b + c*c);
}
function GetCloseFishes(child){
	const nearFishes = [];
	if (root){
		let children = root.children;
		for (let i = 0; i < children.length; i++) {
			if (getDistance(children[i], child.position.x, child.position.y, child.position.z)<controls.FishRadius && ((child.position.x != children[i].position.x)&&(child.position.x != children[i].position.x)&&(child.position.x != children[i].position.x))){
				nearFishes.push(children[i]);
			}
		}
    }
	return nearFishes;
}
function Cohesion(nearFishes,x,y,z){
	let n = nearFishes.length;
	if (n <= 0){
		return [x,y,z];
		//return [200*Math.sin(t),200*Math.cos(t),0*Math.cos(t)];
	}
	let avgX = 0;
	let avgY = 0;
	let avgZ = 0;
	for (let i = 0; i < n; i++) {
		avgX = avgX + nearFishes[i].position.x;
		avgY = avgY + nearFishes[i].position.y;
		avgZ = avgZ + nearFishes[i].position.z;
	}
	avgX = avgX/n;
	avgY = avgY/n;
	avgZ = avgZ/n;
	return [(avgX+x)/2, (avgY+y)/2, (avgZ+z)/2];
}
function IsClear(nearFishes,x,y,z){
	let n = nearFishes.length;
	if (100 < Math.abs(x)){
		return false;
	}
	if (100 < Math.abs(y)){
		return false;
	}
	if (100 < Math.abs(z)){
		return false;
	}
	for (let i = 0; i < n; i++) {
		let d = getDistance(nearFishes[i],x,y,z);
		if (d < 2)
			return false;
	}
	return true;
}
// if i = 0, then x+0, if i = 1, then x-3, if i = 2, then x+3
function adaptFormula(x){
	return 4.5*x*x-7.5*x;
}
function separate(nearFishes,x,y,z, x0, y0, z0){
	let n = nearFishes.length;
	
	if (100 < Math.abs(x)){
		if (x > 100){
			x = 200 - x;
		}else{
			x = -200 -x;
		}
	}
	if (100 < Math.abs(y)){
		if (y > 100){
			y = 200 - y;
		}else{
			y = -200 -y;
		}
	}
	if (100 < Math.abs(z)){
		if (z > 100){
			z = 200 - z;
		}else{
			z = -200 - z;
		}
	}
	if (n > 0){
		for (let i = 0; i < 3; i++){
			for (let j = 0; j < 3; j++){
				for (let k = 0;k < 3; k++){
						if (IsClear(nearFishes,x+adaptFormula(i),y+adaptFormula(j),z+adaptFormula(k))){
							return [x+adaptFormula(i),y+adaptFormula(j),z+adaptFormula(k)];
						}
				}
			}
		}
		return [x0, y0, z0];
	}
	return [x, y, z];
}
function nextStep(child,x,y,z,s){
	
	d = getDistance(child,x,y,z);
	let X = x - child.position.x;
	let Y = y - child.position.y;
	let Z = z - child.position.z
	return [child.position.x+X*(s/d), child.position.y+Y*(s/d), child.position.z+Z*(s/d)];
}
function nextStep2(child,x,y,z,s){
	
	d = getDistance(child,x,y,z);
	let X = child.position.x - x;
	let Y = child.position.y - y;
	let Z = child.position.z - z;
	return [child.position.x+X*(s/d), child.position.y+Y*(s/d), child.position.z+Z*(s/d)];
}
function Align(child,i){
	return nextStep2(child,rootAnterior[i][0],rootAnterior[i][1],rootAnterior[i][2],1);
}
function update() {
	let delta = clock.getDelta();
	t += delta;
	t %= 360;
	if (root){
		let children = root.children;
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			
			nearFishes = GetCloseFishes(child);
			let p1 = Align(child,i);
			let points = Cohesion(nearFishes,p1[0], p1[1], p1[2]);
			let npoints = nextStep(child,points[0],points[1],points[2],1);
			let newPoints = separate(nearFishes,npoints[0],npoints[1],npoints[2], child.position.x, child.position.y, child.position.z);
			
			
			rootAnterior[i][0] = child.position.x;
			rootAnterior[i][1] = child.position.y;
			rootAnterior[i][2] = child.position.z;
			
			child.position.x = newPoints[0];
			child.position.y = newPoints[1];
			child.position.z = newPoints[2];
		}
	}
}

function initGui() {

	let gui = new dat.GUI();
    gui.add(controls, 'NumFish', 1, 2000).step(1).name('Num. Fish');
	gui.add(controls, 'FishRadius', 5, 85).step(5).name('Fish Radius');
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