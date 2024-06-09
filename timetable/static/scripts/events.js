const months = {
    'Январь': 0, 'Февраль': 1, 'Март': 2,
    'Апрель': 3, 'Май': 4, 'Июнь': 5,
    'Июль': 6, 'Август': 7, 'Сентябрь': 8,
    'Октябрь': 9, 'Ноябрь': 10, 'Декабрь': 11
};

// ------------------------Sending and reading requests------------------------

async function send_request(fetch_body) {
    const response = await fetch(
        '', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: fetch_body
        }
    );
    return response;
}

async function post_request(element) {
    const response = await send_request(
        fetch_body = JSON.stringify({'catch': false, 'id': element.id})
    );
    JSON.parse(await response.text())['image_path'] === false ?
        await add_information(element) : await view_file(element);
}

async function view_file(element) {
    const response = await send_request(
        fetch_body = JSON.stringify({'catch': true, 'id': element.id})
    );
    let image_file = document.getElementById('image');
    let file = new FileReader();
    file.onloadend = async () => {
        image_file.setAttribute('src', file.result);
    }
    file.readAsDataURL(await response.blob());
    document.getElementsByClassName('over-image')[0].style.visibility = 'visible';
}

async function add_information(element) {
    const name = element.id.split('_');

    let date = new Date();

    let div = document.getElementsByClassName('over')[0];
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

// -----------------------Adding event to table columns------------------------

async function add_column(column, name, month, date, images) {
    column.id = `${name}_${month}`;
    column.style.cursor = 'help';
    if (date > months[month] && images.indexOf(column.id) == -1) {
        column.style.color  = 'red';
    } else if (images.indexOf(column.id) != -1) {
        column.style.color  = 'blue';
    }
    column.addEventListener(
        'click', async () => {
            await post_request(column);
        }
    );
}

async function add_event() {
    let div = document.getElementsByClassName('over')[0];
    let image = document.getElementsByClassName('over-image')[0];
    document.addEventListener(
        'click', async (event) => {
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

    let date = new Date().getMonth();

    const images = document.getElementById('dir').value.split('|');

    for (let row = 3; row < rows.length; row++) {
        let line = cols[row];
        for (let col = 5; col < line.length; col++) {
            if (line[col].innerText === '1') {
                add_column(line[col], line[line.length - 1].innerText, cols[2][col - 5].innerText, date, images);
            }
        }
    }
}