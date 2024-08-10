document.addEventListener('DOMContentLoaded', () => {
	let table = [];

	const dropZone = document.getElementById('drop-zone');
	const imageList = document.getElementById('image-list');
	const gridContainer = document.getElementById('grid-container');
	const gridConfigContainer = document.getElementById("grid_config");
	let isDragging = false;

	const makeMatrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0));

	const makeEmptyGrid = () => {
		const rows = parseInt(document.getElementById('grid-y').value, 10);
		const cols = parseInt(document.getElementById('grid-x').value, 10);
		const tileSize = parseInt(document.getElementById('tile-size').value, 10);

		if (isNaN(rows) || isNaN(cols) || isNaN(tileSize)) {
			alert('Please enter valid numbers for grid dimensions and tile size.');
			return;
		}
		table = makeMatrix(rows, cols);

		generateGrid(rows, cols, tileSize);
	};

	const fillCellWithSelectedImage = (target) => {
		const { src: selectedImage, value } = JSON.parse(localStorage.getItem('selectedImage'));
		if (selectedImage) {
			const id = target.id;
			const ids = id.split('-')
			const row = ids[0];
			const col = ids[1];
			table[row][col] = value;
			target.style.backgroundImage = `url(${selectedImage})`;
			target.style.backgroundSize = 'cover';
		}
	};

	const generateGrid = (rows, cols, tileSize) => {
		let table = `<div style="width:${tileSize * cols}px height:${tileSize * rows}px" class="table">`;
		for (let r = 0; r < rows; r++) {
			table += '<div class="row">';
			for (let c = 0; c < cols; c++) {
				table += `<div class="cell" id="${r}-${c}" style="width:${tileSize}px; height:${tileSize}px;"></div>`;
			}
			table += '</div>';
		}
		table += '</div>';

		gridContainer.innerHTML = table;
	}

	const saveImagesToLocalStorage = () => {
		const images = [];
		document.querySelectorAll('.image-item').forEach(imgItem => {
			images.push({ src: imgItem.firstChild.src, value: imgItem.lastChild.firstChild.value });
		});
		localStorage.setItem('images', JSON.stringify(images));
	};

	const loadImagesFromLocalStorage = () => {
		const images = JSON.parse(localStorage.getItem('images') || '[]');
		generateImageGrid(images);
	};

	const loadSelectedImageFromLocalStorage = () => {
		const selectedImage = JSON.parse(localStorage.getItem('selectedImage'));
		document.querySelectorAll('.image-item img').forEach(img => {
			img.style.border = img.src === selectedImage.src ? '3px solid blue' : '';
		});
	};

	const createImageElement = (src, value) => {
		const img = document.createElement('img');
		img.src = src;
		img.draggable = false;

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = 'Value';
		input.value = value;
		input.onchange = saveImagesToLocalStorage
		img.addEventListener('click', () => {
			localStorage.setItem('selectedImage', JSON.stringify({ src: img.src, value: input.value }));
			loadSelectedImageFromLocalStorage();
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

	const generateImageGrid = (images) => {
		images.forEach(obj => {
			createImageElement(obj.src, obj.value);
		});
	}

	loadImagesFromLocalStorage();
	loadSelectedImageFromLocalStorage();
	makeEmptyGrid();

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
			makeEmptyGrid();
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

	gridContainer.addEventListener('mousemove', (event) => {
		if (event.target.classList.contains('cell')) {
			if (isDragging) fillCellWithSelectedImage(event.target);
		}
	});

	document.getElementById('export').addEventListener('click', () => {
		let element = document.createElement('a');
		let text = "";
		table.forEach(row => {
			row.forEach(cell => text += `${cell} `);
			text += '\n';
		})
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', "map.txt");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	});

});
