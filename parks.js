var app = angular.module('ParksApp', []);

app.controller('ParksController', [
	'$scope',
	function ParksController($scope) {
		function Cell(color, row, column, state) {
			this.color = color;
			this.row = row;
			this.column = column;
			this.state = state;

			return this;
		}

		function Row(cellsArray) {
			this.cells = cellsArray || [];

			return this;
		}

		function Puzzle(id, rowsArray) {
			this.id = id;
			this.rows = rowsArray || [];

			return this;
		}

		var $s = $scope;

		function loadPuzzle() {
			var puzzleColors = [
				[1, 1, 1, 1, 2],
				[2, 2, 2, 2, 2],
				[2, 2, 3, 4, 4],
				[3, 3, 3, 3, 3],
				[3, 3, 5, 3, 3]
			];

			var gridSize = 5;	//	5x5 puzzle
			var puz = $s.puzzle;	//	first puzzle (the only one i'll really be using for a while)
			for (var i = 0; i < gridSize; i++) {
				puz.rows.push(new Row());

				for (var j = 0; j < gridSize; j++) {
					puz.rows[i].cells.push(new Cell(puzzleColors[i][j], i, j));
				}
			}
		}

		$s.this.puzzle = new Puzzle(1);

		$s.selectedAction = 'rotate';
		$s.cellStates = ['blank', 'dot', 'tree', 'note'];
		$s.actions = ['rotate'].concat($s.cellStates);
		$s.actionIcons = {
			rotate: 'refresh',
			blank: 'square-o',
			tree: 'tree',
			dot: 'circle',
			note: 'flag'
		};

		$s.selectThisAction = function selectThisAction(action) {
			$s.selectedAction = action;
		};

		$s.changeState = function changeState(cell) {
			if (_.contains($s.cellStates, $s.selectedAction)) {
				cell.state = $s.selectedAction);
			} else {	//	the rotate option is on
				cell.state = (cell.state === 'dot' ? 'tree' : (cell.state === 'tree' ? undefined : 'dot'));
			}
		};

		$s.puzzleSolved = {
			colors: [],
			rows: [],
			columns: []
		};

		$s.solvePuzzle = function solvePuzzle() {
			var puz = $s.puzzle;

			function countCellColors() {
				var colorCounts = [];
				var rows = puz.rows;
				for (var i = 0; i < rows.length; i++) {
					var cells = rows[i].cells;

					for (var j = 0; j < cells.length; j++) {
						var cell = cells[j];

						if (_.contains(colorCounts, cell.color)) {
							colorCounts[cell.color]++;
						} else {
							colorCounts[cell.color] = 1;
						}
					}
				}

				return colorCounts;
			}

			var cellColorCounts = countCellColors();

			console.log(cellColorCounts);
		};

		loadPuzzle();
	}
]);
