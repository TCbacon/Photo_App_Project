function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity - 0.05;
            flashMessageElement.style.opacity = currentOpacity;
        }, 50);
    }, 4000);
}

let flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut(flashElement);
}

function createCard(postData) {
    return `<div id=post-${postData.id} class="card">
    <img class="card-image", src=${postData.thumbnail} alt="missing-img"/>
    <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p class="card-text">${postData.description}</p>
        <a href=/post/${postData.id} class="anchor-buttons">Post Details</a>
    </div>
</div>`;

}

function addFlashFromFrontEnd(message, status) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', `alert alert-${status}`);
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

function executeSearch() {
    let searchTerm = document.getElementById("search-text").value;
    if (!searchTerm) {
        location.replace("/");
        return;
    }
    let mainContent = document.getElementById("card-id");
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let newMainContentHTML = '';
            data.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            mainContent.innerHTML = newMainContentHTML;
            if (data.message) {
                addFlashFromFrontEnd(data.message, 'info');
            }
        })
        .catch((err) => {
            console.log(err);
        });

}

let searchButton = document.getElementById("search-button");
if (searchButton) {
    searchButton.onclick = executeSearch;
}

function showAndHideSearchBar() {
    if (window.location.href === "/") {
        document.getElementById('searchbar-id').style.visibility = 'visibile';
    }

    else {
        document.getElementById('searchbar-id').style.visibility = 'hidden';
    }
}

showAndHideSearchBar();



function changeAvatar(event) {

    event.preventDefault();
    fileName = document.getElementById("avatar-file-id").files;
    console.log("avatar changed");

    const _form = document.getElementById('change-avatar-id');

    let _body = new FormData(_form);
    console.log(_body);
    fetch('/users/avatar', {
        body: _body,
        method: "POST"
    }).then((response) => {
        return response.json();
    })
        .then((data) => {
            console.log(data);
            location.reload(data.redirect);
        })
        .catch((err) => {
            addFlashFromFrontEnd("pick an avatar", "danger");
            console.log(err);
        });
}

if(document.getElementById("change-avatar-id")){
    document.getElementById("change-avatar-id").addEventListener("submit", changeAvatar, true);
}
