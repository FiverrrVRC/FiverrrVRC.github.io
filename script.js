document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const repoContent = document.getElementById('repo-content');
  const backButton = document.getElementById('back-button');
  const forwardButton = document.getElementById('forward-button');

  let historyStack = [];
  let forwardStack = [];

  function updateButtons() {
    backButton.disabled = historyStack.length <= 1;
    forwardButton.disabled = forwardStack.length === 0;
  }

  function loadRepoFiles(repoName, path = '') {
    const url = `https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`;

    repoContent.innerHTML = '<h3>Loading files...</h3>';
    repoContent.classList.remove('hidden');

    fetch(url)
      .then(response => response.json())
      .then(files => {
        if (!Array.isArray(files)) {
          repoContent.innerHTML = '<p>Unable to load contents.</p>';
          return;
        }

        repoContent.innerHTML = '';
        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';

          const icon = document.createElement('span');
          icon.className = 'file-icon';
          icon.innerHTML = file.type === 'dir'
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z"/></svg>';

          const fileName = document.createElement('span');
          fileName.textContent = file.name;

          fileItem.appendChild(icon);
          fileItem.appendChild(fileName);

          if (file.type === 'dir') {
            fileItem.addEventListener('click', () => {
              historyStack.push({ repoName, path: file.path });
              forwardStack.length = 0;
              updateButtons();
              loadRepoFiles(repoName, file.path);
            });
          } else {
            fileItem.addEventListener('click', () => {
              const link = document.createElement('a');
              link.href = file.download_url;
              link.download = file.name;
              link.click();
            });
          }

          repoContent.appendChild(fileItem);
        });
      })
      .catch(error => {
        console.error('Error loading repository contents:', error);
        repoContent.innerHTML = '<p>Failed to load files.</p>';
      });
  }

  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      repoList.innerHTML = '';
      repos.forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.className = 'repo-item';
        repoItem.textContent = repo.name;

        repoItem.addEventListener('click', () => {
          historyStack.push({ repoName: repo.name, path: '' });
          forwardStack.length = 0;
          updateButtons();
          loadRepoFiles(repo.name);
        });

        repoItem.addEventListener('dblclick', () => {
          window.open(repo.html_url, '_blank');
        });

        repoList.appendChild(repoItem);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });

  backButton.addEventListener('click', () => {
    if (historyStack.length > 1) {
      const current = historyStack.pop();
      forwardStack.push(current);
      const previous = historyStack[historyStack.length - 1];
      loadRepoFiles(previous.repoName, previous.path);
      updateButtons();
    }
  });

  forwardButton.addEventListener('click', () => {
    if (forwardStack.length > 0) {
      const next = forwardStack.pop();
      historyStack.push(next);
      loadRepoFiles(next.repoName, next.path);
      updateButtons();
    }
  });

  updateButtons();
});
