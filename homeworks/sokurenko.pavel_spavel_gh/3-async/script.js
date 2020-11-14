const delay = 1000 * 0.3;
const lockNode = document.querySelector('[data-lock]');
const templatePostNode = document.querySelector('[data-post="template"]');
const filterInputNode = document.querySelector('[data-filter-input]');
const sortSelectNode = document.querySelector('[data-sort-select]');
const postsURL = 'https://jsonplaceholder.typicode.com/posts';
const posts = [];
// const articlePostNode = document.querySelector('[data-post="article"]');
// const titlePostNode = document.querySelector('[data-post="title"]');
// const bodyPostNode = document.querySelector('[data-post="body"]');

function lock(action) {
    if (action === 'lock') lockNode.classList.replace('lock-off', 'lock-on');
    else if (action === 'unlock') lockNode.classList.replace('lock-on', 'lock-off');
    else console.log('error -> function lock(action)');
}

function createPost(title, body) {
    const clone = templatePostNode.content.cloneNode(true);
    clone.querySelector('[data-post="title"]').textContent = title;
    clone.querySelector('[data-post="body"]').textContent = body;
    templatePostNode.parentNode.appendChild(clone);
}

function renderPosts(somePosts) {
    if ('content' in document.createElement('template')) {
        let incoming = false;
        if (typeof somePosts !== 'undefined' && somePosts.length >= 0) incoming = true;
        document.querySelectorAll('[data-post="article"]').forEach((post) => post.remove());
        (incoming ? somePosts : posts).forEach((post) => createPost(`${post.id} - ${post.title}`, post.body));
    } else alert('Error! This browser does not support <template>');
}

async function getDataJSON(url) {
    lock('lock');

    const promise = new Promise((resolve) => {
        setTimeout(() => resolve('готово!'), delay);
    });
    await promise;

    const response = await fetch(url);
    const dataJSON = await response.json();
    posts.push(...dataJSON);

    renderPosts();

    lock('unlock');
}

getDataJSON(postsURL);

// filtering the output
filterInputNode.addEventListener('input', (event) => {
    lock('lock');
    const filterValue = event.target.value.toLowerCase().trim();
    if (filterValue.length) {
        renderPosts(
            posts.filter((post) => {
                const titleString = post.title.toLowerCase().trim();
                return titleString.match(filterValue);
            }), // <- зачем тут ESLint просит ставить запятую? \_ о_О) _/
        );
    }
    lock('unlock');
});

// sorting the output
sortSelectNode.addEventListener('change', (event) => {
    lock('lock');
    let sorted = false;
    switch (event.target.value) {
        case 'az':
            posts.sort((a, b) => (a.title > b.title ? 1 : -1));
            sorted = true;
            break;
        case 'za':
            posts.sort((a, b) => (a.title < b.title ? 1 : -1));
            sorted = true;
            break;
        case 'default':
            posts.sort((a, b) => (a.id > b.id ? 1 : -1));
            sorted = true;
            break;
        default:
            console.log('error -> switch (event.target.value)');
            break;
    }
    if (sorted) renderPosts();
    lock('unlock');
});
