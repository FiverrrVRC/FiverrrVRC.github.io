  const repoList = document.getElementById('repo-list');
 
  const repoContent = document.getElementById('repo-content');
 

 

  // Set a timeout delay for detecting double-click
 

  const clickDelay = 300; // 300ms for detecting double-click
 

  const clickDelay = 300;
 
  let clickTimeout;
 

 

  // Fetch and display repositories from GitHub
 
  fetch('https://api.github.com/users/FiverrrVRC/repos')
 
    .then(response => response.json())
 
    .then(repos => {
 

      repoList.innerHTML = ''; // Clear the repository list
 

      repoList.innerHTML = '';
 

 
      repos.forEach(repo => {
 
        const repoLink = document.createElement('div');
 
        repoLink.className = 'repo-item';
 
        repoLink.textContent = repo.name;
 
        repoLink.dataset.repoName = repo.name;
 

 

        // Handle single click: Open repo in the explorer
 
        repoLink.addEventListener('click', () => {
 

          clearTimeout(clickTimeout); // Clear any existing double-click timeout
 

          clearTimeout(clickTimeout);
 
          clickTimeout = setTimeout(() => {
 
            loadRepoFiles(repo.name);
 

            repoContent.style.display = 'block';  // Show the content pane
 

          }, clickDelay); // Delay the action to detect single click
 

            repoContent.style.display = 'block';
 

          }, clickDelay);
 
        });
 

 

        // Handle double-click: Open repo page on GitHub
 
        repoLink.addEventListener('dblclick', () => {
 

          clearTimeout(clickTimeout); // Clear the single-click timeout
 

          window.open(repo.html_url, '_blank'); // Open the GitHub repo page
 

          clearTimeout(clickTimeout);
 

          window.open(repo.html_url, '_blank');
 
        });
 

 
        repoList.appendChild(repoLink);

@@ -41,14 +37,13 @@
 
      repoList.textContent = 'Failed to load repositories.';
 
    });
 

 

  // Load files and directories for the selected repository
 
  function loadRepoFiles(repoName, path = '') {
 
    repoContent.innerHTML = '<h3>Loading files...</h3>';
 

 
    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
 
      .then(response => response.json())
 
      .then(files => {
 

        repoContent.innerHTML = ''; // Clear loading message
 

        repoContent.innerHTML = '';
 

 
        files.forEach(file => {
 
          const fileItem = document.createElement('div');

@@ -57,7 +52,6 @@
 
          const icon = document.createElement('span');
 
          icon.className = 'file-icon';
 

 

          // Use icons based on file type (directory or file)
 
          if (file.type === 'dir') {
 
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`;
 
          } else {

@@ -70,16 +64,15 @@
 
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