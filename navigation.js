// Enhanced navigation with sidebar table of contents

document.addEventListener('DOMContentLoaded', function() {
  // Create sidebar navigation
  createSidebarNav();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed nav
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 1024) {
          document.querySelector('.sidebar').classList.remove('open');
        }
      }
    });
  });

  // Sidebar toggle for mobile
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('open');
    });
  }

  // Highlight current section in sidebar
  // Find all sections with IDs that are linked in the sidebar
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  const sectionIds = Array.from(sidebarLinks).map(link => {
    const href = link.getAttribute('href');
    return href ? href.substring(1) : null;
  }).filter(id => id !== null);

  function updateActiveNav() {
    let current = '';
    const scrollPosition = window.pageYOffset + 200; // Account for nav bar

    // Check each section ID to see if we're in its range
    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight || section.scrollHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          current = id;
        }
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${current}`) {
        link.classList.add('active');
        // Scroll sidebar to show active link (but not on every scroll)
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.scrolling) {
          link.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Field Report checkbox toggle
  const fieldReportCheckbox = document.getElementById('field-report-request');
  const fieldReportEmailGroup = document.getElementById('field-report-email-group');
  
  if (fieldReportCheckbox && fieldReportEmailGroup) {
    fieldReportCheckbox.addEventListener('change', function() {
      if (this.checked) {
        fieldReportEmailGroup.style.display = 'block';
      } else {
        fieldReportEmailGroup.style.display = 'none';
        // Clear email field when unchecked
        document.getElementById('field-report-email').value = '';
      }
    });
  }
});

function createSidebarNav() {
  // Check if sidebar already exists
  if (document.querySelector('.sidebar')) {
    return;
  }

  // Create sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  const sidebarHeader = document.createElement('div');
  sidebarHeader.className = 'sidebar-header';
  sidebarHeader.textContent = 'Contents';
  
  const navList = document.createElement('ul');
  navList.className = 'sidebar-nav';

  // Add First Reader Welcome link at the top
  const firstReaderSection = document.getElementById('first-reader-welcome');
  if (firstReaderSection) {
    const firstReaderItem = document.createElement('li');
    const firstReaderLink = document.createElement('a');
    firstReaderLink.href = '#first-reader-welcome';
    firstReaderLink.textContent = 'For First Readers';
    firstReaderLink.className = 'section-link';
    firstReaderLink.style.fontWeight = '600';
    firstReaderLink.style.color = 'var(--color-accent)';
    firstReaderLink.style.marginBottom = '1rem';
    firstReaderLink.style.paddingBottom = '1rem';
    firstReaderLink.style.borderBottom = '2px solid var(--color-accent)';
    firstReaderItem.appendChild(firstReaderLink);
    navList.appendChild(firstReaderItem);
  }

  // Use the existing TOC links from Pandoc
  const tocLinks = document.querySelectorAll('#TOC a[href^="#"]');
  
  tocLinks.forEach(tocLink => {
    const href = tocLink.getAttribute('href');
    const text = tocLink.textContent.trim();
    
    // Skip certain sections and nested items
    if (text.includes('Title Page') || text.includes('Copyright Page') || 
        text === 'STARDUST TO SOVEREIGNTY' || text.includes('Table of Contents') ||
        text.includes('Before Form') || text.includes('The Light That') ||
        tocLink.closest('ul ul')) { // Skip nested sub-items
      return;
    }
    
    // Get the actual heading element to check if it exists
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId) || 
                         document.querySelector(`[id="${targetId}"]`);
    
    if (!targetElement) {
      return; // Skip if target doesn't exist
    }
    
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    
    // Style based on content type
    if (text.startsWith('Chapter')) {
      link.className = 'chapter-link';
    } else if (text.startsWith('Interlude') || text.startsWith('PROLOGUE') || text.startsWith('EPILOGUE')) {
      link.className = 'interlude-link';
    } else if (text.startsWith('Part') || text.startsWith('PART')) {
      link.className = 'part-link';
      link.style.fontWeight = '600';
      link.style.marginTop = '1.5rem';
      link.style.paddingTop = '1.5rem';
      link.style.borderTop = '2px solid #e0e0e0';
    } else if (text.startsWith('Appendix')) {
      link.className = 'appendix-link';
      link.style.fontWeight = '500';
      link.style.marginTop = '1rem';
    } else if (text.includes('Introduction') || text.includes('Conclusion') || 
               text.includes('Afterword') || text.includes('Dedication')) {
      link.className = 'section-link';
      link.style.fontWeight = '500';
    } else if (text === 'The Field That Remembers You') {
      link.className = 'interlude-link';
    }
    
    listItem.appendChild(link);
    navList.appendChild(listItem);
  });

  // Manually add Feedback Form link if it exists
  const feedbackSection = document.getElementById('first-reader-feedback');
  if (feedbackSection) {
    const feedbackItem = document.createElement('li');
    const feedbackLink = document.createElement('a');
    feedbackLink.href = '#first-reader-feedback';
    feedbackLink.textContent = 'Feedback Form';
    feedbackLink.className = 'section-link';
    feedbackLink.style.fontWeight = '500';
    feedbackLink.style.marginTop = '1.5rem';
    feedbackLink.style.paddingTop = '1.5rem';
    feedbackLink.style.borderTop = '2px solid #e0e0e0';
    feedbackItem.appendChild(feedbackLink);
    navList.appendChild(feedbackItem);
  }

  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(navList);
  document.body.insertBefore(sidebar, document.body.firstChild);

  // Create mobile toggle button
  const toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.innerHTML = '☰';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  document.body.insertBefore(toggle, document.body.firstChild);
}

