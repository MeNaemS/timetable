const months = {
    'Январь': 0, 'Февраль': 1, 'Март': 2,
    'Апрель': 3, 'Май': 4, 'Июнь': 5,
    'Июль': 6, 'Август': 7, 'Сентябрь': 8,
    'Октябрь': 9, 'Ноябрь': 10, 'Декабрь': 11
};

search_form = document.getElementById('form-search')

// -----------------------Searching for a row in a table-----------------------

let names = [];

function get_coincidences(input_box_search, first) {
    let coincidences = [];
    for (let index = 0; index < names.length; index++) {
        if (names[index].textContent.includes(input_box_search)) {
            if (first) {
                return names[index];
            } else if (input_box_search.length >= 3 && coincidences.length < 5) {
                coincidences.push(names[index]);
            }
        }
    }
    return coincidences;
}

async function recolor(column) {
    setTimeout(
        () => {
            column.style.background = 'rgb(241, 241, 241)';
        },
        1000
    );
    column.style.background = 'rgba(120, 208, 120, 0.3)';
}

async function find(input_search, value = null) {
    async function windowed_element(name) {
        input_box_search.value = '';
        document.getElementById('helper').innerHTML = '';
        name.scrollIntoView({ block: "center", behavior: "smooth" });
        recolor(name);
    }

    let input_box_search = document.getElementById(input_search);
    if (input_box_search.value !== '' && value === null) {
        let name = get_coincidences(input_box_search.value, true);
        try {
            await windowed_element(name);
        } catch (error) {
            undefined;
        }
    } else if (value !== null) {
        let name = get_coincidences(value, true);
        await windowed_element(name);
    }
}

function improved_visibility(list) {
    for (let result = 0; result < list.length; result++) {
        list[result] = `<button onclick='find("search", "${list[result].textContent}")' class='button-helper'>${list[result].textContent}</button>`;
    }
    return list;
}

async function get_helper(input_id, helper) {
    helper = document.getElementById(helper);
    let input_box_search = document.getElementById(input_id);
    helper.innerHTML = improved_visibility(get_coincidences(input_box_search.value, false)).join('<br>');
}

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
    document.getElementsByClassName('over image')[0].style.visibility = 'visible';
}

async function add_information(element) {
    const name = element.id.split('_');

    let date = new Date();

    let div = document.getElementsByClassName('over form-post')[0];
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
    let div = document.getElementsByClassName('over form-post')[0];
    let image = document.getElementsByClassName('over image')[0];
    document.addEventListener(
        'click', async (event) => {
            if (!div.contains(event.target) && !image.contains(event.target)) {
                image.style.visibility = 'hidden';
                div.style.visibility = 'hidden';
            }
        }
    );

    document.getElementById('search').addEventListener(
        'keypress', async (event) => {
            event.which === 13 ? await find('search') : await get_helper('search', 'helper');
        }
    )

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
            if (!(names.includes(line[line.length - 1]))) {
                line[line.length - 1].id = line[line.length - 1].textContent;
                names.push(line[line.length - 1]);
            }
            if (line[col].innerText === '1') {
                add_column(line[col], line[line.length - 1].innerText, cols[2][col - 5].innerText, date, images);
            }
        }
    }
}