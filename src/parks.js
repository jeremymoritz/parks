var app = angular.module('ParksApp', []);

app.controller('ParksController', [
	'$scope',
	function ParksController($scope) {
		function Cell(color, row, column, state) {
			this.color = color;
			this.row = row;
			this.column = column;
			this.state = state;
			this.timestamp = 0;

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

		function logPuzzleState(puzzle) {
			var icons = {
				tree: '¶',
				dot: '•',
				note: '¥'
			};

			_.forEach((puzzle || $s.puzzle).rows, function eachRow(row) {
				logMessage += "\n";	//	logMessage is set outside
				_.forEach(row.cells, function eachCell(cell) {
					logMessage += cell.state ? icons[cell.state] : cell.color.slice(-1);
				});
			});

			console.log(logMessage);
			logMessage = '';	//	reset logMessage
		}

		var $s = $scope;
		var logMessage = '';

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
				id: 4,	//	not solved yet
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

		$s.changeState = function changeState(cell, state) {
			if (state) {	//	this is set via the solve button only
				cell.state = state;
				cell.timestamp = new Date().getTime();

				if (state === 'tree' || state === 'note') {
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
			_.forEach(identifyNeighbors(cell, kindsOfNeighbors, relativeCoords, true), function eachCell(thisCell) {
				$s.changeState(thisCell, 'dot');
			});
		}

		function autoDotCommon(cells, property) {	//	place dots on all cells with the given property in common with the given cells (but not the given cells themselves)
			//	EXAMPLE: if 3 cells are on the same row (property), this will dot the other cells in that row
			var allBlankCells = $s.puzzle.getCells(true);

			var diffCellsWithSameProperty = _.filter(allBlankCells, function filterByProperty(cell) {
				return cell[property] === cells[0][property] && !_.contains(cells, cell);
			});

			_.forEach(diffCellsWithSameProperty, function eachCell(cell) {
				$s.changeState(cell, 'dot');
			});
		}

		function findCommonalities(cells, ignoreList) {
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

				return _.isArray(ignoreList) ? _.difference(commonalities, ignoreList) : commonalities;
			} else {
				var possibleCommonalities = ['row', 'column', 'park'];
				possibleCommonalities = _.isArray(ignoreList) ? _.difference(possibleCommonalities, ignoreList) : possibleCommonalities;
				commonalities = _.clone(possibleCommonalities);

				_.forEach(cells, function eachCell(cell) {
					_.forEach(possibleCommonalities, function eachPossibleCommonality(commonality) {
						if (cell[commonality] !== cells[0][commonality]) {
							_.pull(commonalities, commonality);
						}
					});
				});

				return commonalities;
			}
		}

		function findLonerCells(cells) {
			var lonerCells = [];

			function isAlone(cell, kindOfNeighbors) {
				return !identifyNeighbors(cell, kindOfNeighbors, undefined, true).length;
			}

			_.forEach(cells, function eachCell(cell) {
				if (isAlone(cell, 'park') || isAlone(cell, 'row') || isAlone(cell, 'column')) {
					logMessage += 'Loner (' + (isAlone(cell, 'row') ? 'Row' : (isAlone(cell, 'column') ? 'Column' : 'Park')) + ')...';
					lonerCells.push(cell);	//	this cell is all alone in its row, column, or park! (must be a tree!)
				}
			});

			return lonerCells;
		}

		function findLastCell() {
			cells = $s.puzzle.getCells();
			return _.max(cells, 'timestamp');
		}

		function puzzleSolved(puzzle) {
			var treeCount = 0;

			_.forEach(puzzle.getCells(), function(cell) {
				if(cell.state === 'tree' || cell.state === 'note') {
					treeCount++;
				}
			});

			return treeCount === puzzle.rows.length;
		}

		$s.solvePuzzle = function solvePuzzle() {
			(function loopThroughParks() {
				var lastCell = findLastCell();
				var repeatLoop = false;
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
					var lonerCells = findLonerCells(park.cells);

					if (lonerCells.length) {
						_.forEach(lonerCells, function eachLonerCell(cell) {
							$s.changeState(cell, 'tree');
						});
						repeatLoop = true;
						return false;
					} else {
						commonalities = findCommonalities(park.cells, ['park']);	//	what do ALL of these cells have in common (besides 'park')?

						if (_.contains(commonalities, 'row') && !park.processedRowAlready) {	//	if in same row, dot all other cells in that row
							logMessage += 'Single-row park...';
							autoDotCommon(park.cells, 'row');
							park.processedRowAlready = true;
							repeatLoop = true;
							return false;
						} else if (_.contains(commonalities, 'column') && !park.processedColumnAlready) {	//	if in same column, dot all other cells in that column
							logMessage += 'Single-column park...';
							autoDotCommon(park.cells, 'column');
							park.processedColumnAlready = true;
							repeatLoop = true;
							return false;
						}

						if (_.contains(commonalities, 'orthogonallyAdjacent') && !park.processedDuplexAlready) {	//	only happens with duplexes
							logMessage += 'Duplex...';
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
							repeatLoop = true;
							return false;
						}
					}
				});

				if (!repeatLoop) {
					if (puzzleSolved($s.puzzle)) {
						_.forEach(_.filter($s.puzzle.getCells(), {state: 'note'}), function eachNoteCell(cell) {
							$s.changeState(cell, 'tree');
						});

						console.log('\nPuzzle is solved! Congratulations!\n (... on pressing the big red button :P)\n');
					} else {
						// logMessage += 'Guess...';
						// $s.changeState($s.puzzle.parks[0].cells[1], 'note');
						// repeatLoop = true;
					}
				}

				if (repeatLoop) {
					logPuzzleState();
					loopThroughParks();
				}
			})();
		};

		loadPuzzle($s.puzzleChose);
	}
]);






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
