const THREE = global.THREE = require('three');
const testUtils = require('./utils');

describe('three', function () {

	test('Sprite ok',async function () {
		const {renderer,canvas,camera,scene,target} = testUtils.init(1, 2, 3);

		function draw() {
			var canvas = document.createElement('canvas');
			var size = 256; // CHANGED
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext('2d');
			context.fillStyle = '#ff0000'; // CHANGED
			context.textAlign = 'center';
			context.font = '24px Arial';
			context.fillText("some text", size / 2, size / 2);
			return canvas;
		}

		var amap = new THREE.Texture(draw());
		amap.needsUpdate = true;

		var mat = new THREE.SpriteMaterial({
			map: amap,
			transparent: false,
			useScreenCoordinates: false,
			color: 0xffffff
		});

		var sp = new THREE.Sprite(mat);
		scene.add(sp);

		renderer.render(scene, camera, target, true);

		await testUtils.genPng(renderer,target,'Sprite_ok');

	});



});
