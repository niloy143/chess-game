export const teamTypes = {
	white: "WHITE",
	black: "BLACK",
};

export const pieceTypes = {
	pawn: "PAWN",
	knight: "KNIGHT",
	bishop: "BISHOP",
	rook: "ROOK",
	queen: "QUEEN",
	king: "KING",
};

export class Piece {
	#img = document.getElementById("img");
	#crop = {
		x: {
			[pieceTypes.pawn]: 1000,
			[pieceTypes.knight]: 800,
			[pieceTypes.bishop]: 600,
			[pieceTypes.rook]: 400,
			[pieceTypes.queen]: 200,
			[pieceTypes.king]: 0,
		},
		y: 0,
		w: 200,
		h: 200,
	};
	#padding = 15;

	constructor(board, pieceType, teamType, note, position) {
		this.pieceType = pieceType;
		this.teamType = teamType;
		this.board = board;
		this.note = note;
		this.position = position;
	}

	draw() {
		const { x, y, w, h } = this.position || this.board.getCellByNote(this.note);
		this.board.ctx.drawImage(
			this.#img,
			this.#crop.x[this.pieceType],
			this.#crop.y,
			this.#crop.w,
			this.#crop.h,
			x + this.#padding / 2,
			y + this.#padding / 2,
			w - this.#padding,
			h - this.#padding
		);
	}
}
