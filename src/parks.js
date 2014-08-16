var app = angular.module('ParksApp', []);

app.controller('ParksController', [
	'$scope',
	function ParksController($scope) {
		function Cell(color, row, column, state, timestamp) {
			this.color = color;
			this.row = row;
			this.column = column;
			this.state = state || 'blank';
			this.timestamp = timestamp || new Date().getTime();

			return this;
		}

		function Row(cellsArray) {
			this.cells = cellsArray || [];

			return this;
		}

		function Column(cellsArray) {
			this.cells = cellsArray || [];

			return this;
		}

		function Park(cellsArray) {
			this.cells = cellsArray || [];

			this.getColor = function getColor() {
				return this.cells.length ? this.cells[0].color : undefined;	//	any cell in this park will have the same color
			};

			return this;
		}

		function Puzzle(id, cellsArray) {
			this.id = id;
			this.cells = cellsArray || [];
			this.rows = [];

			this.getCells = function getCells(stateOnly) {
				if (stateOnly) {
					if (_.isArray(stateOnly)) {	//	array of states (e.g. ['tree', 'note'])
						return _.filter(this.cells, function filterToOnlyThisState(cell) {
							return _.contains(stateOnly, cell.state);
						});
					}

					return _.filter(this.cells, {state: stateOnly});	//	assume it's a string (e.g. 'blank')
				}
				return this.cells;
			};

			this.getRows = function getRows() {
				if (this.rows.length) {
					return this.rows;
				}
				var rows = this.rows;

				_.forEach(this.cells, function eachCell(cell) {
					if (!rows[cell.row]) {
						rows[cell.row] = new Row();
					}

					rows[cell.row].cells.push(cell);
				});
				return rows;
			};

			this.getColumns = function getColumns() {
				var columns = [];

				_.forEach(this.cells, function eachCell(cell) {
					if (!columns[cell.column]) {
						columns[cell.column] = new Column();
					}

					columns[cell.column].cells.push(cell);
				});
				return columns;
			};

			this.getParks = function getParks(onlyBlanks, includeSolvedParks, sortFunction) {
				var parks = [];

				_.forEach(this.cells, function eachCell(cell) {
					var thisColorPark = _.find(parks, function matchColor(park) {
						return park.getColor() === cell.color;
					});
					if (!thisColorPark) {
						parks.push(new Park([cell]));
					} else {
						_.find(parks, function matchColor(park) {
							return park.getColor() === cell.color;
						}).cells.push(cell);	//	find the matching park and put the cell into it
					}
				});

				if (onlyBlanks) {
					_.forEach(parks, function eachPark(park) {
						park.cells = _.filter(park.cells, function filterOutNonBlanks(cell) {
							return cell.state === 'blank';
						});
					});
				}

				if (!includeSolvedParks) {
					parks = _.filter(parks, function eachPark(park) {
						return park.cells.length;
					});
				}

				if (!_.isFunction(sortFunction)) {
					sortFunction = function sortByNumberOfCells(park) {
						return park.cells.length;	//	sort parks in order of the number of cells of each color (smallest parks first);
					};
				}

				return _.sortBy(parks, sortFunction);
			};

			return this;
		}

		function logPuzzleState() {
			var icons = {
				tree: '¶',
				dot: '•',
				note: '¥'
			};

			_.forEach($s.puzzle.getRows(), function eachRow(row) {
				logMessage += '\n';	//	logMessage is set outside
				_.forEach(row.cells, function eachCell(cell) {
					logMessage += icons[cell.state] ? icons[cell.state] : cell.color.slice(-1);
				});
			});

			console.log(logMessage);
			steps++;
			logMessage = '';	//	reset logMessage
		}

		var $s = $scope;
		var logMessage;
		var nrpLog;
		var steps;

		function loadPuzzle(newPuzzle) {
			$s.puzzle = new Puzzle(newPuzzle.id);
			var gridSize = newPuzzle.puzzleColors.length;
			steps = 0;
			nrpLog = [];	//	Non-Repeatable Processes Log (avoid infinite loops)
			logMessage = '';

			//	Fill puzzle with cells and those cells' colors
			for (var i = 0; i < gridSize; i++) {
				for (var j = 0; j < gridSize; j++) {
					$s.puzzle.cells.push(new Cell('color' + newPuzzle.puzzleColors[i][j], i, j));
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
			}
		];
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
				var time = new Date().getTime();
				cell.timestamp = time;

				switch(state) {
				case 'note':
					while(time === new Date().getTime()) {} // wait up to one millisecond, then
						/* fall through */
				case 'tree':
					autoDotNeighbors(cell, 'all');
					break;
				}
			} else if (_.contains($s.cellStates, $s.selectedAction)) {	//	human only
				cell.state = $s.selectedAction;
			} else {	//	the rotate option is on (human only)
				cell.state = (cell.state === 'dot' ? 'tree' : (cell.state === 'tree' ? 'blank' : 'dot'));
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
				neighbors = _.filter(neighbors, {state: 'blank'});
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
			var allBlankCells = $s.puzzle.getCells('blank');

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

		function puzzleSolved() {
			return $s.puzzle.getCells(['tree', 'note']).length === Math.sqrt($s.puzzle.cells.length);
		}

		function sanityCheck() {
			function allSameState(cellCollections, stateToCheckFor) {
				var allSame = true;
				_.forEach(cellCollections, function eachCollection(cellCollection) {
					allSame = _.every(cellCollection.cells, {state: stateToCheckFor});
					if(allSame) {
						return false;
					}
				});
				return allSame;
			}

			return !(allSameState($s.puzzle.getParks(), 'dot') || allSameState($s.puzzle.getRows(), 'dot') || allSameState($s.puzzle.getColumns(), 'dot'));
		}

		$s.solvePuzzle = function solvePuzzle() {
			var startTime = new Date().getTime();
			(function loopThroughParks() {
				var repeatLoop = false;
				_.forEach($s.puzzle.getParks(true), function eachPark(park) {
					var commonalities;
					var lonerCells = findLonerCells(park.cells);

					if (lonerCells.length) {
						$s.changeState(lonerCells[0], 'tree');
						repeatLoop = true;
						return false;
					} else {
						commonalities = findCommonalities(park.cells, ['park']);	//	what do ALL of these cells have in common (besides 'park')?

						if (_.contains(commonalities, 'row') && !_.contains(nrpLog, 'autoDotRow' + park.getColor())) {	//	if in same row, dot all other cells in that row
							logMessage += 'Single-row park...';
							autoDotCommon(park.cells, 'row');
							nrpLog.push('autoDotRow' + park.getColor());
							repeatLoop = true;
							return false;
						} else if (_.contains(commonalities, 'column') && !_.contains(nrpLog, 'autoDotColumn' + park.getColor())) {	//	if in same column, dot all other cells in that column
							logMessage += 'Single-column park...';
							autoDotCommon(park.cells, 'column');
							nrpLog.push('autoDotColumn' + park.getColor());
							repeatLoop = true;
							return false;
						}

						if (_.contains(commonalities, 'orthogonallyAdjacent') && !_.contains(nrpLog, 'duplex' + park.getColor())) {	//	only happens with duplexes
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

							nrpLog.push('duplex' + park.getColor());
							repeatLoop = true;
							return false;
						}
					}
				});

				if (!repeatLoop) {
					if (puzzleSolved()) {
						_.forEach(_.filter($s.puzzle.getCells(), {state: 'note'}), function eachNoteCell(cell) {
							$s.changeState(cell, 'tree');
						});
						console.log('\nPuzzle is solved! Congratulations!\n (... on pressing the big red button :P)\n');
						console.log('Total time taken: ' + ((new Date().getTime() - startTime) / 1000) + ' seconds');
						console.log('Total steps taken: ' + steps);
					} else {
						if (sanityCheck()) {
							logMessage += 'Guess...';
							$s.changeState($s.puzzle.getParks(true)[0].cells[0], 'note');
							repeatLoop = true;
						} else {
							logMessage += 'Pull the latest note...';
							//	puzzle is in error, our last note is wrong.  Let's fix it.
							var latestNote = _.max($s.puzzle.getCells('note'), 'timestamp');
							var cellsAfterLastNote = _.filter($s.puzzle.getCells(), function cellFilter(cell) {
								return cell.timestamp > latestNote.timestamp;
							});
							_.forEach(cellsAfterLastNote, function eachCell(cell) {
								$s.changeState(cell, 'blank');
							});
							$s.changeState(latestNote, 'dot');
							repeatLoop = true;
						}
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
