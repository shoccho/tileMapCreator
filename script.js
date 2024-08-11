document.addEventListener('DOMContentLoaded', () => {
	let mapData = [];

	const dropZone = document.getElementById('drop-zone');
	const imageList = document.getElementById('image-list');
	const gridContainer = document.getElementById('grid-container');
	const gridConfigContainer = document.getElementById("grid_config");
	const gridY = document.getElementById('grid-y');
	const gridX = document.getElementById('grid-x');
	const gridScale = document.getElementById('tile-size');
	const delimeterInput = document.getElementById('delimeter');
	const fileNameInput = document.getElementById('file-name');
	const showGridInput = document.getElementById('show-grid');

	let isDragging = false;
	let moreOptionsVisible = false;

	const moreButton = document.getElementById('more-button');
	const moreOptions = document.getElementById('more-options');

	moreButton.onclick = () => {
		moreOptions.setAttribute('style', `visibility: ${!moreOptionsVisible ? 'visible' : 'collapse'}`);
		moreOptionsVisible = !moreOptionsVisible;
	}
	const dndHint = document.getElementById('dnd-hint');

	const toggleDndHint = (imageCount) => {
		if (imageCount === 0) {
			dndHint.setAttribute('class', 'visible');
		} else {
			dndHint.setAttribute('class', 'invisible');
		}
	}

	const makeMatrix = (rows, cols) => mapData = new Array(cols).fill(0).map((o, i) => new Array(rows).fill(undefined));

	const makeEmptyGrid = () => {
		const rows = parseInt(gridY.value, 10);
		const cols = parseInt(gridX.value, 10);
		const tileSize = parseInt(document.getElementById('tile-size').value, 10);

		if (isNaN(rows) || isNaN(cols) || isNaN(tileSize)) {
			alert('Please enter valid numbers for grid dimensions and tile size.');
			return;
		}
		mapData = makeMatrix(rows, cols);

		generateGrid(rows, cols, tileSize);
	};

	const loadImagesFromLocalStorage = () => {
		return JSON.parse(localStorage.getItem('images') || '[]');
	};

	const loadSelectedImageFromLocalStorage = () => {
		const data = localStorage.getItem('selectedImage');
		if (!data) return undefined;
		return JSON.parse(data);
	};

	const fillCellWithSelectedImage = (target) => {
		const { src: selectedImage, value } = loadSelectedImageFromLocalStorage() || {};
		if (selectedImage) {
			const id = target.id;
			const ids = id.split('-')
			const row = ids[0];
			const col = ids[1];
			mapData[row][col] = value;
			target.style.backgroundImage = `url(${selectedImage})`;
			target.style.backgroundSize = 'cover';
		}
		saveMap();
	};

	const getImageIfAvaliable = (row, column) => {
		const value = mapData?.[row]?.[column];
		if (value) {
			const images = loadImagesFromLocalStorage(); //todo: maybe have a hashmap when images are loaded for the grid
			return images.find(image => image.value == value)?.src;
		}
	}

	const generateGrid = () => {
		const rows = gridY.value;
		const cols = gridX.value;
		const tileSize = gridScale.value;

		if (mapData == undefined) {
			makeMatrix(rows, cols);
		} else if (mapData.length != rows || mapData?.[0].length != cols) {
			let newMapData = Array.from({ length: rows }, () => Array(cols).fill(undefined));

			for (let i = 0; i < Math.min(mapData.length, rows); i++) {
				for (let j = 0; j < Math.min(mapData?.[0].length, cols); j++) {
					newMapData[i][j] = mapData[i][j];
				}
			}
			mapData = newMapData
		}
		let mapGrid = `<div style="width:${tileSize * cols}px height:${tileSize * rows}px" class="table">`;
		for (let r = 0; r < rows; r++) {
			mapGrid += '<div class="row">';
			for (let c = 0; c < cols; c++) {
				const imageSrc = getImageIfAvaliable(r, c);
				const imageStyle = imageSrc ? `background-image: url(${imageSrc}); background-size: cover;` : '';
				mapGrid += `<div class="cell ${showGridInput.checked ? 'bordered' : ''}" id="${r}-${c}" style="width:${tileSize}px; height:${tileSize}px; ${imageStyle}"></div>`;
			}
			mapGrid += '</div>';
		}
		mapGrid += '</div>';

		gridContainer.innerHTML = mapGrid;
	}

	const saveImagesToLocalStorage = () => {
		const images = [];
		document.querySelectorAll('.image-item').forEach(imgItem => {
			images.push({ src: imgItem.firstChild.src, value: imgItem.lastChild.firstChild.value });
		});
		localStorage.setItem('images', JSON.stringify(images));
		toggleDndHint(images.length);
	};

	const setSelectedImage = () => {
		const selectedImage = loadImagesFromLocalStorage();
		document.querySelectorAll('.image-item img').forEach(img => {
			console.log(img)
			img.style.border = img.src === selectedImage.src ? '3px solid blue' : '';
		});
	}

	const createImageElement = (src, value) => {
		const img = document.createElement('img');
		img.src = src;
		img.draggable = false;

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Value';
		input.value = value ?? null;
		input.onchange = saveImagesToLocalStorage
		img.addEventListener('click', () => {
			localStorage.setItem('selectedImage', JSON.stringify({ src: img.src, value: input.value }));
			setSelectedImage();
		});
		const clearButton = document.createElement('button');
		clearButton.textContent = 'x';
		clearButton.classList.add('clear-button');
		clearButton.addEventListener('click', () => {
			imageList.removeChild(imageItem);
			saveImagesToLocalStorage();
		});

		const inputContainer = document.createElement('div');
		inputContainer.classList.add('input-container');
		inputContainer.appendChild(input);
		inputContainer.appendChild(clearButton);

		const imageItem = document.createElement('div');
		imageItem.classList.add('image-item');
		imageItem.appendChild(img);
		imageItem.appendChild(inputContainer);

		imageList.appendChild(imageItem);
		saveImagesToLocalStorage();
	};

	const generateImageGrid = () => {
		const images = loadImagesFromLocalStorage();
		images.forEach(obj => {
			createImageElement(obj.src, obj.value);
		});
		toggleDndHint(images.length);
	}

	const saveConfig = () => {
		const rows = gridY.value;
		const cols = gridX.value;
		const scale = gridScale.value;
		const delimeter = delimeterInput.value;
		const fileName = fileNameInput.value;
		const showGrid = showGridInput.checked;

		localStorage.setItem('rows', rows);
		localStorage.setItem('cols', cols);
		localStorage.setItem('scale', scale);
		localStorage.setItem('delimeter', delimeter);
		localStorage.setItem('fileName', fileName);
		localStorage.setItem('showGrid', showGrid);
	}

	const saveMap = () => {
		localStorage.setItem('mapData', JSON.stringify(mapData));
	}

	const loadConfig = () => {
		gridX.value = localStorage.getItem('cols') || 10;
		gridY.value = localStorage.getItem('rows') || 10;
		gridScale.value = localStorage.getItem('scale') || 32;
		delimeterInput.value = localStorage.getItem('delimeter') || ' ';
		fileNameInput.value = localStorage.getItem('fileName') || 'map.txt';
		showGridInput.checked = localStorage.getItem('showGrid') || true;
		
	}

	const loadMap = () => {
		const data = JSON.parse(localStorage.getItem('mapData'));
		if (!data) {
			makeEmptyGrid();
		} else {
			mapData = data;
			generateGrid();
		}
	}

	showGridInput.addEventListener('click', (event) => {
		generateGrid();
	})

	loadConfig();
	loadMap();
	generateImageGrid();
	setSelectedImage()

	dropZone.addEventListener('dragover', (event) => {
		event.preventDefault();
		dropZone.style.backgroundColor = '#e0e0e0';
	});

	dropZone.addEventListener('dragleave', () => {
		dropZone.style.backgroundColor = '';
	});

	dropZone.addEventListener('drop', (event) => {
		event.preventDefault();
		dropZone.style.backgroundColor = '';

		const files = event.dataTransfer.files;

		if (files.length === 0) {
			console.log('No files found in dataTransfer.');
			return;
		}

		for (const file of files) {
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					createImageElement(e.target.result)
				};
				reader.readAsDataURL(file);
			} else {
				alert('Please drop image files only.');
			}
		}
	});

	gridConfigContainer.addEventListener('click', (event) => {
		if (event.target.classList.contains('config')) {
			saveConfig();
			generateGrid();
		}
	});

	gridContainer.addEventListener('click', (event) => {
		if (event.target.classList.contains('cell')) {
			fillCellWithSelectedImage(event.target);
		}
	});

	gridContainer.addEventListener('mousedown', (event) => {
		isDragging = true;
	});

	gridContainer.addEventListener('mouseup', (event) => {
		isDragging = false;
	});

	gridContainer.addEventListener('mouseleave', (event) => {
		isDragging = false;
	});

	gridContainer.addEventListener('mousemove', (event) => {
		if (event.target.classList.contains('cell')) {
			if (isDragging) fillCellWithSelectedImage(event.target);
		}
	});

	document.getElementById('export').addEventListener('click', () => {
		let element = document.createElement('a');
		const delimeter = delimeterInput.value;
		const fileName = fileNameInput.value;
		let text = "";
		mapData.forEach(row => {
			row.forEach(cell => {
				const value = cell ? cell : ' '; //todo: better handle empty maps
				text += `${value}${delimeter}`
			});
			text += '\n';
		})
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', fileName);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	});

});
