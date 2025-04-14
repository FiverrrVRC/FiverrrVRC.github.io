document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const repoContent = document.getElementById('repo-content');
  
  // Set a timeout delay for detecting double-click
  const clickDelay = 300; // 300ms for detecting double-click
  let clickTimeout;

  // Fetch and display repositories from GitHub
  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      repoList.innerHTML = ''; // Clear the repository list

      repos.forEach(repo => {
        const repoLink = document.createElement('div');
        repoLink.className = 'repo-item';
        repoLink.textContent = repo.name;
        repoLink.dataset.repoName = repo.name;

        // Handle single click: Open repo in the explorer
        repoLink.addEventListener('click', () => {
          clearTimeout(clickTimeout); // Clear any existing double-click timeout
          clickTimeout = setTimeout(() => {
            loadRepoFiles(repo.name);
            repoContent.style.display = 'block';  // Show the content pane
          }, clickDelay); // Delay the action to detect single click
        });

        // Handle double-click: Open repo page on GitHub
        repoLink.addEventListener('dblclick', () => {
          clearTimeout(clickTimeout); // Clear the single-click timeout
          window.open(repo.html_url, '_blank'); // Open the GitHub repo page
        });

        repoList.appendChild(repoLink);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });

  // Load files and directories for the selected repository
  function loadRepoFiles(repoName, path = '') {
    repoContent.innerHTML = '<h3>Loading files...</h3>';

    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
      .then(response => response.json())
      .then(files => {
        repoContent.innerHTML = ''; // Clear loading message

        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';

          const icon = document.createElement('span');
          icon.className = 'file-icon';

          // Use icons based on file type (directory or file)
          if (file.type === 'dir') {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`;
          } else {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z"/></svg>`;
          }

          const fileName = document.createElement('span');
          fileName.textContent = file.name;

          fileItem.appendChild(icon);
          fileItem.appendChild(fileName);

          // If it's a directory, allow for folder navigation
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