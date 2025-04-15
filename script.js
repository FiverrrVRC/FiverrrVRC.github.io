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
    const state = { repoName, path };
    historyStack.push(state);
    forwardStack = [];
    updateButtons();

    repoContent.style.display = 'block';
    repoContent.innerHTML = '<h3>Loading files...</h3>';

    fetch(`https://api.github.com/repos/fiverrrvrc/${repoName}/contents/${path}`)
      .then(response => response.json())
      .then(files => {
        repoContent.innerHTML = '';
        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';

          const icon = document.createElement('span');
          icon.className = 'file-icon';
          icon.innerHTML = file.type === 'dir'
            ? '📁 '
            : '📄 ';

          const fileName = document.createElement('span');
          fileName.textContent = file.name;

          fileItem.appendChild(icon);
          fileItem.appendChild(fileName);

          if (file.type === 'dir') {
            fileItem.addEventListener('click', () => {
              loadRepoFiles(repoName, file.path);
            });
          } else {
            fileItem.addEventListener('click', () => {
              window.open(file.download_url, '_blank');
            });
          }

          repoContent.appendChild(fileItem);
        });
      })
      .catch(error => {
        console.error('Error loading files:', error);
        repoContent.textContent = 'Failed to load files.';
      });
  }

  function navigateBack() {
    if (historyStack.length > 1) {
      forwardStack.push(historyStack.pop());
      const prev = historyStack[historyStack.length - 1];
      loadRepoFiles(prev.repoName, prev.path);
    }
  }

  function navigateForward() {
    if (forwardStack.length > 0) {
      const next = forwardStack.pop();
      historyStack.push(next);
      loadRepoFiles(next.repoName, next.path);
    }
  }

  backButton.addEventListener('click', navigateBack);
  forwardButton.addEventListener('click', navigateForward);

  fetch('https://api.github.com/users/fiverrrvrc/repos')
    .then(response => response.json())
    .then(repos => {
      repoList.innerHTML = '';

      repos.forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.className = 'repo-item';
        repoItem.textContent = repo.name;

        let clickTimer = null;

        repoItem.addEventListener('click', () => {
          clearTimeout(clickTimer);
          clickTimer = setTimeout(() => {
            loadRepoFiles(repo.name);
          }, 250);
        });

        repoItem.addEventListener('dblclick', () => {
          clearTimeout(clickTimer);
          window.open(repo.html_url, '_blank');
        });

        repoList.appendChild(repoItem);
      });
    })
    .catch(error => {
      console.error('Error loading repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });
});
