function ImageInfo(filename, author, license) {
    this.filename = filename;
    this.author = author;
    this.license = license;
}

async function loadImage(image) {
	let temp;
	const promise = new Promise((resolve) => {
		temp = new Image();
		temp.src = "assets/"+image.filename;
		temp.onload = resolve;
	});

    let row = document.createElement("tr");
    let name = document.createElement("td");
    name.innerHTML = image.filename;
    let author = document.createElement("td");
    author.innerHTML = image.author;
    let license = document.createElement("td");
    license.innerHTML = image.license;

    row.appendChild(name);
    row.appendChild(author);
    row.appendChild(license);
    document.getElementById("sources").appendChild(row);

    await promise;
	return temp;
}