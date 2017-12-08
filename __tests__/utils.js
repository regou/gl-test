const THREE = global.THREE = require('three');
const headlessGl = require("gl");
const pngStream = require('three-png-stream');
const fs = require('fs');
const path = require('path');

const looksSame = require('looks-same');

const width = 400;
const height = 300;
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR  = 10000;

function init(camerax, cameray, cameraz) {
	const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, width / height, NEAR, FAR);
	const scene = new THREE.Scene();
	let gl = headlessGl(width, height, { preserveDrawingBuffer: true });
	let canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	scene.add(camera);
	camera.position.set(camerax || 0, cameray || 0, cameraz || 10);
	camera.lookAt(scene.position);

	// const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	// scene.add(light);

	const ambientLight = new THREE.AmbientLight(0xAAAAAA);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
	directionalLight.position.set(10, 8, 0.0);
	scene.add(directionalLight);


	let target = new THREE.WebGLRenderTarget(
		width, height, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		});

	let renderer = new THREE.WebGLRenderer({
		antialias: false,
		canvas: canvas,
		context:gl
	});
	// renderer.setClearColor(new THREE.Color( 0xff0000 ), 1);



	return {renderer,canvas,camera,scene,target};
}

function genPng(renderer, target, name, isSpec) {
	var output = fs.createWriteStream(getImagePath(name,isSpec ? 'spec':'cur'));
	let s = pngStream(renderer, target)
		.pipe(output)
	return streamToPromise(s);
}

function streamToPromise(stream) {
	return new Promise(function(resolve, reject) {
		stream.on("finish", resolve);
		stream.on("error", reject);
	})
}

/**
 * Get image path base on test name.
 * @private
 * @param {String} name The test case name.
 * @param {String} type spec|cur|diff
 * @returns {String} path
 */
function getImagePath(name,type) {
	return `./__tests__/comparisons/${name}.${type}.png`;
}

function isSameImage(imageName) {
	return new Promise(function (res,rej) {
		try{
			let specImage = getImagePath(imageName,'spec');
			let curImage = getImagePath(imageName,'cur');
			looksSame(specImage, curImage, {ignoreAntialiasing: true}, function(error, equal) {
				if(error){rej(error)}
				res(equal);
				if(!equal){
					console.error(`${imageName} is NOT same with spec image!
					See ${imageName}.diff.png
					`);
					genDiffImage(imageName);
				}
			});
		}catch (error){
			rej(error);
		}
	});
}

function genDiffImage(imageName) {
	looksSame.createDiff({
		reference: getImagePath(imageName,'spec'),
		current: getImagePath(imageName,'cur'),
		diff: getImagePath(imageName,'diff'),
		highlightColor: '#ff00ff', //color to highlight the differences
		strict: false,//strict comparsion
		tolerance: 2.5
	}, function(error) {
	});
}


async function assertWithSpec (renderer,scene,camera,target,caseName) {
	renderer.render(scene, camera, target, true);
	await genPng(renderer,target,caseName);
	let isSame = await isSameImage(caseName);
	expect(isSame).toBe(true)
}



module.exports = {init,genPng,getImagePath,isSameImage,assertWithSpec};
