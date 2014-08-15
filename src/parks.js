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

		function Park(color, cellsArray) {
			this.color = color;
			this.cells = cellsArray || [];

			return this;
		}

		function Puzzle(id, rowsArray, parksArray) {
			this.id = id;
			this.rows = rowsArray || [];
			this.parks = parksArray || [];

			this.getCells = function getCells(onlyBlanks) {
				var allCells = [];
				_.forEach(this.rows, function eachRow(row) {
					allCells = allCells.concat(row.cells);
				});

				return onlyBlanks ? _.filter(allCells, {state: undefined}) : allCells;
			};

			return this;
		}

		var $s = $scope;

		function loadPuzzle(newPuzzle) {
			$s.puzzle = new Puzzle(newPuzzle.id);
			var puzzleColors = newPuzzle.puzzleColors;

			var gridSize = 5;	//	5x5 puzzle

			//	Fill puzzle with cells and those cells' colors
			for (var i = 0; i < gridSize; i++) {
				$s.puzzle.rows.push(new Row());

				for (var j = 0; j < gridSize; j++) {
					var colorName = 'color' + puzzleColors[i][j];
					var thisCell = new Cell(colorName, i, j);
					$s.puzzle.rows[i].cells.push(thisCell);

					if (!_.some($s.puzzle.parks, {color: colorName})) {	//	if there are no parks with this color
						$s.puzzle.parks.push(new Park(colorName));	//	add the park
					}
					_.find($s.puzzle.parks, {color: colorName}).cells.push(thisCell);	//	add this cell to the park
				}
			}
		}

		$s.availablePuzzles = [
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
			}
		];
				//	BLANK PUZZLE TEMPLATE
				// {
				// 	id: ,
				// 	puzzleColors: [
				// 		[, , , , ],
				// 		[, , , , ],
				// 		[, , , , ],
				// 		[, , , , ],
				// 		[, , , , ]
				// 	]
				// }

			//	another option for puzzle (DOESN'T WORK WITH THIS ONE YET!)


		$s.puzzleChose = $s.availablePuzzles[0];

		$s.choosePuzzle = function choosePuzzle() {
			loadPuzzle($s.puzzleChose);
		};

		$s.puzzle = {};

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

		$s.changeState = function changeState(cell, state, blank) {
			var maintain = blank || false;
			if (state) {	//	this is set via the solve button only
				cell.state = !maintain ? state : cell.state || state;

				if (state === 'tree') {
					autoDotNeighbors(cell, 'all');
				}
			} else if (_.contains($s.cellStates, $s.selectedAction)) {
				cell.state = $s.selectedAction;
			} else {	//	the rotate option is on
				cell.state = (cell.state === 'dot' ? 'tree' : (cell.state === 'tree' ? undefined : 'dot'));
			}
		};

		function identifyNeighbors(primaryCell, kindsOfNeighbors, relativeCoords, onlyBlanks) {
			var neighborsObj = {
				row: _.where($s.puzzle.getCells(), {row: primaryCell.row}),
				column: _.where($s.puzzle.getCells(), {column: primaryCell.column}),
				park: _.where($s.puzzle.getCells(), {color: primaryCell.color}),
				diagonallyAdjacent: _.where($s.puzzle.getCells(), function matchDiagonallyAdjacentNeighbors(cellToCheck) {
					return Math.abs(cellToCheck.row - primaryCell.row) + Math.abs(cellToCheck.column - primaryCell.column) === 2;
				}),
				relative: _.where($s.puzzle.getCells(), function matchRelative(cellToCheck) {
					if (relativeCoords) {
						return cellToCheck.row === primaryCell.row + relativeCoords.y && cellToCheck.column === primaryCell.column + relativeCoords.x;
					}
				})
			};

			var neighbors = [];
			if (kindsOfNeighbors === 'all') {
				_.forOwn(neighborsObj, function eachGroupOfNeighbors(group) {
					neighbors = _.union(neighbors, group);
				});
			} else if (typeof kindsOfNeighbors === 'string') {
				neighbors = neighborsObj[kindsOfNeighbors];
			}	else { //	kindsOfNeighbors is an array
				_.forEach(kindsOfNeighbors, function eachKind(kind) {
					neighbors = _.union(neighbors, neighborsObj[kind]);
				});
			}

			if (onlyBlanks) {
				neighbors = _.filter(neighbors, {state: undefined});
			}

			return _.pull(neighbors, primaryCell);
		}

		function autoDotNeighbors(cell, kindsOfNeighbors, relativeCoords) {
			_.forEach(identifyNeighbors(cell, kindsOfNeighbors, relativeCoords), function eachCell(thisCell) {
				$s.changeState(thisCell, 'dot');
			});
		}

		function autoDotCommon(cells, property) {
			var allBlankCells = $s.puzzle.getCells(true);

			var diffCellsWithSameProperty = _.filter(allBlankCells, function filterByProperty(cell) {
				return cell[property] === cells[0].property && !_.contains(cells, cell);
			});

			_.forEach(diffCellsWithSameProperty, function eachCell(cell) {
				$s.changeState(cell, 'dot');
			});
		}

		function findCommonality(cells, ignoreList) {
			var commonalities = [];

			if (cells.length === 2) {
				if (cells[0].row === cells[1].row) {
					commonalities.push('row');

					if (Math.abs(cells[0].column - cells[1].column) === 1) {
						commonalities.push('orthogonallyAdjacent');
					}
				} else if (cells[0].column === cells[1].column) {
					commonalities.push('column');

					if (Math.abs(cells[0].row - cells[1].row) === 1) {
						commonalities.push('orthogonallyAdjacent');
					}
				} else if (Math.abs(cells[0].row - cells[1].row) + Math.abs(cells[0].column - cells[1].column) === 2) {
					commonalities.push('diagonallyAdjacent');
				}

				if (cells[0].color === cells[1].color) {
					commonalities.push('park');
				}
			} else {
				var possibleCommonalities = ['row', 'column', 'park'];
				_.forEach(cells, function eachCell(cell) {
					_.forEach(possibleCommonalities, function eachCommonality(commonality) {
						if (cell[commonality] !== cells[0][commonality]) {
							_.pull(possibleCommonalities, commonality);
						}
					});
				});

				commonalities = possibleCommonalities;
			}

			return _.isArray(ignoreList) ? _.difference(commonalities, ignoreList) : commonalities;
		}

		function findLonerCells(cells) {
			var lonerCells = [];

			function isAlone(cell, kindOfNeighbors) {
				return !identifyNeighbors(cell, kindOfNeighbors, undefined, true).length;
			}

			_.forEach(cells, function eachCell(cell) {
				if (isAlone(cell, 'row') || isAlone(cell, 'column') || isAlone(cell, 'park')) {
					lonerCells.push(cell);	//	this cell is all alone in its row, column, or park! (must be a tree!)
				}
			});

			return lonerCells;
		}

		// function findMiddle(cells) {
		// 	var sortCells = _.sortBy(cells, ['row', 'column']);
		// 	return cells[1];
		// }

		function puzzleSolved(puzzle) {
			var treeCount = 0;

			_.forEach(puzzle.getCells(), function(cell) {
				if(cell.state === 'tree') {
					treeCount++;
				}
			});

			return treeCount === puzzle.rows.length;
		}

		$s.solvePuzzle = function solvePuzzle() {
			(function loopThroughParks() {
				function parkStatusCheck(park) {
					var parkStatus = 'error';	//	default condition (if all cells have dots);
					_.forEach(park.cells, function eachCell(cell) {
						if (cell.state === 'tree') {
							parkStatus = 'solved';
							return false;
						} else if (_.isUndefined(cell.state)) {
							parkStatus = 'unsolved';
							return false;
						}
					});
					return parkStatus;
				}

				$s.puzzle.parks = _.filter($s.puzzle.parks, function filterOutSolvedParks(park) {	//	only unsolved parks
					return parkStatusCheck(park) === 'unsolved';
				});
				_.forEach($s.puzzle.parks, function filterOutDots(park) {	//	only the blank cells
					park.cells = _.filter(park.cells, {state: undefined});
				});
				$s.puzzle.parks = _.sortBy($s.puzzle.parks, function compareCellLength(park) {
					return park.cells.length;	//	sort parks in order of the number of cells of each color (smallest parks first);
				});

				_.forEach($s.puzzle.parks, function eachPark(park) {
					var commonalities;

					/***********************
						Notes from this morning (8/15):
						All state changes get a timestamp
						After looping through all the parks, we place a check state
						We loop through all parks again and check if states are equal
						if they are, we place a flag (which is a tree that is subject)
						in the smallest park. Then we run our loops again but run a test
						to see if the puzzle is solved. If the puzzle is not solved and there
						aren't any more places to put flags, then we yank the earliest flag and
						all state changes sense that flag are changed back to undefined. Place a 
						dot where the flag was and move on.
					************************/

					if (findLonerCells(park.cells).length) {
						_.forEach(findLonerCells(park.cells), function eachLonerCell(cell) {
							$s.changeState(cell, 'tree');
						});
						loopThroughParks();
						return false;
					} else {
						commonalities = findCommonality(park.cells, ['park']);	//	what do ALL of these cells have in common (besides 'park')?

						if (_.contains(commonalities, 'row') && !park.processedRowAlready) {	//	if in same row, dot all other cells in that row
							autoDotCommon(park.cells, 'row');
							park.processedRowAlready = true;
							loopThroughParks();
							return false;
						} else if (_.contains(commonalities, 'column') && !park.processedColumnAlready) {	//	if in same column, dot all other cells in that column
							autoDotCommon(park.cells, 'column');
							park.processedColumnAlready = true;
							loopThroughParks();
							return false;
						}

						if (_.contains(commonalities, 'orthogonallyAdjacent') && !park.processedDuplexAlready) {	//	only happens with duplexes
							if (_.contains(commonalities, 'row')) {
								_.forEach(park.cells, function eachCell(cell) {
									autoDotNeighbors(cell, 'relative', {x: 0, y: 1});
									autoDotNeighbors(cell, 'relative', {x: 0, y: -1});
								});
							} else {	//	same column
								_.forEach(park.cells, function eachCell(cell) {
									autoDotNeighbors(cell, 'relative', {x: 1, y: 0});
									autoDotNeighbors(cell, 'relative', {x: -1, y: 0});
								});
							}

							park.processedDuplexAlready = true;
							loopThroughParks();
							return false;
						}

						// } else if (park.cells.length === 3) {
						// 	if (_.contains(commonalities, 'row') && !park.processedDuplexAlready) {
						//  && !park.processedTripleAlready) {
						// 	commonalities = _.union(
						// 		findCommonality(park.cells[0], park.cells[1]),
						// 		findCommonality(park.cells[1], park.cells[2]),
						// 		findCommonality(park.cells[0], park.cells[2])
						// 	);

						// 	if (_.contains(commonalities, 'diagonallyAdjacent')) {
						// 		// place dot in missing corner
						// 	} else {
						// 		// in a row
						// 		var cell = findMiddle(park.cells);
						// 		if (_.contains(commonalities, 'row')) {
						// 			autoDotNeighbors(cell, 'relative', {x: 0, y: 1});
						// 			autoDotNeighbors(cell, 'relative', {x: 0, y: -1});
						// 		} else {	//	same column
						// 			autoDotNeighbors(cell, 'relative', {x: 1, y: 0});
						// 			autoDotNeighbors(cell, 'relative', {x: -1, y: 0});
						// 		}
						// 	}
						// 	park.processedTripleAlready = true;
						// 	loopThroughParks();
						// 	return false;
					// } else if (checkOrthogonal(park) && !park.processedOrthAlready) {
					// 	autoDotOrthogonal(park);
					// 	park.processedOrthAlready = true;
					// 	loopThroughParks();
					// 	return false;
					// } else {
					//  	findCommonality(park.cells);
						// console.log('park ' + park.color + ' has ' + park.cells.length + ' blank cells');
					}
				});
			})();
		};

		loadPuzzle($s.puzzleChose);
	}
]);
