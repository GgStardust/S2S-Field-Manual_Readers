// Reader Features: Form Auto-Save, Notes, and Reading Position

document.addEventListener('DOMContentLoaded', function() {
  // ============================================
  // FORM AUTO-SAVE
  // ============================================
  
  const form = document.getElementById('reader-feedback-form');
  if (form) {
    const formStorageKey = 's2s_feedback_form_data';
    
    // Load saved form data
    const savedData = localStorage.getItem(formStorageKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) {
            if (field.type === 'checkbox') {
              field.checked = data[key] === 'yes';
            } else {
              field.value = data[key];
            }
          }
        });
        
        // Show restore notification
        showNotification('Form progress restored', 'success');
      } catch (e) {
        console.error('Error loading form data:', e);
      }
    }
    
    // Auto-save form data as user types
    form.addEventListener('input', function(e) {
      const formData = new FormData(form);
      const data = {};
      
      // Collect all form values
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Handle checkboxes separately
      form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
          data[checkbox.name] = checkbox.value || 'yes';
        }
      });
      
      // Save to localStorage
      localStorage.setItem(formStorageKey, JSON.stringify(data));
    });
    
    // Clear saved data on successful submit
    form.addEventListener('submit', function() {
      localStorage.removeItem(formStorageKey);
      showNotification('Form submitted successfully', 'success');
    });
  }
  
  // ============================================
  // NOTE-TAKING FEATURE
  // ============================================
  
  const notesStorageKey = 's2s_reader_notes';
  let notes = {};
  
  // Load saved notes
  const savedNotes = localStorage.getItem(notesStorageKey);
  if (savedNotes) {
    try {
      notes = JSON.parse(savedNotes);
    } catch (e) {
      console.error('Error loading notes:', e);
    }
  }
  
  // Create notes UI
  const notesToggle = document.createElement('button');
  notesToggle.id = 'notes-toggle';
  notesToggle.innerHTML = '<span class="icon">□</span><span class="label">Notes</span>';
  notesToggle.className = 'notes-toggle';
  notesToggle.setAttribute('aria-label', 'Toggle notes panel');
  document.body.appendChild(notesToggle);
  
  const notesPanel = document.createElement('div');
  notesPanel.id = 'notes-panel';
  notesPanel.className = 'notes-panel';
  notesPanel.innerHTML = `
    <div class="notes-header">
      <h3>My Notes</h3>
      <button class="notes-close" aria-label="Close notes">×</button>
    </div>
    <div class="notes-content">
      <textarea id="notes-textarea" placeholder="Add your notes here... They are saved automatically as you type."></textarea>
      <div class="notes-actions">
        <button id="clear-notes" class="notes-clear">Clear All Notes</button>
        <span class="notes-saved-indicator">Saved</span>
      </div>
    </div>
  `;
  document.body.appendChild(notesPanel);
  
  const notesTextarea = document.getElementById('notes-textarea');
  const notesClose = notesPanel.querySelector('.notes-close');
  const clearNotesBtn = document.getElementById('clear-notes');
  
  // Load notes into textarea
  if (notes.text) {
    notesTextarea.value = notes.text;
  }
  
  // Auto-save notes
  let notesSaveTimeout;
  notesTextarea.addEventListener('input', function() {
    notes.text = this.value;
    
    // Debounce save
    clearTimeout(notesSaveTimeout);
    notesSaveTimeout = setTimeout(() => {
      localStorage.setItem(notesStorageKey, JSON.stringify(notes));
      const indicator = document.querySelector('.notes-saved-indicator');
      if (indicator) {
        indicator.textContent = 'Saved';
        indicator.style.opacity = '1';
        setTimeout(() => {
          indicator.style.opacity = '0.5';
        }, 1000);
      }
    }, 500);
  });
  
  // Toggle notes panel
  notesToggle.addEventListener('click', function() {
    notesPanel.classList.toggle('open');
    notesToggle.classList.toggle('active');
  });
  
  notesClose.addEventListener('click', function() {
    notesPanel.classList.remove('open');
    notesToggle.classList.remove('active');
  });
  
  // Clear notes
  clearNotesBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
      notesTextarea.value = '';
      notes.text = '';
      localStorage.removeItem(notesStorageKey);
      showNotification('Notes cleared', 'info');
    }
  });
  
  // ============================================
  // READING POSITION TRACKING
  // ============================================
  
  const positionStorageKey = 's2s_reading_position';
  let positionSaveTimeout;
  
  // Restore reading position
  const savedPosition = localStorage.getItem(positionStorageKey);
  if (savedPosition) {
    try {
      const position = JSON.parse(savedPosition);
      // Only restore if it's recent (within 7 days)
      const daysSince = (Date.now() - position.timestamp) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        setTimeout(() => {
          window.scrollTo({
            top: position.scrollY,
            behavior: 'smooth'
          });
          showNotification('Returned to your last reading position', 'info');
        }, 500);
      }
    } catch (e) {
      console.error('Error loading reading position:', e);
    }
  }
  
  // Save reading position
  window.addEventListener('scroll', function() {
    clearTimeout(positionSaveTimeout);
    positionSaveTimeout = setTimeout(() => {
      const position = {
        scrollY: window.scrollY,
        timestamp: Date.now()
      };
      localStorage.setItem(positionStorageKey, JSON.stringify(position));
    }, 1000);
  });
  
  // ============================================
  // SEARCH FUNCTIONALITY
  // ============================================
  
  const searchStorageKey = 's2s_search_history';
  let searchResults = [];
  let currentSearchIndex = -1;
  
  // Create search UI
  const searchToggle = document.createElement('button');
  searchToggle.id = 'search-toggle';
  searchToggle.innerHTML = '<span class="icon">○</span><span class="label">Search</span>';
  searchToggle.className = 'search-toggle';
  searchToggle.setAttribute('aria-label', 'Toggle search');
  document.body.appendChild(searchToggle);
  
  const searchPanel = document.createElement('div');
  searchPanel.id = 'search-panel';
  searchPanel.className = 'search-panel';
  searchPanel.innerHTML = `
    <div class="search-header">
      <h3>Search</h3>
      <button class="search-close" aria-label="Close search">×</button>
    </div>
    <div class="search-content">
      <div class="search-input-wrapper">
        <input type="text" id="search-input" placeholder="Search the manuscript..." autocomplete="off">
        <button id="search-clear" class="search-clear" style="display: none;">×</button>
      </div>
      <div id="search-results" class="search-results"></div>
      <div id="search-navigation" class="search-navigation" style="display: none;">
        <button id="search-prev" class="search-nav-btn">↑ Previous</button>
        <span id="search-count"></span>
        <button id="search-next" class="search-nav-btn">Next ↓</button>
      </div>
    </div>
  `;
  document.body.appendChild(searchPanel);
  
  const searchInput = document.getElementById('search-input');
  const searchResultsDiv = document.getElementById('search-results');
  const searchClear = document.getElementById('search-clear');
  const searchClose = searchPanel.querySelector('.search-close');
  const searchNav = document.getElementById('search-navigation');
  const searchPrev = document.getElementById('search-prev');
  const searchNext = document.getElementById('search-next');
  const searchCount = document.getElementById('search-count');
  
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    searchClear.style.display = query ? 'block' : 'none';
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        searchResultsDiv.innerHTML = '';
        searchNav.style.display = 'none';
        clearHighlights();
      }
    }, 300);
  });
  
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        if (e.shiftKey) {
          navigateSearch(-1);
        } else {
          navigateSearch(1);
        }
      }
    }
  });
  
  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchResultsDiv.innerHTML = '';
    searchNav.style.display = 'none';
    clearHighlights();
    searchInput.focus();
  });
  
  searchToggle.addEventListener('click', function() {
    searchPanel.classList.toggle('open');
    searchToggle.classList.toggle('active');
    if (searchPanel.classList.contains('open')) {
      searchInput.focus();
    }
  });
  
  searchClose.addEventListener('click', function() {
    searchPanel.classList.remove('open');
    searchToggle.classList.remove('active');
  });
  
  function performSearch(query) {
    const content = document.querySelector('.container');
    const text = content.innerText || content.textContent;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    // Find all sections with IDs
    const sections = content.querySelectorAll('section[id], h1[id], h2[id], h3[id]');
    searchResults = [];
    
    sections.forEach(section => {
      const sectionText = section.innerText || section.textContent;
      if (regex.test(sectionText)) {
        const matches = sectionText.match(regex);
        searchResults.push({
          id: section.id,
          title: section.querySelector('h1, h2, h3')?.textContent || section.id,
          element: section,
          matches: matches ? matches.length : 0
        });
      }
    });
    
    // Highlight matches
    highlightMatches(query);
    
    // Display results
    if (searchResults.length > 0) {
      displaySearchResults(query);
      currentSearchIndex = -1;
      searchNav.style.display = 'flex';
    } else {
      searchResultsDiv.innerHTML = '<p class="search-no-results">No results found</p>';
      searchNav.style.display = 'none';
    }
  }
  
  function highlightMatches(query) {
    clearHighlights();
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const walker = document.createTreeWalker(
      document.querySelector('.container'),
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.parentElement && !node.parentElement.closest('#search-panel, .notes-panel, form')) {
        textNodes.push(node);
      }
    }
    
    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      if (regex.test(text)) {
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.innerHTML = text.replace(regex, '<mark>$1</mark>');
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
  }
  
  function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(highlight => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    });
  }
  
  function displaySearchResults(query) {
    searchResultsDiv.innerHTML = searchResults.map((result, index) => `
      <div class="search-result-item" data-index="${index}" data-id="${result.id}">
        <h4>${result.title}</h4>
        <p>${result.matches} match${result.matches !== 1 ? 'es' : ''}</p>
      </div>
    `).join('');
    
    searchCount.textContent = `${currentSearchIndex + 1} of ${searchResults.length}`;
    
    // Add click handlers
    searchResultsDiv.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        navigateToSearchResult(index);
      });
    });
  }
  
  function navigateSearch(direction) {
    if (searchResults.length === 0) return;
    
    currentSearchIndex += direction;
    if (currentSearchIndex < 0) currentSearchIndex = searchResults.length - 1;
    if (currentSearchIndex >= searchResults.length) currentSearchIndex = 0;
    
    navigateToSearchResult(currentSearchIndex);
  }
  
  function navigateToSearchResult(index) {
    if (index < 0 || index >= searchResults.length) return;
    
    currentSearchIndex = index;
    const result = searchResults[index];
    const element = document.getElementById(result.id);
    
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Highlight the section briefly
      element.style.transition = 'background-color 0.3s';
      element.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
    
    searchCount.textContent = `${index + 1} of ${searchResults.length}`;
    
    // Update active result
    searchResultsDiv.querySelectorAll('.search-result-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }
  
  searchPrev.addEventListener('click', () => navigateSearch(-1));
  searchNext.addEventListener('click', () => navigateSearch(1));
  
  // Keyboard shortcut: Ctrl/Cmd + K for search
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchToggle.click();
    }
  });
  
  // ============================================
  // BOOKMARKS
  // ============================================
  
  const bookmarksStorageKey = 's2s_bookmarks';
  let bookmarks = [];
  
  // Load saved bookmarks
  const savedBookmarks = localStorage.getItem(bookmarksStorageKey);
  if (savedBookmarks) {
    try {
      bookmarks = JSON.parse(savedBookmarks);
    } catch (e) {
      console.error('Error loading bookmarks:', e);
    }
  }
  
  // Create bookmark button (appears on hover over headings)
  function addBookmarkButtons() {
    const headings = document.querySelectorAll('.container h1[id], .container h2[id], .container h3[id], .container section[id]');
    headings.forEach(heading => {
      if (!heading.querySelector('.bookmark-btn')) {
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.innerHTML = '◊';
        bookmarkBtn.setAttribute('aria-label', 'Bookmark this section');
        bookmarkBtn.style.display = 'none';
        
        const isBookmarked = bookmarks.some(b => b.id === heading.id);
        if (isBookmarked) {
          bookmarkBtn.classList.add('bookmarked');
          bookmarkBtn.innerHTML = '■';
        }
        
        bookmarkBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleBookmark(heading);
        });
        
        heading.style.position = 'relative';
        heading.appendChild(bookmarkBtn);
        
        heading.addEventListener('mouseenter', function() {
          bookmarkBtn.style.display = 'block';
        });
        
        heading.addEventListener('mouseleave', function() {
          bookmarkBtn.style.display = 'none';
        });
      }
    });
  }
  
  addBookmarkButtons();
  
  // Create bookmarks panel
  const bookmarksToggle = document.createElement('button');
  bookmarksToggle.id = 'bookmarks-toggle';
  bookmarksToggle.innerHTML = '<span class="icon">■</span><span class="label">Bookmarks</span>';
  bookmarksToggle.className = 'bookmarks-toggle';
  bookmarksToggle.setAttribute('aria-label', 'Toggle bookmarks');
  document.body.appendChild(bookmarksToggle);
  
  const bookmarksPanel = document.createElement('div');
  bookmarksPanel.id = 'bookmarks-panel';
  bookmarksPanel.className = 'bookmarks-panel';
  bookmarksPanel.innerHTML = `
    <div class="bookmarks-header">
      <h3>Bookmarks</h3>
      <button class="bookmarks-close" aria-label="Close bookmarks">×</button>
    </div>
    <div class="bookmarks-content">
      <div id="bookmarks-list" class="bookmarks-list"></div>
      <button id="clear-bookmarks" class="bookmarks-clear">Clear All Bookmarks</button>
    </div>
  `;
  document.body.appendChild(bookmarksPanel);
  
  const bookmarksList = document.getElementById('bookmarks-list');
  const bookmarksClose = bookmarksPanel.querySelector('.bookmarks-close');
  const clearBookmarksBtn = document.getElementById('clear-bookmarks');
  
  function toggleBookmark(element) {
    const id = element.id;
    const title = element.querySelector('h1, h2, h3')?.textContent || element.id;
    const index = bookmarks.findIndex(b => b.id === id);
    
    if (index > -1) {
      // Remove bookmark
      bookmarks.splice(index, 1);
      const btn = element.querySelector('.bookmark-btn');
      if (btn) {
        btn.classList.remove('bookmarked');
        btn.innerHTML = '🔖';
      }
      showNotification('Bookmark removed', 'info');
    } else {
      // Add bookmark
      bookmarks.push({
        id: id,
        title: title,
        timestamp: Date.now()
      });
      const btn = element.querySelector('.bookmark-btn');
      if (btn) {
        btn.classList.add('bookmarked');
        btn.innerHTML = '⭐';
      }
      showNotification('Bookmarked', 'success');
    }
    
    localStorage.setItem(bookmarksStorageKey, JSON.stringify(bookmarks));
    renderBookmarks();
  }
  
  function renderBookmarks() {
    if (bookmarks.length === 0) {
      bookmarksList.innerHTML = '<p class="bookmarks-empty">No bookmarks yet. Click the ◊ icon on any heading to bookmark it.</p>';
      return;
    }
    
    bookmarksList.innerHTML = bookmarks.map((bookmark, index) => {
      const element = document.getElementById(bookmark.id);
      const title = element ? (element.querySelector('h1, h2, h3')?.textContent || bookmark.title) : bookmark.title;
      return `
        <div class="bookmark-item" data-id="${bookmark.id}">
          <div class="bookmark-content">
            <h4>${title}</h4>
            <button class="bookmark-remove" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Add click handlers
    bookmarksList.querySelectorAll('.bookmark-item').forEach(item => {
      item.addEventListener('click', function(e) {
        if (!e.target.classList.contains('bookmark-remove')) {
          const id = this.dataset.id;
          const element = document.getElementById(id);
          if (element) {
            const offset = 100;
            window.scrollTo({
              top: element.offsetTop - offset,
              behavior: 'smooth'
            });
            bookmarksPanel.classList.remove('open');
            bookmarksToggle.classList.remove('active');
          }
        }
      });
    });
    
    // Add remove handlers
    bookmarksList.querySelectorAll('.bookmark-remove').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const index = parseInt(this.dataset.index);
        const bookmark = bookmarks[index];
        const element = document.getElementById(bookmark.id);
        if (element) {
          const bookmarkBtn = element.querySelector('.bookmark-btn');
          if (bookmarkBtn) {
            bookmarkBtn.classList.remove('bookmarked');
            bookmarkBtn.innerHTML = '◊';
          }
        }
        bookmarks.splice(index, 1);
        localStorage.setItem(bookmarksStorageKey, JSON.stringify(bookmarks));
        renderBookmarks();
        showNotification('Bookmark removed', 'info');
      });
    });
  }
  
  bookmarksToggle.addEventListener('click', function() {
    bookmarksPanel.classList.toggle('open');
    bookmarksToggle.classList.toggle('active');
  });
  
  bookmarksClose.addEventListener('click', function() {
    bookmarksPanel.classList.remove('open');
    bookmarksToggle.classList.remove('active');
  });
  
  clearBookmarksBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      bookmarks.forEach(bookmark => {
        const element = document.getElementById(bookmark.id);
        if (element) {
          const bookmarkBtn = element.querySelector('.bookmark-btn');
          if (bookmarkBtn) {
            bookmarkBtn.classList.remove('bookmarked');
            bookmarkBtn.innerHTML = '◊';
          }
        }
      });
      bookmarks = [];
      localStorage.removeItem(bookmarksStorageKey);
      renderBookmarks();
      showNotification('All bookmarks cleared', 'info');
    }
  });
  
  renderBookmarks();
  
  // ============================================
  // READING PROGRESS
  // ============================================
  
  const progressBar = document.createElement('div');
  progressBar.id = 'reading-progress';
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);
  
  const progressFill = document.createElement('div');
  progressFill.className = 'reading-progress-fill';
  progressBar.appendChild(progressFill);
  
  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    const progress = (scrollTop / scrollableHeight) * 100;
    
    progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
  
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();
  
  // ============================================
  // DARK MODE
  // ============================================
  
  const darkModeStorageKey = 's2s_dark_mode';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedDarkMode = localStorage.getItem(darkModeStorageKey);
  const isDarkMode = savedDarkMode ? savedDarkMode === 'true' : prefersDark;
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
  
  const darkModeToggle = document.createElement('button');
  darkModeToggle.id = 'dark-mode-toggle';
  darkModeToggle.innerHTML = isDarkMode ? '<span class="icon">●</span>' : '<span class="icon">○</span>';
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
  document.body.appendChild(darkModeToggle);
  
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isNowDark = document.body.classList.contains('dark-mode');
    this.innerHTML = isNowDark ? '<span class="icon">●</span>' : '<span class="icon">○</span>';
    localStorage.setItem(darkModeStorageKey, isNowDark.toString());
  });
  
  // ============================================
  // HELPER FUNCTION: NOTIFICATIONS
  // ============================================
  
  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});

