/***********
 * sphereOfStarburstsA.js
 * Starbursts placed on a sphere
 * M. Laszlo
 * September 2019
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let root = null, sphereRadius;



function createSceneA() {
    sphereRadius = 6;
	subRadius=2;
    root = starburstsOnTorusA(400, sphereRadius, subRadius, 100, 1)
    scene.add(root);
	let axes = new THREE.AxesHelper(10);
    scene.add(axes);
}
function getRandomPointsOnTorus(R, r, count = 1000){
	let pts = [];
    let counter = 0;
    let COUNT = count;
    let U, V, W;
    while(counter < COUNT){
        U = Math.random();
        V = Math.random();
        W = Math.random();
        let theta = 2 * Math.PI * U;
        let phi = 2 * Math.PI * V;
        if(W <= ((R + r * Math.cos(theta)) / (R + r))){
            pts.push(new THREE.Vector3(
                (R + r * Math.cos(theta)) * Math.cos(phi),
                (R + r * Math.cos(theta)) * Math.sin(phi),
                r * Math.sin(theta)
            ))
            counter++;
			return pts
        }
    }
	pts.push(new THREE.Vector3(0,0,0));
    return pts;
}

function starburstsOnTorusA(nbrBursts, sphereRadius, subRadius, maxRays, maxRad) {
    let root = new THREE.Object3D();
    for (let i = 0; i < nbrBursts; i++) {
        let mesh = starburstA(maxRays, maxRad);
        let p = getRandomPointsOnTorus(sphereRadius,subRadius)[0];
        mesh.position.set(p.x, p.y, p.z);
        root.add(mesh);
    }
    return root;
}

function starburstA(maxRays, maxRad) {
    let rad = 1;   // had been rad = 10?????
    let origin = new THREE.Vector3(0, 0, 0);
    let innerColor = getRandomColor(0.8, 0.1, 0.8);
    let black = new THREE.Color(0x000000);
    let geom = new THREE.Geometry();
    let nbrRays = getRandomInt(1, maxRays);
    for (let i = 0; i < nbrRays; i++) {
        let r = rad * getRandomFloat(0.1, maxRad);
        let dest = getRandomPointOnSphere(r);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, black);
    }
    let args = {vertexColors: true, linewidth: 2};
    let mat = new THREE.LineBasicMaterial(args);
    return new THREE.Line(geom, mat, THREE.LineSegments);
}




function animate() {
    window.requestAnimationFrame(animate);
    render();
}

let controls = new function() {
    this.nbrBursts = 400;
    this.burstRadius = 1.0;
    this.maxRays = 100;
	this.BigRadius = 6;
	this.SmallRadius = 2;
    this.Go = update;
}

function initGui() {
    let gui = new dat.GUI();
    gui.add(controls, 'nbrBursts', 5, 2000).step(5).name('Nbr of bursts');
    gui.add(controls, 'burstRadius', 0.1, 5.0).name('Burst radius');
    gui.add(controls, 'maxRays', 5, 200).name('Max nbr of rays');
	gui.add(controls, 'BigRadius', 4, 20).name('Torus Big radius');
    gui.add(controls, 'SmallRadius', 1, 15).name('Torus Small radius');
    gui.add(controls, 'Go');
}

function update() {
    let nbrBursts = controls.nbrBursts;
    let burstRadius = controls.burstRadius;
    let maxRays = controls.maxRays;
	let BigRadius = controls.BigRadius;
	let SmallRadius = controls.SmallRadius;
    if (root)
        scene.remove(root);
    root = starburstsOnTorusA(nbrBursts, BigRadius, SmallRadius, maxRays, burstRadius);
    scene.add(root);
}



function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 0, 40);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
    let container = document.getElementById('container');
    let canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}



init();
createSceneA();
initGui();
addToDOM();
animate();
