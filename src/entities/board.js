import { Canvas } from "./canvas.js";
import { Piece, pieceTypes, teamTypes } from "./piece.js";

export class Board extends Canvas {
	#colors = {
		white: "#dddddd",
		black: "#222222",
	};
	#cells = [];
	#pieces = [];
	#files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	#ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

	constructor() {
		super();
		this.setInitialBoard();
		this.setInitialPieces();
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.#cells.forEach((row, i) => {
			row.forEach((cell, j) => {
				this.ctx.fillStyle = this.getCellColor(i, j);
				this.ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
				this.drawNoteOnCell(i, j);
			});
		});
		this.#pieces.forEach((piece) => {
			piece.draw();
		});
	}

	drawNoteOnCell(i, j) {
		const { x, y, w, h } = this.#cells[i][j];
		const note = this.indexToNote(i, j);

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.font = "italic normal 500 20px sans-serif";

		this.ctx.globalAlpha = 0.3;
		this.ctx.fillStyle = this.getNoteColor(i, j);
		this.ctx.fillText(note, x + w / 2, y + h / 2);
		this.ctx.globalAlpha = 1;
	}

	getCellColor(i, j) {
		const isWhite = i % 2 == j % 2;
		return isWhite ? this.#colors.white : this.#colors.black;
	}

	getNoteColor(i, j) {
		return this.getCellColor(i, j) === this.#colors.white ? this.#colors.black : this.#colors.white;
	}

	indexToNote(i, j) {
		const note = this.#files[j] + this.#ranks[i];
		return note;
	}

	noteToIndex(note) {
		const [file, rank] = note.split("");
		const index = [this.#ranks.indexOf(rank), this.#files.indexOf(file)];
		return index;
	}

	getCellByNote(note) {
		const [i, j] = this.noteToIndex(note);
		const cell = this.#cells[i][j];
		return cell;
	}

	setInitialBoard() {
		this.#cells = [];
		const box = { h: this.canvas.height / 8, w: this.canvas.width / 8 };

		for (let i = 0; i < 8; i++) {
			const row = [];
			for (let j = 0; j < 8; j++) {
				row.push({ x: j * box.w, y: i * box.h, w: box.w, h: box.h, piece: null });
			}
			this.#cells.push(row);
		}
	}

	setInitialPieces() {
		this.#pieces = [];

		this.#files.forEach((file) => {
			const pawn = {
				white: new Piece(this, pieceTypes.pawn, teamTypes.white, file + "2", null),
				black: new Piece(this, pieceTypes.pawn, teamTypes.black, file + "7", null),
			};
			this.#pieces.push(pawn.white, pawn.black);

			let pieceType;
			if (file === "a" || file === "h") pieceType = pieceTypes.rook;
			if (file === "b" || file === "g") pieceType = pieceTypes.knight;
			if (file === "c" || file === "f") pieceType = pieceTypes.bishop;
			if (file === "d") pieceType = pieceTypes.queen;
			if (file === "e") pieceType = pieceTypes.king;

			const piece = {
				[pieceType]: {
					white: new Piece(this, pieceType, teamTypes.white, file + "1", null),
					black: new Piece(this, pieceType, teamTypes.black, file + "8", null),
				},
			};
			this.#pieces.push(piece[pieceType].white, piece[pieceType].black);
		});
	}
}
