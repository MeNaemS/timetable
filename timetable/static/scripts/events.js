async function post_request(element) {
    const response = await fetch(
        '', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({'catch': false, 'id': element.id})
        }
    );
    const text = JSON.parse(await response.text());
    if (text['image_path'] === false) {
        await add_information(element);
    } else {
        await catch_image(element);
    }
}

async function catch_image(element) {
    const response = await fetch(
        '', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({'catch': true, 'id': element.id})
        }
    );
    await view_file(await response.blob());
}

async function view_file(image) {
    let image_file = document.getElementById('image');
    file = new FileReader();
    file.onloadend = function () {
        image_file.setAttribute('src', file.result);
    }
    file.readAsDataURL(image);
    document.getElementsByClassName('over-image')[0].style.visibility = 'visible';
}

async function add_information(element) {
    const name = element.id.split('_');

    let date = new Date();
    const months = {
        'Январь': 0, 'Февраль': 1, 'Март': 2,
        'Апрель': 3, 'Май': 4, 'Июнь': 5,
        'Июль': 6, 'Август': 7, 'Сентябрь': 8,
        'Октябрь': 9, 'Ноябрь': 10, 'Декабрь': 11
    }

    let div = await document.getElementsByClassName('over')[0];
    div.children[1].innerHTML = `${name[0]}<br><br>${date.getMonth() > months[name[1]] ? '<p style="color: red;">Просрочено</p>' : 'Не добавлено'}`;
    let input_box = document.getElementById('choose-file');
    input_box.addEventListener(
        'change', async () => {
            document.getElementsByTagName('label')[0].textContent = input_box.files[0].name;
            document.getElementById('filename').value = element.id;
        }
    );

    div.style.visibility = 'visible';
}

async function add_event() {
    let div = await document.getElementsByClassName('over')[0];
    let image = await document.getElementsByClassName('over-image')[0]
    document.addEventListener(
        'mouseup', async (event) => {
            if (!div.contains(event.target) && !image.contains(event.target)) {
                image.style.visibility = 'hidden';
                div.style.visibility = 'hidden';
            }
        }
    );

    let rows = await document.getElementsByClassName('read-db')[0].rows;
    let cols = [];
    for (let row = 0; row < rows.length; row++) {
        cols.push(rows[row].cells);
    }

    let date = new Date();
    const months = {
        'Январь': 0, 'Февраль': 1, 'Март': 2,
        'Апрель': 3, 'Май': 4, 'Июнь': 5,
        'Июль': 6, 'Август': 7, 'Сентябрь': 8,
        'Октябрь': 9, 'Ноябрь': 10, 'Декабрь': 11
    }

    const images = document.getElementById('dir').value.split('|');

    for (let row = 3; row < rows.length; row++) {
        let line = cols[row];
        for (let col = 5; col < line.length; col++) {
            if (line[col].innerText === '1') {
                line[col].id = `${line[line.length - 1].innerText}_${cols[2][col - 5].innerText}`;
                line[col].style.cursor = 'help';
                if (date.getMonth() > months[cols[2][col - 5].innerText] && images.indexOf(line[col].id) == -1) {
                    console.log(images.indexOf(line[col].id), images, line[col].id)
                    line[col].style.color  = 'red';
                } else if (images.indexOf(line[col].id) != -1) {
                    line[col].style.color  = 'blue';
                }
                line[col].addEventListener(
                    'click', async () => {
                        await post_request(line[col]);
                    }
                );
            }
        }
    }
}