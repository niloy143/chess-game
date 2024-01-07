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

	constructor(pieceType) {
		this.pieceType = pieceType;
	}

	draw(ctx, { x, y, w, h }, padding = 0) {
		ctx.drawImage(
			this.#img,
			this.#crop.x[this.pieceType],
			this.#crop.y,
			this.#crop.w,
			this.#crop.h,
			x + padding/2,
			y + padding/2,
			w - padding,
			h - padding
		);
	}
}
