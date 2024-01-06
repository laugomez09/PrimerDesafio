const realTimeForm = document.getElementById('realTimeForm');

realTimeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('realTimeTitle').value;
    const description = document.getElementById('realTimeDescription').value;
    const price = document.getElementById('realTimePrice').value;
    const category = document.getElementById('realTimeCategory').value;
    const thumbnail = document.getElementById('realTimeThumbnail').value;
    const stock = document.getElementById('realTimeStock').value;
    const code = document.getElementById('realTimeCode').value;

    const productData = {
        title,
        description,
        price,
        category,
        thumbnail,
        stock,
        code,
    };

    socket.emit('actualizarProductos', productData);
});