document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const fileExplorer = document.getElementById('file-explorer');

  // Fetch repositories from GitHub
  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      repos.forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.className = 'repo-item';
        repoItem.textContent = repo.name;
        repoItem.dataset.repo = repo.name;
        repoItem.addEventListener('click', () => loadRepoContents(repoItem));
        repoList.appendChild(repoItem);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });

  // Load repository contents into the file explorer pane
  function loadRepoContents(repoItem) {
    const repoName = repoItem.dataset.repo;

    // Clear the file explorer before loading new contents
    fileExplorer.innerHTML = '';

    // Fetch the contents of the repository
    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents`)
      .then(response => response.json())
      .then(files => {
        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';
          fileItem.textContent = (file.type === 'dir' ? '📁 ' : '📄 ') + file.name;

          if (file.type === 'dir') {
            // If it's a directory, add click listener to show contents inside the folder
            fileItem.addEventListener('click', (e) => {
              e.stopPropagation();
              loadFolderContents(fileItem, repoName, file.path);
            });
          }

          fileExplorer.appendChild(fileItem);
        });
      })
      .catch(error => {
        console.error('Error fetching repository contents:', error);
      });
  }

  // Load folder contents (recursive for nested folders)
  function loadFolderContents(fileItem, repoName, path) {
    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
      .then(response => response.json())
      .then(files => {
        const nestedList = document.createElement('div');
        nestedList.className = 'file-list';
        nestedList.style.marginLeft = '20px'; // Indentation for nested files

        files.forEach(file => {
          const nestedItem = document.createElement('div');
          nestedItem.className = 'file-item';
          nestedItem.textContent = (file.type === 'dir' ? '📁 ' : '📄 ') + file.name;

          if (file.type === 'dir') {
            // Recursively handle nested directories
            nestedItem.addEventListener('click', (e) => {
              e.stopPropagation();
              loadFolderContents(nestedItem, repoName, file.path);
            });
          }

          nestedList.appendChild(nestedItem);
        });

        // Append nested folder contents below the folder item
        fileItem.insertAdjacentElement('afterend', nestedList);
      })
      .catch(error => {
        console.error('Error fetching folder contents:', error);
      });
  }
});
