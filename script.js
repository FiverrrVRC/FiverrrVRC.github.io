document.addEventListener('DOMContentLoaded', () => {
  const repoList     = document.getElementById('repo-list');
  const repoContent  = document.getElementById('repo-content');
  const breadcrumbs  = document.getElementById('breadcrumbs');
  const filePreview  = document.getElementById('file-preview');
  const searchBtn    = document.getElementById('search-btn');
  const searchBar    = document.getElementById('search-bar');
  const searchInput  = document.getElementById('search-input');
  const searchStatus = document.getElementById('search-status');
  const clickDelay   = 300;
  let clickTimeout;
  let allRepos = [];

  // Toggle search bar
  searchBtn.addEventListener('click', e => {
    e.stopPropagation();
    searchBar.classList.toggle('active');
    searchInput.focus();
    updateSearchStatus();
  });

  // Hide search bar when clicking outside
  document.addEventListener('click', e => {
    if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBar.classList.remove('active');
    }
  });

  // Fetch repos
  fetch('https://api.github.com/users/FiverrrVRC/repos?per_page=100')
    .then(r => r.json())
    .then(repos => {
      allRepos = repos;
      displayRepos(repos);
      searchInput.addEventListener('input', () => {
        const term     = searchInput.value.toLowerCase();
        const filtered = allRepos.filter(r => r.name.toLowerCase().includes(term));
        displayRepos(filtered);
        updateSearchStatus();
      });
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === 'Escape') searchBar.classList.remove('active');
      });
    })
    .catch(err => {
      console.error('Error fetching repos:', err);
      repoList.textContent = 'Failed to load repositories.';
    });

  function updateSearchStatus() {
    const term = searchInput.value.trim();
    if (term) {
      searchStatus.textContent = `Searching for: "${term}"`;
      searchStatus.style.color = '#ffffff';
    } else {
      searchStatus.textContent = 'Type to search...';
      searchStatus.style.color = '#8a8a8a';
    }
  }

  function displayRepos(repos) {
    repoList.innerHTML = '';
    repos.forEach(repo => {
      const item = document.createElement('div');
      item.className = 'repo-item';

      const name = document.createElement('span');
      name.textContent = repo.name;

      const dl = document.createElement('button');
      dl.className = 'download-btn';
      dl.textContent = 'Download';
      dl.title = 'Download ZIP';
      dl.addEventListener('click', e => {
        e.stopPropagation();
        const branch = repo.default_branch || 'main';
        window.open(`https://github.com/${repo.owner.login}/${repo.name}/archive/refs/heads/${branch}.zip`, '_blank');
      });

      item.append(name, dl);

      item.addEventListener('click', () => {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          loadRepoFiles(repo.name);
        }, clickDelay);
      });

      item.addEventListener('dblclick', () => {
        clearTimeout(clickTimeout);
        window.open(repo.html_url, '_blank');
      });

      repoList.appendChild(item);
    });
  }

  function loadRepoFiles(repoName, path = '') {
    repoContent.innerHTML = '';
    filePreview.innerHTML = '';
    filePreview.classList.remove('active');  // hide preview
    breadcrumbs.innerHTML = '';

    // Breadcrumbs
    const parts = path.split('/').filter(Boolean);
    const root  = document.createElement('span');
    root.textContent = '📁 root';
    root.className = 'breadcrumb';
    root.addEventListener('click', () => loadRepoFiles(repoName));
    breadcrumbs.append(root);

    parts.forEach((p, i) => {
      breadcrumbs.append(document.createTextNode(' / '));
      const c = document.createElement('span');
      c.textContent = p;
      c.className = 'breadcrumb';
      c.addEventListener('click', () => loadRepoFiles(repoName, parts.slice(0, i+1).join('/')));
      breadcrumbs.append(c);
    });

    // List files & dirs
    fetch(`https://api.github.com/repos/FiverrrVRC/${repoName}/contents/${path}`)
      .then(r => r.json())
      .then(files => {
        files.forEach(file => {
          const fi = document.createElement('div');
          fi.className = 'file-item';

          const ic = document.createElement('span');
          ic.className = 'file-icon';
          ic.innerHTML = file.type === 'dir'
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 2v5H5v15h14V7h-5V2H10zm2 0h4v5h-4V2z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z"/></svg>`;

          const fn = document.createElement('span');
          fn.textContent = file.name;

          fi.append(ic, fn);
          repoContent.appendChild(fi);

          if (file.type === 'dir') {
            fi.addEventListener('click', () => loadRepoFiles(repoName, file.path));
          } else {
            fi.addEventListener('click', () => previewFile(repoName, file));
          }
        });
      })
      .catch(err => {
        console.error('Error loading files:', err);
        repoContent.textContent = 'Failed to load files.';
      });
  }

  function previewFile(repoName, file) {
    filePreview.innerHTML = '<p>Loading preview…</p>';
    fetch(file.download_url)
      .then(r => r.text())
      .then(text => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (['png','jpg','jpeg','gif','svg'].includes(ext)) {
          filePreview.innerHTML = `<img src="${file.download_url}" alt="${file.name}"/>`;
        } else if (ext === 'md') {
          filePreview.innerHTML = marked.parse(text);
        } else if (ext === 'json') {
          filePreview.innerHTML = `<pre>${JSON.stringify(JSON.parse(text), null, 2)}</pre>`;
        } else {
          filePreview.innerHTML = `<pre>${text}</pre>`;
        }
        filePreview.classList.add('active');  // show preview
      })
      .catch(err => {
        console.error('Preview error:', err);
        filePreview.textContent = 'Failed to load preview.';
        filePreview.classList.add('active');
      });
  }
});
