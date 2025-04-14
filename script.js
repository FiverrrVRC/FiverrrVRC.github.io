document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');

  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      const repoNames = new Set(); // Prevent duplicates
      repos.forEach(repo => {
        if (repoNames.has(repo.name)) return;
        repoNames.add(repo.name);

        const repoItem = document.createElement('div');
        repoItem.className = 'repo-item';
        repoItem.textContent = repo.name;
        repoItem.dataset.repo = repo.name;
        repoItem.addEventListener('click', () => toggleRepoContents(repoItem));
        repoList.appendChild(repoItem);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });

  function toggleRepoContents(repoItem) {
    const existing = repoItem.nextElementSibling;
    if (existing && existing.classList.contains('file-list')) {
      existing.remove();
      return;
    }

    const repoName = repoItem.dataset.repo;

    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents`)
      .then(response => response.json())
      .then(files => {
        const fileList = document.createElement('div');
        fileList.className = 'file-list';

        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';
          fileItem.textContent = (file.type === 'dir' ? '📁 ' : '📄 ') + file.name;
          if (file.type === 'dir') {
            fileItem.addEventListener('click', (e) => {
              e.stopPropagation();
              toggleFolderContents(fileItem, repoName, file.path);
            });
          }
          fileList.appendChild(fileItem);
        });

        repoItem.insertAdjacentElement('afterend', fileList);
      });
  }

  function toggleFolderContents(fileItem, repoName, path) {
    const existing = fileItem.nextElementSibling;
    if (existing && existing.classList.contains('file-list')) {
      existing.remove();
      return;
    }

    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
      .then(response => response.json())
      .then(files => {
        const nestedList = document.createElement('div');
        nestedList.className = 'file-list';

        files.forEach(file => {
          const nestedItem = document.createElement('div');
          nestedItem.className = 'file-item';
          nestedItem.textContent = (file.type === 'dir' ? '📁 ' : '📄 ') + file.name;
          if (file.type === 'dir') {
            nestedItem.addEventListener('click', (e) => {
              e.stopPropagation();
              toggleFolderContents(nestedItem, repoName, file.path);
            });
          }
          nestedList.appendChild(nestedItem);
        });

        fileItem.insertAdjacentElement('afterend', nestedList);
      });
  }
});
