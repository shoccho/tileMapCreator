document.addEventListener('DOMContentLoaded', () => {

	const dropZone = document.getElementById('drop-zone');
	const imageList = document.getElementById('image-list');
	const gridContainer = document.getElementById('grid-container');

	loadImagesFromLocalStorage();
	loadSelectedImageFromLocalStorage();

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

		console.log('Files dropped:', event.dataTransfer.files);

		const files = event.dataTransfer.files;

		if (files.length === 0) {
			console.log('No files found in dataTransfer.');
			return;
		}

		for (const file of files) {
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const img = document.createElement('img');
					img.src = e.target.result;
					img.draggable = false;

					img.addEventListener('click', () => {
						localStorage.setItem('selectedImage', img.src);
						loadSelectedImageFromLocalStorage(); // Update UI to reflect the selected image
					});

					const input = document.createElement('input');
					input.type = 'text';
					input.placeholder = 'Value';

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
				reader.readAsDataURL(file);
			} else {
				alert('Please drop image files only.');
			}
		}
	});

	gridContainer.addEventListener('click', (event) => {

		if (event.target.classList.contains('cell')) {
			const selectedImage = localStorage.getItem('selectedImage');
			if (selectedImage) {
				event.target.style.backgroundImage = `url(${selectedImage})`;
				event.target.style.backgroundSize = 'cover'; // Ensure the image covers the cell
			}
		}
	});

	document.getElementById('resize').addEventListener('click', () => {
		const rows = parseInt(document.getElementById('grid-x').value, 10);
		const cols = parseInt(document.getElementById('grid-y').value, 10);
		const tileSize = parseInt(document.getElementById('tile-size').value, 10);

		if (isNaN(rows) || isNaN(cols) || isNaN(tileSize)) {
			alert('Please enter valid numbers for grid dimensions and tile size.');
			return;
		}
		generateGrid(rows, cols, tileSize);
	});

	function generateGrid(rows, cols, tileSize) {
		let table = `<div style="width:${tileSize * cols}px height:${tileSize * rows}px" class="table">`;
		for (let r = 0; r < rows; r++) {
			table += '<div class="row">';
			for (let c = 0; c < cols; c++) {
				table += `<div class="cell" style="background:red; width:${tileSize}px; height:${tileSize}px;"></div>`;
			}
			table += '</div>';
		}
		table += '</div>';

		gridContainer.innerHTML = table;
	}

	function saveImagesToLocalStorage() {
		const images = [];
		document.querySelectorAll('.image-item img').forEach(img => {
			images.push(img.src);
		});
		localStorage.setItem('images', JSON.stringify(images));
	}

	function loadImagesFromLocalStorage() {
		const images = JSON.parse(localStorage.getItem('images') || '[]');
		images.forEach(src => {
			const img = document.createElement('img');
			img.src = src;
			img.draggable = false;

			img.addEventListener('click', () => {
				localStorage.setItem('selectedImage', img.src);
				loadSelectedImageFromLocalStorage(); // Update UI to reflect the selected image
			});

			const input = document.createElement('input');
			input.type = 'text';
			input.placeholder = 'Value';

			const clearButton = document.createElement('button');
			clearButton.textContent = 'x';
			clearButton.classList.add('clear-button');
			clearButton.addEventListener('click', () => {
				img.parentElement.remove();
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
		});
	}

	function loadSelectedImageFromLocalStorage() {
		const selectedImage = localStorage.getItem('selectedImage');
		document.querySelectorAll('.image-item img').forEach(img => {
			img.style.border = img.src === selectedImage ? '3px solid blue' : '';
		});
	}
});
