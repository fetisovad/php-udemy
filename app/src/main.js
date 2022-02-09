import React from "react";
import ReactDOM from 'react-dom';
import Editor from "./components/editor/editor";

ReactDOM.render(<Editor/>, document.getElementById('root'))

function getPageList() {
    $('h2').remove();
    $.get(
        './api',
        (data) => {
            data.forEach((file) => {
                $('body').append(`<h2>${file}</h2>`);
            });
        },
        'JSON'
    );
}

getPageList();

$('button').click(() => {
    $.post(
        './api/createNewPage.php',
        {
            name: $('input').val(),
        },
        () => {
            getPageList();
        }
    ).fail(() => {
        alert('Страница уже существует!');
    });
});
