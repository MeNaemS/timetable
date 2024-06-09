async function send_message(error) {
    const response = await fetch(
        window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({'error': error})
        }
    );
    await response;
}