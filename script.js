<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="A list of FiverrrVRC's GitHub repositories in a clean file explorer style." />
  <meta name="author" content="FiverrrVRC" />
  <title>FiverrrVRC Repositories</title>
  <link rel="stylesheet" href="style.css" />
  <script src="script.js" defer></script>
</head>
<body>
  <header>
    <h1>FiverrrVRC's GitHub Repositories</h1>
  </header>

  <main>
    <div id="repo-list" class="file-explorer">
      <!-- Repositories will be dynamically loaded here -->
    </div>
    <div id="repo-content" class="file-explorer">
      <!-- Files of a repository will be loaded here -->
    </div>
  </main>

  <footer>
    <p>&copy; 2025 FiverrrVRC. All rights reserved.</p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const repoList = document.getElementById('repo-list');
      const repoContent = document.getElementById('repo-content');

      fetch('https://api.github.com/users/FiverrrVRC/repos')
        .then(response => response.json())
        .then(repos => {
          repos.forEach(repo => {
            const repoLink = document.createElement('a');
            repoLink.href = '#';
            repoLink.className = 'repo-item';
            repoLink.textContent = repo.name;
            repoLink.addEventListener('click', () => loadRepoFiles(repo.name));
            repoList.appendChild(repoLink);
          });
        })
        .catch(error => {
          console.error('Error fetching repositories:', error);
          repoList.textContent = 'Failed to load repositories.';
        });

      function loadRepoFiles(repoName, path = '') {
        // Clear the content display area
        repoContent.innerHTML = '<h3>Loading files...</h3>';

        // Fetch files for the repository
        fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
          .then(response => response.json())
          .then(files => {
            repoContent.innerHTML = ''; // Clear loading message

            files.forEach(file => {
              const fileItem = document.createElement('div');
              fileItem.className = 'file-item';
              
              const icon = document.createElement('span');
              icon.className = 'file-icon';

              // Folder or file icon based on type
              if (file.type === 'dir') {
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`;
              } else {
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z"/></svg>`;
              }

              const fileName = document.createElement('span');
              fileName.textContent = file.name;

              fileItem.appendChild(icon);
              fileItem.appendChild(fileName);

              // If it's a directory, make it clickable
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
  </script>
</body>
</html>
