//preloader
const preloader = document.getElementById('preloader');
window.onload = (event) => {
    (setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000));
}

// data fetching
const url = "https://api.github.com/users/john-smilga/followers?per_page=100"
const fetchFollowers = async function () {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

//display followers
const container = document.querySelector('.container');
const display = (followers) => {
    const newFollowers = followers
        .map((person) => {
            const { avatar_url, login, html_url } = person
            return `
        <div class="bg-white rounded-lg shadow-lg py-8 px-14 flex flex-col items-center">
        <img src="${avatar_url}" alt="person"
            class="rounded-full w-32 h-32 object-cover mb-3">
        <h2 class="mb-6 text-sm text-gray-500 font-bold">${login}</h2>
        <button type="button"
            class="py-1 px-3 tracking-wider text-xs bg-blue-500 uppercase text-white rounded-full border border-transparent transition-all"><a
                href="${html_url}">View Profile</a>
        </button>
    </div>
    `
        })
        .join('')
    container.innerHTML = newFollowers
}

//pagination
const paginate = (followers) => {
    const itemsPerPage = 12
    const numberOfPages = Math.ceil(followers.length / itemsPerPage)

    const newFollowers = Array.from({ length: numberOfPages }, (_, index) => {
        const start = index * itemsPerPage
        return followers.slice(start, start + itemsPerPage)
    })
    return newFollowers;
}

//display buttons
const btnContainer = document.querySelector('.btn-container')
const displayButtons = (container, pages, activeIndex) => {
    let btns = pages.map((_, pageIndex) => {
        return `<button class="page-btn w-8 h-8 bg-blue-400 border border-transparent rounded-md transition-all m-2 
        ${activeIndex === pageIndex ? 'active-btn' : 'null '}" data-index="${pageIndex}">
  ${pageIndex + 1}
  </button>`
    })
    btns.push(`<button class="next-btn bg-transparent border border-transparent font-bold capitalize tracking-wider m-2">next</button>`)
    btns.unshift(`<button class="prev-btn bg-transparent border border-transparent font-bold capitalize tracking-wider m-2">prev</button>`)
    container.innerHTML = btns.join('')
}

let index = 0
let pages = []
const setupUI = () => {
    display(pages[index])
    displayButtons(btnContainer, pages, index)
}

const init = async () => {
    const followers = await fetchFollowers()
    // title.textContent = 'pagination'
    pages = paginate(followers)
    setupUI()
}

//working of buttons
btnContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-container')) return
    if (e.target.classList.contains('page-btn')) {
        index = parseInt(e.target.dataset.index)
    }
    if (e.target.classList.contains('next-btn')) {
        index++
        if (index > pages.length - 1) {
            index = 0
        }
    }
    if (e.target.classList.contains('prev-btn')) {
        index--
        if (index < 0) {
            index = pages.length - 1
        }
    }
    setupUI()
})

window.addEventListener('load', init)