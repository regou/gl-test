const THREE = require('three');

class TextMesh extends THREE.Mesh {
	constructor(text, size, color, backGroundColor, backgroundMargin){

		if(!backgroundMargin)
			backgroundMargin = 50;
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		context.font = size + "pt Arial";
		var textWidth = context.measureText(text).width;
		canvas.width = textWidth + backgroundMargin;
		canvas.height = size + backgroundMargin;
		context = canvas.getContext("2d");
		context.font = size + "pt Arial";
		if(backGroundColor) {
			context.fillStyle = backGroundColor;
			context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, canvas.height / 2 - size / 2 - +backgroundMargin / 2, textWidth + backgroundMargin, size + backgroundMargin);
		}
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = color;
		context.fillText(text, canvas.width / 2, canvas.height / 2);
		// context.strokeStyle = "black";
		// context.strokeRect(0, 0, canvas.width, canvas.height);
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		var material = new THREE.MeshBasicMaterial({
			map : texture
		});


		super(new THREE.PlaneGeometry(canvas.width, canvas.height), material);

		this.changePos(0,0,0);

	}
	changePos(x,y,z){
		this.doubleSided = true;
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
	}
}

module.exports = TextMesh;
