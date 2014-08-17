
//	BLANK PUZZLE TEMPLATE
// {
// 	id: #,
// 	puzzleColors: [
// 		[, , , , ],
// 		[, , , , ],
// 		[, , , , ],
// 		[, , , , ],
// 		[, , , , ]
// 	]
// }
app.factory('PuzzleFactory', [function PuzzleFactory() {
	return {
		getAllPuzzles: function getAllPuzzles() {
			return [
				{
					id: 1,
					puzzleColors: [
						[1, 1, 1, 1, 2],
						[2, 2, 2, 2, 2],
						[2, 2, 3, 4, 4],
						[3, 3, 3, 3, 3],
						[3, 3, 5, 3, 3]
					]
				}, {
					id: 2,
					puzzleColors: [
						[1, 1, 1, 2, 2],
						[1, 1, 1, 1, 3],
						[1, 1, 3, 3, 3],
						[1, 1, 4, 4, 5],
						[5, 5, 5, 5, 5]
					]
				}, {
					id: 3,
					puzzleColors: [
						[1, 1, 1, 2, 2],
						[1, 1, 1, 2, 2],
						[1, 1, 1, 3, 4],
						[5, 5, 5, 3, 4],
						[5, 3, 3, 3, 4]
					]
				}, {
					id: 4,
					puzzleColors: [
						[1, 2, 2, 2, 2],
						[1, 1, 2, 3, 2],
						[4, 1, 2, 3, 5],
						[4, 1, 1, 3, 5],
						[4, 4, 3, 3, 3]
					]
				}, {
					id: 5,
					puzzleColors: [
						[1, 1, 2, 2, 2, 2],
						[1, 1, 1, 2, 2, 2],
						[1, 1, 1, 1, 3, 2],
						[4, 1, 1, 3, 3, 3],
						[4, 5, 5, 5, 6, 3],
						[4, 4, 5, 5, 6, 6]
					]
				}, {
					id: 6,
					puzzleColors: [
						[1, 1, 2, 2, 3, 3, 4],
						[1, 1, 2, 2, 3, 3, 3],
						[5, 5, 5, 2, 3, 6, 6],
						[5, 5, 5, 2, 3, 6, 6],
						[5, 5, 3, 3, 3, 6, 6],
						[5, 5, 7, 7, 7, 6, 6],
						[7, 7, 7, 7, 7, 7, 7]
					]
				}, {
					id: 7,
					puzzleColors: [
						[1, 1, 1, 1, 1, 2, 2],
						[3, 1, 1, 1, 2, 2, 4],
						[3, 1, 5, 5, 6, 4, 4],
						[3, 1, 5, 6, 6, 7, 4],
						[3, 1, 5, 3, 7, 7, 4],
						[3, 3, 3, 3, 7, 4, 4],
						[3, 3, 3, 4, 4, 4, 4]
					]
				}, {
					id: 8,
					puzzleColors: [
						[1, 1, 1, 1, 1, 1, 1, 2],
						[1, 3, 3, 4, 4, 4, 1, 2],
						[1, 3, 3, 4, 3, 4, 2, 2],
						[1, 3, 3, 3, 3, 3, 2, 5],
						[3, 3, 3, 6, 3, 3, 3, 5],
						[3, 3, 6, 6, 3, 3, 5, 5],
						[3, 6, 6, 6, 7, 8, 5, 8],
						[3, 6, 6, 7, 7, 8, 8, 8]
					]
				}, {
					id: 9,
					puzzleColors: [
						[1, 1, 1, 1, 2, 2, 2, 2],
						[1, 1, 2, 1, 2, 2, 2, 3],
						[1, 1, 2, 2, 2, 2, 3, 3],
						[1, 1, 1, 1, 4, 3, 3, 5],
						[6, 1, 4, 4, 4, 5, 5, 5],
						[6, 4, 4, 4, 4, 4, 7, 5],
						[6, 6, 8, 8, 4, 4, 7, 5],
						[6, 8, 8, 7, 7, 7, 7, 5]
					]
				}, {
					id: 10,
					puzzleColors: [
						[1, 1, 1, 1, 1, 1, 1, 2, 2],
						[1, 1, 1, 1, 3, 3, 4, 4, 2],
						[5, 1, 1, 1, 3, 4, 4, 2, 2],
						[5, 1, 1, 3, 3, 6, 4, 4, 4],
						[5, 5, 1, 1, 1, 6, 6, 6, 4],
						[5, 7, 6, 6, 6, 6, 4, 4, 4],
						[7, 7, 7, 6, 8, 8, 8, 4, 4],
						[7, 6, 6, 6, 8, 9, 9, 9, 4],
						[7, 6, 8, 8, 8, 8, 8, 9, 9]
					]
				}, {
					id: 'Christmas 149',
					puzzleColors: [
						[1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3],
						[1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3],
						[4, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 5],
						[4, 1, 1, 1, 3, 3, 3, 3, 3, 3, 5, 5],
						[4, 1, 1, 1, 6, 6, 6, 6, 6, 5, 5, 5],
						[7, 1, 1, 1, 6, 6, 6, 6, 6, 5, 5, 5],
						[7, 7, 7, 8, 8, 8, 8, 8, 9, 5, 5, 5],
						[7, 7, 7, 7, 8, 8, 8, 8, 9, 10, 5, 5],
						[7, 7, 7, 8, 8, 11, 11, 9, 9, 10, 5, 5],
						[7, 7, 7, 11, 11, 11, 11, 11, 10, 10, 10, 10],
						[7, 7, 7, 12, 12, 12, 12, 11, 10, 10, 10, 10],
						[7, 7, 7, 7, 12, 12, 12, 12, 10, 10, 10, 10]
					]
				}
			];
		}
	}
}]);