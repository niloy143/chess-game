export class Canvas {
	canvas = document.getElementById("canvas");

	constructor() {
		this.canvas.width = 600;
		this.canvas.height = 600;
		this.ctx = canvas.getContext("2d");
	}
}
