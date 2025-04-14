document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');

  // Fetch repositories from GitHub
  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      repos.forEach(repo => {
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

  // Toggle showing/hiding the contents of a repository
  function toggleRepoContents(repoItem) {
    const existing = repoItem.nextElementSibling;
    if (existing && existing.classList.contains('file-list')) {
      // If file list already exists, remove it
      existing.remove();
      return;
    }

    const repoName = repoItem.dataset.repo;

    // Fetch the contents of the repository
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
            // If it's a directory, add click listener to show contents inside the folder
            fileItem.addEventListener('click', (e) => {
              e.stopPropagation();
              toggleFolderContents(fileItem, repoName, file.path);
            });
          }

          fileList.appendChild(fileItem);
        });

        // Insert the file list directly below the clicked repository
        repoItem.insertAdjacentElement('afterend', fileList);
      })
      .catch(error => {
        console.error('Error fetching repository contents:', error);
      });
  }

  // Toggle showing/hiding folder contents (recursive for nested folders)
  function toggleFolderContents(fileItem, repoName, path) {
    const existing = fileItem.nextElementSibling;
    if (existing && existing.classList.contains('file-list')) {
      existing.remove();
      return;
    }

    // Fetch the contents of the folder
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
              toggleFolderContents(nestedItem, repoName, file.path);
            });
          }

          nestedList.appendChild(nestedItem);
        });

        // Insert the nested folder list below the folder item
        fileItem.insertAdjacentElement('afterend', nestedList);
      })
      .catch(error => {
        console.error('Error fetching folder contents:', error);
      });
  }
});
