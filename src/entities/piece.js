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

		/* =========== Castling (Start) =========== */
		if (this.pieceType === pieceTypes.king && prevI === curI && Math.abs(curJ - prevJ) === 2) {
			const rookDestPoint = (curJ - prevJ) / 2;
			const rookDestNote = this.board.indexToNote(prevI, prevJ + rookDestPoint);
			let tempJ = curJ;
			while (true) {
				tempJ += rookDestPoint;
				const cell = this.board.cells[prevI][tempJ];
				if (!cell) break;
				if (cell.piece && cell.piece.pieceType === pieceTypes.rook) {
					cell.piece.moveLegally(rookDestNote);
					break;
				}
			}
		}
		/* =========== Castling (End) =========== */

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
		let paths = [];

		const getPaths = {
			[pieceTypes.pawn]: () => {
				const [front, front2, left, right] =
					this.teamType === teamTypes.white
						? [this.board.cells[i - 1]?.[j], this.board.cells[i - 2]?.[j], this.board.cells[i - 1]?.[j - 1], this.board.cells[i - 1]?.[j + 1]]
						: [this.board.cells[i + 1]?.[j], this.board.cells[i + 2]?.[j], this.board.cells[i + 1]?.[j - 1], this.board.cells[i + 1]?.[j + 1]];

				if (front && !front.piece) {
					paths.push(front.note);
					if (this.moveCount < 1 && front2 && !front2.piece) paths.push(front2.note);
				}
				if (left && left.piece && left.piece.teamType !== this.teamType) paths.push(left.note);
				if (right && right.piece && right.piece.teamType !== this.teamType) paths.push(right.note);
			},
			[pieceTypes.knight]: () => {
				[
					[1, 2],
					[2, 1],
					[-1, 2],
					[-2, 1],
					[1, -2],
					[2, -1],
					[-1, -2],
					[-2, -1],
				].forEach(([x, y]) => {
					const cell = this.board.cells[i + x]?.[j + y];
					if (cell && !(cell.piece && cell.piece.teamType === this.teamType)) paths.push(cell.note);
				});
			},
			[pieceTypes.bishop]: () => {
				[
					[1, 1],
					[-1, -1],
					[1, -1],
					[-1, 1],
				].forEach(([x, y]) => {
					let [ci, cj] = [i, j];
					while (true) {
						ci += x;
						cj += y;
						const cell = this.board.cells[ci]?.[cj];
						if (!cell) break;
						if (cell.piece && cell.piece.teamType === this.teamType) break;
						paths.push(cell.note);
						if (cell.piece) break;
					}
				});
			},
			[pieceTypes.rook]: () => {
				[
					[0, 1],
					[1, 0],
					[0, -1],
					[-1, 0],
				].forEach(([x, y]) => {
					let [ci, cj] = [i, j];
					while (true) {
						ci += x;
						cj += y;
						const cell = this.board.cells[ci]?.[cj];
						if (!cell) break;
						if (cell.piece && cell.piece.teamType === this.teamType) break;
						paths.push(cell.note);
						if (cell.piece) break;
					}
				});
			},
			[pieceTypes.queen]: () => {
				[
					[0, 1],
					[1, 0],
					[1, 1],
					[0, -1],
					[-1, 0],
					[-1, -1],
					[1, -1],
					[-1, 1],
				].forEach(([x, y]) => {
					let [ci, cj] = [i, j];
					while (true) {
						ci += x;
						cj += y;
						const cell = this.board.cells[ci]?.[cj];
						if (!cell) break;
						if (cell.piece && cell.piece.teamType === this.teamType) break;
						paths.push(cell.note);
						if (cell.piece) break;
					}
				});
			},
			[pieceTypes.king]: () => {
				[
					[0, 1],
					[1, 0],
					[1, 1],
					[0, -1],
					[-1, 0],
					[-1, -1],
					[1, -1],
					[-1, 1],
				].forEach(([x, y]) => {
					const cell = this.board.cells[i + x]?.[j + y];
					if (cell && !(cell.piece && cell.piece.teamType === this.teamType)) paths.push(cell.note);
				});

				// castling
				if (this.moveCount < 1) {
					let lj = j;
					while (true) {
						lj--;
						const cell = this.board.cells[i][lj];
						if (!cell) break;
						if (cell.piece) {
							if (cell.piece.pieceType === pieceTypes.rook && cell.piece.moveCount < 1) paths.push(this.board.indexToNote(i, j - 2));
							break;
						}
					}
					let rj = j;
					while (true) {
						rj++;
						const cell = this.board.cells[i][rj];
						if (!cell) break;
						if (cell.piece) {
							if (cell.piece.pieceType === pieceTypes.rook && cell.piece.moveCount < 1) paths.push(this.board.indexToNote(i, j + 2));
							break;
						}
					}
				}
			},
		};

		getPaths[this.pieceType]();

		return paths;
	}
}
