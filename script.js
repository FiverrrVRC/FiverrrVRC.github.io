document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');

  // Clear the existing repo list before adding new ones
  repoList.innerHTML = '';

  // SVG icons for the repositories
  const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`;
  const forkedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2v10.5a4.5 4.5 0 0 1-4.5 4.5h-1.5v3h1.5a6 6 0 0 0 6-6V2h-3zM6 7a6 6 0 0 0 0 12h1.5v-3H6a4.5 4.5 0 0 1 0-9h1.5V7H6z"/></svg>`;
  const privateRepoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19 3h-4.18l-1-1H10.18L9.18 2H5c-1.1 0-1.99.9-1.99 2L3 18c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0h4v3h-4V3zM5 18V5h14v13H5z"/></svg>`;

  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      // Ensure the list is clear before adding new items
      repoList.innerHTML = '';  // Clear existing items

      repos.forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.className = 'repo-item';

        const icon = document.createElement('span');
        icon.className = 'repo-icon';

        // Use different SVG icons based on repo type
        if (repo.private) {
          icon.innerHTML = privateRepoIcon;  // Private repo icon
        } else if (repo.fork) {
          icon.innerHTML = forkedIcon;  // Forked repo icon
        } else {
          icon.innerHTML = folderIcon;  // Default folder icon
        }

        const text = document.createElement('span');
        text.textContent = repo.name;

        repoLink.appendChild(icon);
        repoLink.appendChild(text);
        repoList.appendChild(repoLink);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });
});
