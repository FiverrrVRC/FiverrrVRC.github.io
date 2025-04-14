document.addEventListener('DOMContentLoaded', () => {
  const repoList = document.getElementById('repo-list');

  fetch('https://api.github.com/users/FiverrrVRC/repos')
    .then(response => response.json())
    .then(repos => {
      repos.forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.className = 'repo-item';
        repoLink.textContent = repo.name;
        repoList.appendChild(repoLink);
      });
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      repoList.textContent = 'Failed to load repositories.';
    });
});
