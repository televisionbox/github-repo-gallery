const overview = document.querySelector(".overview");
const username = "televisionbox";
const repoList = document.querySelector(".repo-list");
const repos = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const backToRepos = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");


const getProfile = async function(){
    const response = await fetch(`https://api.github.com/users/${username}`);
    const profile = await response.json();
    console.log(profile);
    displayUserInfo(profile);
}

getProfile();

const displayUserInfo = function(profile){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `<figure>
            <img alt="user avatar" src=${profile.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${profile.name}</p>
            <p><strong>Bio:</strong> ${profile.bio}</p>
            <p><strong>Location:</strong> ${profile.location}</p>
            <p><strong>Number of public repos:</strong> ${profile.public_repos}</p>
        </div>`;
    overview.append(div);
};

const fetchRepos = async function(){
    const repos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoResponse = await repos.json();
    displayRepos(repoResponse);
};

fetchRepos();

const displayRepos = function(repos){
    for(const repo of repos){
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(li);
    }
    filterInput.classList.remove("hide");
};

repoList.addEventListener("click", function(e){
    if(e.target.matches("h3")){
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

const getRepoInfo = async function(repoName){
    const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    const languages = [];
    for(const language in languageData){
        languages.push(language);
    }
    console.log(languages);
    displaySpecificRepo(repoInfo, languages);
}

const displaySpecificRepo = function(repoInfo, languages){
    repoData.innerHTML = "";
    const div = document.createElement("div");
    div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
    repoData.append(div);
    repoData.classList.remove("hide");
    repos.classList.add("hide");
    backToRepos.classList.remove("hide");
}

backToRepos.addEventListener("click", function(){
    repos.classList.remove("hide");
    repoData.classList.add("hide");
    backToRepos.classList.add("hide");

});

filterInput.addEventListener("input", function(e){
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const lowerSearchText = searchText.toLowerCase();
    for(const repo of repos){
        const lowerRepo = repo.innerText.toLowerCase();
        if(!lowerRepo.includes(lowerSearchText)){
            repo.classList.add("hide");
        }else{
            repo.classList.remove("hide");
        }
    }
});
