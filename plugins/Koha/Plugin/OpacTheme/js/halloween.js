document.addEventListener('DOMContentLoaded', function() {
    
    var navbarCollapse  = document.querySelector('nav.breadcrumbs');
    if (navbarCollapse) {
         for (let i = 0; i < 6; i++) {
      const spider = document.createElement('div');
      spider.className = `spider spider_${i}`;

      const eyeLeft = document.createElement('div');
      eyeLeft.className = 'eye left';

      const eyeRight = document.createElement('div');
      eyeRight.className = 'eye right';

      spider.appendChild(eyeLeft);
      spider.appendChild(eyeRight);

      // 4 legs left
      for (let j = 0; j < 4; j++) {
        const leg = document.createElement('span');
        leg.className = 'leg left';
        leg.style.top = `${20 + j * 5}px`;
		 const leftOffset = -8 + j * 1.5; 
      leg.style.left = `${leftOffset}px`;
        spider.appendChild(leg);
      }

      // 4 legs right
      for (let j = 0; j < 4; j++) {
        const leg = document.createElement('span');
        leg.className = 'leg right';
        leg.style.top = `${20 + j * 5}px`;
		const rightOffset = -8 + j * 1.5;
      leg.style.right = `${rightOffset}px`;
        spider.appendChild(leg);
      }
        navbarCollapse.appendChild(spider);
    }

	}

	 var navbarCollapse = document.querySelector('footer#changelanguage .collapse.navbar-collapse');
    if (navbarCollapse) {
        var container = document.createElement('hr');
        container.className = 'spider-web';

       
        navbarCollapse.appendChild(container);
    }
});
