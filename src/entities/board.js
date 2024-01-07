import { Canvas } from "./canvas.js";
import { Piece, pieceTypes } from "./piece.js";

export class Board extends Canvas {
	#white = "#ddd";
	#black = "#222";

	constructor() {
		super();

		this.cells = [];
		const box = { h: this.canvas.height / 8, w: this.canvas.width / 8 };

		for (let i = 0; i < 8; i++) {
			const row = [];
			for (let j = 0; j < 8; j++) {
				row.push({ x: j * box.w, y: i * box.h, w: box.w, h: box.h, piece: null });
			}
			this.cells.push(row);
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.cells.forEach((row, i) => {
			row.forEach((cell, j) => {
				this.ctx.fillStyle = this.getCellColor(i, j);
				this.ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
				this.drawNoteOnCell(i, j);
				cell.piece?.draw(this.ctx, cell, 15);
			});
		});
	}

	drawNoteOnCell(i, j) {
		const { x, y, w, h } = this.cells[i][j];
		const note = this.indexToNote(i, j);

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = "italic normal 500 20px sans-serif";

		this.ctx.globalAlpha = 0.3;
		this.ctx.fillStyle = this.getCellColor(i, j) === this.#white ? this.#black : this.#white;
		this.ctx.fillText(note, x + w / 2, y + h / 2);
		this.ctx.globalAlpha = 1;
	}

	getCellColor(i, j) {
		const isWhite = i % 2 == j % 2;
		return isWhite ? this.#white : this.#black;
	}

	indexToNote(i, j) {
		const files = "abcdefgh";
		const note = files[j] + (8 - i);
		return note;
	}

	noteToIndex(note) {
		const files = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
		const [file, rank] = note.split("");
		const index = [8 - rank, files[file]];
		return index;
	}

	setPiece(pieceType, note) {
		const [i, j] = this.noteToIndex(note);
		const piece = new Piece(pieceType);
		this.cells[i][j].piece = piece;
	}

	setInitialPieces() {
		const positions = {
			a1: pieceTypes.rook,
			b1: pieceTypes.bishop,
			c1: pieceTypes.knight,
			d1: pieceTypes.queen,
			e1: pieceTypes.king,
			f1: pieceTypes.knight,
			g1: pieceTypes.bishop,
			h1: pieceTypes.rook,

			a2: pieceTypes.pawn,
			b2: pieceTypes.pawn,
			c2: pieceTypes.pawn,
			d2: pieceTypes.pawn,
			e2: pieceTypes.pawn,
			f2: pieceTypes.pawn,
			g2: pieceTypes.pawn,
			h2: pieceTypes.pawn,
		};
		for (const note in positions) {
			this.setPiece(positions[note], note);
		}
		this.draw();
	}
}
