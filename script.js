document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const repoContent = document.getElementById('repo-content');
  const fileList = document.getElementById('file-list');
  const backButton = document.getElementById('back-button');
  const forwardButton = document.getElementById('forward-button');

  let currentRepo = null;
  let historyStack = [];
  let forwardStack = [];

  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      repoList.innerHTML = '';
      repos.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'repo-item';
        item.textContent = repo.name;

        let clickTimer = null;

        item.addEventListener('click', () => {
          if (clickTimer === null) {
            clickTimer = setTimeout(() => {
              clickTimer = null;
              openRepoExplorer(repo.name);
            }, 250);
          } else {
            clearTimeout(clickTimer);
            clickTimer = null;
            window.open(repo.html_url, '_blank');
          }
        });

        repoList.appendChild(item);
      });
    });

  function openRepoExplorer(repoName, path = '') {
    currentRepo = repoName;
    if (path) historyStack.push(path);
    forwardStack = [];

    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
      .then(response => response.json())
      .then(files => {
        repoContent.classList.remove('hidden');
        fileList.innerHTML = '';

        files.forEach(file => {
          const item = document.createElement('div');
          item.className = 'file-item';

          const icon = document.createElement('span');
          icon.className = 'file-icon';
          icon.textContent = file.type === 'dir' ? '📁' : '📄';

          const name = document.createElement('span');
          name.textContent = file.name;

          item.appendChild(icon);
          item.appendChild(name);

          if (file.type === 'dir') {
