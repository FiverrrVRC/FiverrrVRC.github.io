document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const repoContent = document.getElementById('repo-content');
  const clickDelay = 300;
  let clickTimeout;

  const token = 'ghp_xxxYourTokenHere'; // Replace this with your GitHub token

  fetch('https://api.github.com/user/repos?per_page=100', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  })
    .then(response => response.json())
    .then(repos => {
      repoList.innerHTML = '';

      repos.forEach(repo => {
        const repoLink = document.createElement('div');
        repoLink.className = 'repo-item';

        const repoName = document.createElement('span');
        repoName.textContent = repo.name;

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '⬇️';
        downloadBtn.title = 'Download ZIP';
        downloadBtn.className = 'download-btn';
        downloadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = `https://github.com/${repo.owner.login}/${repo.name}/archive/refs/heads/${repo.default_branch}.zip`;
          window.open(url, '_blank');
        });

        repoLink.appendChild(repoName);
        repoLink.appendChild(downloadBtn);

        repoLink.addEventListener('click', () => {
          clearTimeout(clickTimeout);
          clickTimeout = setTimeout(() => {
            loadRepoFiles(repo.name);
            repoContent.style.display = 'block';
          }, clickDelay);
        });

        repoLink.addEventListener('dblclick', () => {
          clearTimeout(clickTimeout);
          window.open(repo.html_url, '_blank');
        });

        repoList.appendChild(repoLink);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });

  function loadRepoFiles(repoName, path = '') {
    repoContent.innerHTML = '<h3>Loading files...</h3>';

    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    })
      .then(response => response.json())
      .then(files => {
        repoContent.innerHTML = '';

        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';

          const icon = document.createElement('span');
          icon.className = 'file-icon';

          if (file.type === 'dir') {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`;
          } else {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z"/></svg>`;
          }

          const fileName = document.createElement('span');
          fileName.textContent = file.name;

          fileItem.appendChild(icon);
          fileItem.appendChild(fileName);

          if (file.type === 'dir') {
            fileItem.addEventListener('click', () => loadRepoFiles(repoName, file.path));
          }

          repoContent.appendChild(fileItem);
        });
      })
      .catch(error => {
        console.error('Error fetching files:', error);
        repoContent.textContent = 'Failed to load files.';
      });
  }
});
