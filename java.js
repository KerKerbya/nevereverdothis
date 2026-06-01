

    // ── CAD İMLEÇ ───────────────────────────────
    const cursor  = document.getElementById('cursor');
    const cadH    = document.getElementById('cad-h');
    const cadV    = document.getElementById('cad-v');
    const coordsEl = document.getElementById('coords');

    document.addEventListener('mousemove', e => {
      const x = e.clientX, y = e.clientY;
      cursor.style.transform = `translate(${x}px,${y}px)`;
      cadH.style.transform   = `translateY(${y}px)`;
      cadV.style.transform   = `translateX(${x}px)`;
      const px = String(Math.round(x)).padStart(3,'0');
      const py = String(Math.round(y)).padStart(3,'0');
      coordsEl.textContent = `X: ${px} — Y: ${py}`;
    });

    // Hover — kare büyür, çizgiler parlaklaşır
    document.querySelectorAll('.nav-btn, .close-btn, .contact-item, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cadH.classList.add('hover');
        cadV.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cadH.classList.remove('hover');
        cadV.classList.remove('hover');
      });
    });

    // ── UÇAN TUŞLAR — FİZİK ─────────────────────
    const buttons = Array.from(document.querySelectorAll('.nav-btn'));
    const states  = [];

    function initButtons() {
      buttons.forEach((btn, i) => {
        const bw = btn.offsetWidth  + 2;
        const bh = btn.offsetHeight + 2;
        const margin = 60;

        // Hızlar çok ama çok az arttırıldı
        const speeds = [0.55, 0.70, 0.62, 0.66];
        const speed  = speeds[i] + Math.random() * 0.15;

        const angle = Math.random() * Math.PI * 2;

        const s = {
          x:  margin + Math.random() * (window.innerWidth  - bw - margin * 2),
          y:  margin + Math.random() * (window.innerHeight - bh - margin * 2),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseSpeed: speed, // Eski hızını hafızaya aldık
          hover: false,
          w: bw,
          h: bh
        };

        states.push(s);
        btn.style.left = s.x + 'px';
        btn.style.top  = s.y + 'px';

        btn.addEventListener('mouseenter', () => { s.hover = true;  });
        btn.addEventListener('mouseleave', () => { s.hover = false; });
        btn.addEventListener('click', () => {
          if (btn.dataset.panel === 'projects') {
            window.location.href = 'projects.html';
          } else {
            openPanel(btn.dataset.panel);
          }
        });
      });
    }

    function animateButtons() {
      const W = window.innerWidth;
      const H = window.innerHeight;

      states.forEach((s, i) => {
        const btn = buttons[i];
        
        if (s.hover) {
          // Duraksama — fare üzerindeyken yavaşla
          s.vx *= 0.90;
          s.vy *= 0.90;
        } else {
          // Eğer hover değilse, mevcut hızına bak
          const currentSpeed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
          
          // Eğer olması gereken hızdan yavaşsa yavaşça hızlandır
          if (currentSpeed < s.baseSpeed) {
            // Eğer hız sıfıra indiyse ufak bir rastgele itme ver ki sıfırda takılmasın
            if (currentSpeed < 0.01) {
              const a = Math.random() * Math.PI * 2;
              s.vx = Math.cos(a) * 0.1;
              s.vy = Math.sin(a) * 0.1;
            } else {
              // Yavaşça ivmelenerek eski hızına ulaş
              s.vx *= 1.03; 
              s.vy *= 1.03;
            }
          }
        }

        s.x += s.vx;
        s.y += s.vy;

        // Kenarlardan sekme
        if (s.x <= 0)       { s.x = 0;       s.vx =  Math.abs(s.vx); }
        if (s.x >= W - s.w) { s.x = W - s.w; s.vx = -Math.abs(s.vx); }
        if (s.y <= 0)       { s.y = 0;       s.vy =  Math.abs(s.vy); }
        if (s.y >= H - s.h) { s.y = H - s.h; s.vy = -Math.abs(s.vy); }

        btn.style.left = s.x + 'px';
        btn.style.top  = s.y + 'px';
      });

      requestAnimationFrame(animateButtons);
    }

    window.addEventListener('load', () => {
      initButtons();
      animateButtons();
    });

    window.addEventListener('resize', () => {
      states.forEach((s, i) => {
        s.w = buttons[i].offsetWidth  + 2;
        s.h = buttons[i].offsetHeight + 2;
        s.x = Math.min(s.x, window.innerWidth  - s.w);
        s.y = Math.min(s.y, window.innerHeight - s.h);
      });
    });

    // ── PANEL AÇMA / KAPAMA ──────────────────────
    function openPanel(id) {
      const panel = document.getElementById('panel-' + id);
      if (!panel) return;
      panel.classList.add('open');
    }

    function closePanel(id) {
      const panel = document.getElementById('panel-' + id);
      if (!panel) return;
      panel.classList.remove('open');
    }

    // Kapat tuşları
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', () => closePanel(btn.dataset.close));
    });

    // Panel dışına tıklama — kapat
    document.querySelectorAll('.panel').forEach(panel => {
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          closePanel(panel.id.replace('panel-', ''));
        }
      });
    });

    // ESC tuşu
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.panel.open').forEach(p => {
          closePanel(p.id.replace('panel-', ''));
        });
      }
    });













    // ── CAD İMLEÇ TAKİBİ ──
    const cursor = document.getElementById('cursor');
    const cadH = document.getElementById('cad-h');
    const cadV = document.getElementById('cad-v');

    document.addEventListener('mousemove', e => {
      cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      cadH.style.transform   = `translateY(${e.clientY}px)`;
      cadV.style.transform   = `translateX(${e.clientX}px)`;
    });

    // ── YEREL GÖRSELLER İÇİN VERİ YAPISI ──
    
    const projectData = {
      "1": { title: "MTG", desc: "Mimari Tasarıma Giriş portfolyosu.", year: "2024", images: ["portf.png", "mtg3.png", "mtg2.png", "mtg33.png", "mtgg.png"] },
      "2": { title: "EMSAL", desc: "Emsal dersi hakkında kısa özet.", year: "2026", images: ["emsall.png", "SOU.png", "ser.png"] },
      "3": { title: "MP1", desc: "Konut ve kreş birleşimi.", year: "2025", images: ["mp111.png", "mp222.png", "mp333.png", "2.png"] },
      "4": { title: "ECO AFİŞ", desc: "Sürdürülebilir yaklaşımlar.", year: "2025", images: ["ECO - ÇATI.png", "ecooo.png"] },
      "5": { title: "RHINO", desc: "Modelleme çalışması.", year: "2025", images: ["VAWES.png"] },
      "6": { title: "SketchUp", desc: "3D Modelleme çalışması.", year: "2025", images: ["sketcup.png"] },
      "7": { title: "Sanat ve Mimarlık", desc: "Tarihsel analiz.", year: "2025", images: ["SANAT VE MİMARLIK TARİHİ.png"] },
      "8": { title: "Mimari Tasarım", desc: "Psikoloji odaklı tasarım.", year: "2025", images: ["MİMARİ TASARIMLARIN İNSAN PSKİKOLOJİSİNE ve sosyalleşmeye Etkisi.png"] },
      "9": { title: "Çevresel Tasarım", desc: "Kentsel bağlam analizi.", year: "2025", images: ["20241301069_BerkayPirinç_1.jpg"] },
      "10": { title: "Others", desc: "Diğer çalışmalar.", year: "2025", images: ["BRUTAL.png", "raporr.png", "fav.icon.png", "Sagamore Kuzey Kulübesi.png", "SANAYİ.png"] }
    };

    // ── FİZİKSEL ÇARPIŞMA VE SÜRÜKLEME ──
    const covers = Array.from(document.querySelectorAll('.proj-cover'));
    const dropZone = document.getElementById('drop-zone');
    const states = [];
    let activeDrag = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    covers.forEach((cover, i) => {
      const w = 160, h = 220, margin = 40;
      const speed = 0.3 + Math.random() * 0.2;
      const angle = Math.random() * Math.PI * 2;
      
      const s = {
        x: margin + Math.random() * (window.innerWidth - w - margin * 2),
        y: margin + Math.random() * (window.innerHeight - h - margin * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        isHovered: false,
        isDragging: false,
        el: cover
      };
      
      states.push(s);
      cover.style.left = s.x + 'px';
      cover.style.top  = s.y + 'px';

      cover.addEventListener('mouseenter', () => { s.isHovered = true; cursor.classList.add('hover'); });
      cover.addEventListener('mouseleave', () => { s.isHovered = false; cursor.classList.remove('hover'); });
      
      cover.addEventListener('pointerdown', (e) => {
        activeDrag = s;
        s.isDragging = true;
        cover.classList.add('dragging');
        cursor.classList.add('grabbing');
        
        const rect = cover.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        s.vx = 0; s.vy = 0;
      });
    });

    window.addEventListener('pointermove', (e) => {
      if (activeDrag) {
        activeDrag.x = e.clientX - dragOffsetX;
        activeDrag.y = e.clientY - dragOffsetY;
        
        const coverRect = activeDrag.el.getBoundingClientRect();
        const dropRect = dropZone.getBoundingClientRect();
        
        const isColliding = !(
          coverRect.right < dropRect.left || 
          coverRect.left > dropRect.right || 
          coverRect.bottom < dropRect.top || 
          coverRect.top > dropRect.bottom
        );

        if (isColliding) {
          dropZone.classList.add('active');
        } else {
          dropZone.classList.remove('active');
        }
      }
    });

    window.addEventListener('pointerup', () => {
      if (activeDrag) {
        activeDrag.isDragging = false;
        activeDrag.el.classList.remove('dragging');
        cursor.classList.remove('grabbing');
        
        if (dropZone.classList.contains('active')) {
          openDetail(activeDrag.el.dataset.id);
          dropZone.classList.remove('active');
          
          activeDrag.vx = (Math.random() - 0.5) * 1.5;
          activeDrag.vy = (Math.random() - 0.5) * 1.5;
        } else {
          activeDrag.vx = (Math.random() - 0.5);
          activeDrag.vy = (Math.random() - 0.5);
        }
        activeDrag = null;
      }
    });

    function animate() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const w = 160, h = 220;

      states.forEach((s) => {
        if (!s.isDragging) {
          if (s.isHovered) {
            s.vx *= 0.95; s.vy *= 0.95; 
          } else {
            if(Math.abs(s.vx) < 0.1 && Math.abs(s.vy) < 0.1) {
                s.vx += (Math.random() - 0.5) * 0.1;
                s.vy += (Math.random() - 0.5) * 0.1;
            }
          }

          s.x += s.vx;
          s.y += s.vy;

          if (s.x <= 0)      { s.x = 0;      s.vx =  Math.abs(s.vx); }
          if (s.x >= W - w)  { s.x = W - w;  s.vx = -Math.abs(s.vx); }
          if (s.y <= 0)      { s.y = 0;      s.vy =  Math.abs(s.vy); }
          if (s.y >= H - h)  { s.y = H - h;  s.vy = -Math.abs(s.vy); }
        }
        
        s.el.style.left = s.x + 'px';
        s.el.style.top  = s.y + 'px';
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // ── SLIDER SİSTEMİ ──
    const detailPanel = document.getElementById('detail-panel');
    const closeBtn = document.getElementById('close-detail');
    const sliderImg = document.getElementById('slider-img');
    const sliderCounter = document.getElementById('slider-counter');

    let activeImages = [];
    let currentImgIndex = 0;

    function openDetail(id) {
      const data = projectData[id];
      if(!data) return;
      
      document.getElementById('detail-title').innerHTML = data.title;
      document.getElementById('detail-desc').innerText = data.desc;
      document.getElementById('detail-year').innerText = "Yıl: " + data.year;
      
      activeImages = data.images;
      currentImgIndex = 0;
      
      updateSliderUI();
      detailPanel.classList.add('open');
    }

    function changeSlide(direction) {
      currentImgIndex += direction;
      if (currentImgIndex >= activeImages.length) currentImgIndex = 0;
      else if (currentImgIndex < 0) currentImgIndex = activeImages.length - 1;
      updateSliderUI();
    }

    function updateSliderUI() {
      if (activeImages.length > 0) {
        sliderImg.src = activeImages[currentImgIndex];
        sliderCounter.innerText = `${currentImgIndex + 1} / ${activeImages.length}`;
      }
    }

    closeBtn.addEventListener('click', () => detailPanel.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') detailPanel.classList.remove('open'); });
