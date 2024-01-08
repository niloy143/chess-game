import { Board } from "./entities/board.js";

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const board = new Board(canvas, ctx);
board.draw();
board.setInitialPieces();

function onGrabStart(e) {
	board.setGrabbedNote(e.offsetX, e.offsetY);
	if (board.grabbedNote) {
		board.moveGrabbedPiece(e.offsetX, e.offsetY);
		canvas.style.cursor = "grabbing";
	}
}

function onGrabbing(e) {
	board.moveGrabbedPiece(e.offsetX, e.offsetY);
}

function onGrabEnd(e) {
	board.putGrabbedPiece(e.offsetX, e.offsetY);
	canvas.style.cursor = "default";
}

canvas.addEventListener("pointerdown", onGrabStart);
canvas.addEventListener("touchstart", onGrabStart);

canvas.addEventListener("pointermove", onGrabbing);
canvas.addEventListener("touchmove", onGrabbing);

canvas.addEventListener("pointerup", onGrabEnd);
canvas.addEventListener("touchend", onGrabEnd);
