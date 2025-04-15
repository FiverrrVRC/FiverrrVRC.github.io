document.addEventListener('DOMContentLoaded', () => {
const repoContent = document.getElementById('repo-content');
const fileView = document.getElementById('file-view');
const backButton = document.getElementById('back-button');
const forwardButton = document.getElementById('forward-button');

function loadRepoFiles(repoName, path = '') {
  currentPath = path;
  forwardStack = [];
  historyStack.push(path);
  updateNavButtons();

  repoContent.classList.remove('hidden');
  fileView.innerHTML = '<h3>Loading files...</h3>';

  fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
    .then(response => response.json())
    .then(files => {
      fileView.innerHTML = '';

      files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const icon = document.createElement('span');
        icon.className = 'file-icon';

        icon.innerHTML = file.type === 'dir'
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z"/></svg>`;

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        fileItem.appendChild(icon);
        fileItem.appendChild(fileName);

        if (file.type === 'dir') {
          fileItem.addEventListener('click', () => loadRepoFiles(repoName, file.path));
        } else {
          fileItem.addEventListener('click', () => downloadFile(file.download_url, file.name));
        }

        fileView.appendChild(fileItem);
      });
    })
    .catch(error => {
      console.error('Error fetching files:', error);
      fileView.innerHTML = 'Failed to load files.';
    });
}
