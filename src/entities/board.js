import { Piece, pieceTypes, teamTypes } from "./piece.js";

export class Board {
	colors = {
		white: "#cceae1",
		black: "#487567",
	};
	border = {
		color: "#16ba3f",
		width: 4,
	};
	files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.cells = [];
		this.grabbedNote = "";

		this.setInitialBoard();
		this.setInitialPieces();
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		let grabbedPiece = null;
		this.cells.forEach((row, i) => {
			row.forEach((cell, j) => {
				this.ctx.fillStyle = this.getCellColor(i, j);
				this.ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
				this.drawNoteOnCell(i, j);
				if (cell.piece) {
					if (cell.piece.note === this.grabbedNote) grabbedPiece = cell.piece;
					else cell.piece.draw();
				}
			});
		});
		if (grabbedPiece) {
			const { x, y, w, h } = grabbedPiece.position;
			const note = this.coordsToNote(x + w / 2, y + h / 2);
			this.drawBorder(note);
			grabbedPiece.draw();
		}
	}

	drawBorder(note) {
		const { x, y, w, h } = this.getCellByNote(note);
		this.ctx.strokeStyle = this.border.color;
		const lw = this.border.width;
		this.ctx.lineWidth = lw;
		this.ctx.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
	}

	drawNoteOnCell(i, j) {
		const { x, y, w, h } = this.cells[i][j];
		const note = this.indexToNote(i, j);

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = "italic normal 500 20px sans-serif";

		this.ctx.globalAlpha = 0.3;
		this.ctx.fillStyle = this.getNoteColor(i, j);
		this.ctx.fillText(note, x + w / 2, y + h / 2);
		this.ctx.globalAlpha = 1;
	}

	setGrabbedNote(x, y) {
		const note = this.coordsToNote(x, y);
		if (note) {
			const cell = this.getCellByNote(note);
			if (cell.piece) this.grabbedNote = note;
		}
	}

	moveGrabbedPiece(x, y) {
		if (!this.grabbedNote) return;
		const cell = this.getCellByNote(this.grabbedNote);
		const { w, h } = cell.piece.position;
		let xl = Math.max(x - w / 2, 0),
			yl = Math.max(y - h / 2, 0);
		if (xl + w > this.canvas.width) xl = this.canvas.width - w;
		if (yl + h > this.canvas.height) yl = this.canvas.height - h;
		cell.piece.position = { x: xl, y: yl, w, h };
		this.draw();
	}

	putGrabbedPiece() {
		if (!this.grabbedNote) return;
		const { piece } = this.getCellByNote(this.grabbedNote);
		const { x, y, w, h } = piece.position;
		const note = this.coordsToNote(x + w / 2, y + h / 2);
		piece.moveLegally(note);
		this.draw();
		this.grabbedNote = "";
		this.draw();
	}

	getCellColor(i, j) {
		const isWhite = i % 2 == j % 2;
		return isWhite ? this.colors.white : this.colors.black;
	}

	getNoteColor(i, j) {
		return this.getCellColor(i, j) === this.colors.white ? this.colors.black : this.colors.white;
	}

	indexToNote(i, j) {
		const note = this.files[j] + this.ranks[i];
		return note;
	}

	noteToIndex(note) {
		const [file, rank] = note.split("");
		const index = [this.ranks.indexOf(rank), this.files.indexOf(file)];
		return index;
	}

	coordsToNote(x, y) {
		for (const row of this.cells) {
			for (const cell of row) {
				if (x >= cell.x && x <= cell.x + cell.w && y >= cell.y && y <= cell.y + cell.h) {
					return cell.note;
				}
			}
		}
	}

	getCellByNote(note) {
		const [i, j] = this.noteToIndex(note);
		const cell = this.cells[i][j];
		return cell;
	}

	setInitialBoard() {
		this.cells = [];
		const box = { h: this.canvas.height / 8, w: this.canvas.width / 8 };

		for (let i = 0; i < 8; i++) {
			const row = [];
			for (let j = 0; j < 8; j++) {
				row.push({
					x: j * box.w,
					y: i * box.h,
					w: box.w,
					h: box.h,
					note: this.indexToNote(i, j),
					piece: null,
				});
			}
			this.cells.push(row);
		}
	}

	setPiece(piece) {
		const [i, j] = this.noteToIndex(piece.note);
		this.cells[i][j].piece = piece;
	}

	setInitialPieces() {
		this.files.forEach((file) => {
			new Piece(this, pieceTypes.pawn, teamTypes.white, file + "2");
			new Piece(this, pieceTypes.pawn, teamTypes.black, file + "7");

			let pieceType;
			if (file === "a" || file === "h") pieceType = pieceTypes.rook;
			if (file === "b" || file === "g") pieceType = pieceTypes.knight;
			if (file === "c" || file === "f") pieceType = pieceTypes.bishop;
			if (file === "d") pieceType = pieceTypes.queen;
			if (file === "e") pieceType = pieceTypes.king;

			new Piece(this, pieceType, teamTypes.white, file + "1");
			new Piece(this, pieceType, teamTypes.black, file + "8");
		});
	}
}
