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
    this.NumFish = 100;
	this.FishRadius = 15;
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
    root = createFish(controls.NumFish);
	
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
	/*let NumTorus = controls.NumTorus;
    let BigRadius = controls.BigRadius;
	let SmallRadius = controls.SmallRadius;*/
    //if (root)
    //    scene.remove(root);
    //root = PiramideOnTorus(NumTorus, BigRadius, SmallRadius);
    //scene.add(root);
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
	if (n == 0){
		return [getRandomFloat(x-10,x+10),getRandomFloat(y-10,y+10),getRandomFloat(z-10,z+10)];
	}
	let avgX = x;
	let avgY = y;
	let avgZ = z;
	for (let i = 0; i < n; i++) {
		avgX = avgX + nearFishes[i].position.x;
		avgY = avgY + nearFishes[i].position.y;
		avgZ = avgZ + nearFishes[i].position.z;
		/*if (t==0){
		console.log("avgX = " + avgX);
		t=t+1;
		}*/
	}
	return [avgX/n, avgY/n, avgZ/n];
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
	for (let i = 0; i < n; i++) {
		let d = getDistance(nearFishes[i],x,y,z);
		if (t==0){
			console.log("d = " + d);
		}
		if (d < 2)
			return [getRandomFloat(x-(10+controls.FishRadius),x+(10+controls.FishRadius)),getRandomFloat(y-(10+controls.FishRadius),y+(10+controls.FishRadius)),getRandomFloat(z-(10+controls.FishRadius),z+(10+controls.FishRadius))];;
	}
	return [x, y, z];
}
function nextStep(child,x,y,z){
	
	d = getDistance(child,x,y,z);
	let X = x - child.position.x;
	let Y = y - child.position.y;
	let Z = z - child.position.z
	return [child.position.x+X*(1/d), child.position.y+Y*(1/d), child.position.z+Z*(1/d)];
}
function Align(){
}
function update() {
	//if ( t == 0){
	if (root){
		let children = root.children;
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			nearFishes = GetCloseFishes(child);
			let points = Cohesion(nearFishes,child.position.x, child.position.y, child.position.z);
			let npoints = nextStep(child,points[0],points[1],points[2]);
			let newPoints = separate(nearFishes,npoints[0],npoints[1],npoints[2], child.position.x, child.position.y, child.position.z);
			if (t==0){
				console.log("child.position.x = " + child.position.x + " newPoint[0] = "+newPoints[0]+" npoints[0]: "+npoints[0] );
				console.log("nearFishes.length = " + nearFishes.length);
				
				t=t+1;
			}
			child.position.x = newPoints[0];
			child.position.y = newPoints[1];
			child.position.z = newPoints[2];
		}
	//}t = t+1;
	}
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
    gui.add(controls, 'NumFish', 100, 2000).step(100).name('Num. Fish');
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