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
		y: {
			[teamTypes.white]: 200,
			[teamTypes.black]: 0,
		},
		w: 200,
		h: 200,
	};
	#padding = 5;

	constructor(board, pieceType, teamType, note) {
		this.pieceType = pieceType;
		this.teamType = teamType;
		this.board = board;
		this.note = note;
		this.moveCount = 0;

		const [i, j] = this.board.noteToIndex(note);
		this.position = this.board.cells[i][j];

		this.board.setPiece(this);
	}

	draw() {
		const { x, y, w, h } = this.position;
		this.board.ctx.drawImage(
			this.#img,
			this.#crop.x[this.pieceType],
			this.#crop.y[this.teamType],
			this.#crop.w,
			this.#crop.h,
			x + this.#padding / 2,
			y + this.#padding / 2,
			w - this.#padding,
			h - this.#padding
		);
	}

	moveLegally(note) {
		let from = this.note,
			to = note;
		if (!this.isLegalMove(to)) to = from;
		else this.moveCount++;
		const { x, y, w, h } = this.board.getCellByNote(to);
		this.position = { x, y, w, h };

		const [prevI, prevJ] = this.board.noteToIndex(from);
		const [curI, curJ] = this.board.noteToIndex(to);

		this.board.cells[prevI][prevJ].piece = null;
		this.board.cells[curI][curJ].piece = this;
		this.note = to;
	}

	isLegalMove(to) {
		const legalMoves = this.getLegalMoves();
		return legalMoves.includes(to);
	}

	getLegalMoves() {
		const [i, j] = this.board.noteToIndex(this.note);

		const moves = {
			[pieceTypes.pawn]: (teamType) => {
				const paths = [],
					cells = this.board.cells;

				const [front, front2, left, right] =
					teamType === teamTypes.white
						? [cells[i - 1]?.[j], cells[i - 2]?.[j], cells[i - 1]?.[j - 1], cells[i - 1]?.[j + 1]]
						: [cells[i + 1]?.[j], cells[i + 2]?.[j], cells[i + 1]?.[j - 1], cells[i + 1]?.[j + 1]];

				if (front && !front.piece) {
					paths.push(front.note);
					if (this.moveCount < 1 && front2 && !front2.piece) paths.push(front2.note);
				}
				if (left && left.piece && left.piece.teamType !== this.teamType) paths.push(left.note);
				if (right && right.piece && right.piece.teamType !== this.teamType) paths.push(right.note);
				return paths;
			},
			[pieceTypes.knight]: (teamType) => {
				return [];
			},
			[pieceTypes.bishop]: (teamType) => {
				return [];
			},
			[pieceTypes.rook]: (teamType) => {
				return [];
			},
			[pieceTypes.queen]: (teamType) => {
				return [];
			},
			[pieceTypes.king]: (teamType) => {
				return [];
			},
		};

		return moves[this.pieceType](this.teamType);
	}
}
