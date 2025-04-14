document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');
  const repoContent = document.getElementById('repo-content');

  // Initially hide the explorer pane
  repoContent.style.display = 'none';

  // Fetch and display repositories from GitHub
  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      // Ensure repoList is cleared before adding repositories
      repoList.innerHTML = ''; // Clear the repository list

      repos.forEach(repo => {
        const repoLink = document.createElement('div');
        repoLink.className = 'repo-item';

        // Create the repository name element
        const repoName = document.createElement('span');
        repoName.textContent = repo.name;

        // Add event listener for single click (opens repo on GitHub)
        repoLink.addEventListener('click', () => {
          window.open(repo.html_url, '_blank'); // Opens GitHub repo page
        });

        // Add event listener for right-click (opens repo in the explorer pane)
        repoLink.addEventListener('contextmenu', (event) => {
          event.preventDefault(); // Prevent the default right-click menu
          loadRepoFiles(repo.name);
          repoContent.style.display = 'block'; // Show the file explorer pane
        });

        // Append the repo name to the repo item
        repoLink.appendChild(repoName);

        repoList.appendChild(repoLink);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });

  // Load files and directories for the selected repository
  function loadRepoFiles(repoName, path = '') {
    // Clear the repo content section when navigating to a new repo/folder
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
          } else {
            // If it's a file, trigger a download when clicked
            fileItem.addEventListener('click', () => downloadFile(file.download_url, file.name));
          }

          repoContent.appendChild(fileItem);
        });
      })
      .catch(error => {
        console.error('Error fetching files:', error);
        repoContent.textContent = 'Failed to load files.';
      });
  }

  // Function to download the file
  function downloadFile(fileUrl, fileName) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName; // Set the download filename
    link.click();
  }
});