/* Minimal React SPA overlay for smooth contact navigation */
(function(){
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  if (!React || !ReactDOM) return;

  const Overlay = () => React.createElement('div', { id: 'spa-overlay', style: overlayStyle },
    React.createElement('div', { id: 'spa-panel', style: panelStyle },
      React.createElement('div', { id: 'spa-content', style: contentStyle })
    )
  );

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    opacity: 0, pointerEvents: 'none', transition: 'opacity 300ms ease', zIndex: 10000
  };
  const panelStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: '#fff', transform: 'translateY(100%)', transition: 'transform 450ms ease'
  };
  const contentStyle = { overflowY: 'auto', height: '100%', WebkitOverflowScrolling: 'touch' };

  function ensureMount(){
    let rootDiv = document.getElementById('spa-root');
    if (!rootDiv) {
      rootDiv = document.createElement('div');
      rootDiv.id = 'spa-root';
      document.body.appendChild(rootDiv);
    }
    if (!window.__spaRoot) {
      window.__spaRoot = ReactDOM.createRoot(rootDiv);
      window.__spaRoot.render(React.createElement(Overlay));
    }
    // inject styles once
    if (!document.getElementById('spa-react-styles')){
      const s=document.createElement('style'); s.id='spa-react-styles';
      s.textContent = '#spa-overlay.show{opacity:1;pointer-events:auto}#spa-overlay.show #spa-panel{transform:translateY(0)}';
      document.head.appendChild(s);
    }
  }

  async function openContactSPA(){
    ensureMount();
    const overlay = document.getElementById('spa-overlay');
    const panel = document.getElementById('spa-panel');
    const container = document.getElementById('spa-content');
    if (!overlay || !panel || !container) return;
    
    // fetch contact.html and extract the main container
    const res = await fetch('./contact.html', { cache: 'no-store' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const content = doc.querySelector('.container');
    // inject fonts once
    const needed = ['font.css'];
    needed.forEach(href=>{ if(!document.querySelector('link[href="'+href+'"]')){const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l);} });
    container.innerHTML = '';
    if (content) container.appendChild(content);
    // hook back button inside SPA
    const backBtn = container.querySelector('.back-button');
    if (backBtn) {
      backBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeSPA(); history.back(); });
    }
    // show
    overlay.classList.add('show');
    // push state
    history.pushState({ spa:'contact' }, '', '#/contact');
  }

  function closeSPA(){
    const overlay = document.getElementById('spa-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(()=>{
      const container = document.getElementById('spa-content');
      if (container) container.innerHTML='';
    }, 300);
  }

  // intercept tell-us button to open SPA
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tell-us-btn');
    if (btn) { e.preventDefault(); openContactSPA(); }
  });

  // handle back/forward
  window.addEventListener('popstate', (e)=>{
    const overlay = document.getElementById('spa-overlay');
    if (!overlay) return;
    if (e.state && e.state.spa==='contact') {
      // ensure visible
      overlay.classList.add('show');
    } else {
      closeSPA();
    }
  });
})();


