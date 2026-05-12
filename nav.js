// ── Mobile Nav: Search + More Drawer ──
(function () {

  // ── Search toggle ──
  const searchBtn = document.getElementById('header-search-btn');
  const mobileBar = document.getElementById('mobile-search-bar');
  if (searchBtn && mobileBar) {
    mobileBar.style.display = 'block';
    searchBtn.addEventListener('click', () => {
      mobileBar.classList.toggle('open');
      if (mobileBar.classList.contains('open')) {
        mobileBar.querySelector('input').focus();
      }
    });
  }

  // ── More drawer ──
  const moreBtn  = document.getElementById('more-nav-btn');
  const overlay  = document.getElementById('more-overlay');
  const drawer   = document.getElementById('more-drawer');

  function openDrawer() {
    overlay.style.display = 'block';
    drawer.style.display  = 'block';
    requestAnimationFrame(() => {
      overlay.classList.add('open');
      drawer.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    setTimeout(() => {
      overlay.style.display = 'none';
      drawer.style.display  = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    // swipe-down to close
    let startY = 0;
    drawer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive:true});
    drawer.addEventListener('touchend', e => {
      if (e.changedTouches[0].clientY - startY > 60) closeDrawer();
    }, {passive:true});
  }

  // ── Mark active nav item ──
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const search = window.location.search;
  document.querySelectorAll('.mobile-nav-item[data-page], .drawer-item[data-page]').forEach(el => {
    const page = el.dataset.page;
    if (
      (page === path) ||
      (page === 'category-article' && path === 'category.html' && search.includes('article')) ||
      (page === 'category-poem'    && path === 'category.html' && search.includes('poem')) ||
      (page === 'category-story'   && path === 'category.html' && search.includes('story'))
    ) {
      el.classList.add('active');
    }
  });

})();
