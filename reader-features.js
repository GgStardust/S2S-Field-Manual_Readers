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
  notesToggle.innerHTML = '📝 Notes';
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

