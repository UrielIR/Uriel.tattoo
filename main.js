/* ============================================
   URIEL TATTOO — Main JS
   - Mobile Navigation
   - Sticky Header
   - Scroll Reveal Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Prevent scroll restoration and scroll to top on load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

    // ─── Mobile Navigation Toggle ──────────────────────────────
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#navbar');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', !isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
        });
    }

    // Close nav on link click
    document.querySelectorAll('#navbar a').forEach(link => {
        link.addEventListener('click', () => {
            primaryNav?.setAttribute('data-visible', 'false');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    // Close nav on click outside
    document.addEventListener('click', (e) => {
        if (primaryNav && navToggle && primaryNav.getAttribute('data-visible') === 'true') {
            if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
                primaryNav.setAttribute('data-visible', 'false');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ─── Sticky Header: class on scroll ────────────────────────
    const header = document.querySelector('#main-header');
    const handleScroll = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load

    // ─── Scroll Reveal (IntersectionObserver) ──────────────────
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // trigger once only
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -60px 0px', // trigger slightly before fully visible
                threshold: 0.08,
            }
        );
        revealEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all if IntersectionObserver not supported
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // ─── Designs: Reserve a specific design ─────────────────────
    let goToStep = null; // will be assigned after form init
    const reserveBtns = document.querySelectorAll('.btn-reserve-design');
    const banner      = document.getElementById('design-selected-banner');
    const dsbName     = document.getElementById('dsb-name');
    const dsbPrice    = document.getElementById('dsb-price');
    const dsbClear    = document.getElementById('dsb-clear');

    function applyDesignToForm(design, style, price) {
        if (!banner) return;

        // Show banner
        dsbName.textContent  = design;
        dsbPrice.textContent = price;
        banner.style.display = 'block';

        // Pre-fill style dropdown (step 2)
        const styleMap = {
            'Blackwork':       'blackwork',
            'Fine Line':       'fine-line',
            'Geométrico':      'geometrico',
            'Neo Tradicional': 'neo-tradicional',
            'Realismo':        'realismo',
            'Acuarela':        'acuarela',
            'Lettering':       'lettering',
        };
        const styleSelect = document.getElementById('style');
        if (styleSelect && styleMap[style]) {
            styleSelect.value = styleMap[style];
        }

        // Pre-fill description textarea (step 2)
        const descField = document.getElementById('description');
        if (descField && !descField.value) {
            descField.value = `Quiero reservar el diseño "${design}" (${style}, ${price}).`;
        }
    }

    function clearDesign() {
        if (!banner) return;
        banner.style.display = 'none';
        dsbName.textContent  = '';
        dsbPrice.textContent = '';

        const styleSelect = document.getElementById('style');
        if (styleSelect) styleSelect.value = '';

        const descField = document.getElementById('description');
        if (descField && descField.value.startsWith('Quiero reservar el diseño')) {
            descField.value = '';
        }
    }

    reserveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const design = btn.dataset.design;
            const style  = btn.dataset.style;
            const price  = btn.dataset.price;

            applyDesignToForm(design, style, price);

            // Go to booking form and reset to step 1
            const bookingSection = document.getElementById('booking-form');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Reset multi-step form to step 1 so user fills personal info first
            setTimeout(() => {
                if (goToStep) goToStep(1);
            }, 400);
        });
    });

    if (dsbClear) {
        dsbClear.addEventListener('click', clearDesign);
    }

    // ─── Multi-Step Form ────────────────────────────────────────
    const form = document.querySelector('#appointment-form');
    if (!form) return;

    const panels    = form.querySelectorAll('.msf-panel');
    const barFill   = document.querySelector('.msf-bar-fill');
    const indicators = document.querySelectorAll('.msf-indicator');
    const btnPrev   = form.querySelector('.msf-prev');
    const btnNext   = form.querySelector('.msf-next');
    const btnSubmit = form.querySelector('.msf-submit');
    const totalSteps = panels.length;
    let current = 1;

    goToStep = function(step) {
        current = step;

        // Panels
        panels.forEach(p => p.classList.remove('active'));
        const target = form.querySelector(`[data-panel="${step}"]`);
        if (target) target.classList.add('active');

        // Progress bar
        barFill.style.width = `${(step / totalSteps) * 100}%`;

        // Indicators
        indicators.forEach(ind => {
            const s = parseInt(ind.dataset.step);
            ind.classList.remove('active', 'done');
            if (s === step) ind.classList.add('active');
            if (s < step) ind.classList.add('done');
        });

        // Button visibility
        btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
        if (step === totalSteps) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-flex';
        } else {
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        }
    }

    // Validation
    function validateStep(step) {
        const panel = form.querySelector(`[data-panel="${step}"]`);
        const required = panel.querySelectorAll('[required]');
        let valid = true;

        required.forEach(field => {
            const errEl = panel.querySelector(`[data-for="${field.id}"]`);
            field.classList.remove('error');
            if (errEl) errEl.textContent = '';

            if (field.type === 'checkbox' && !field.checked) {
                valid = false;
                field.classList.add('error');
                if (errEl) errEl.textContent = 'Este campo es obligatorio.';
            } else if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
                if (errEl) errEl.textContent = 'Este campo es obligatorio.';
            } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                valid = false;
                field.classList.add('error');
                if (errEl) errEl.textContent = 'Ingresa un email válido.';
            }
        });

        return valid;
    }

    // Clear error on input
    form.addEventListener('input', (e) => {
        const field = e.target;
        if (field.classList.contains('error')) {
            field.classList.remove('error');
            const errEl = form.querySelector(`[data-for="${field.id}"]`);
            if (errEl) errEl.textContent = '';
        }
    });

    btnNext.addEventListener('click', () => {
        if (validateStep(current) && current < totalSteps) goToStep(current + 1);
    });

    btnPrev.addEventListener('click', () => {
        if (current > 1) goToStep(current - 1);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateStep(current)) return;

        // Change button state to loading
        const originalBtnText = btnSubmit.textContent;
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;

        // Gather data
        const bodyZoneEl = document.getElementById('bodyzone');
        const budgetEl = document.getElementById('budget');
        const styleEl = document.getElementById('style');
        
        let bodyZoneText = 'No especificada';
        if (bodyZoneEl.selectedIndex > 0) {
            bodyZoneText = bodyZoneEl.options[bodyZoneEl.selectedIndex].text;
        }

        let budgetText = 'No especificado';
        if (budgetEl.selectedIndex > 0) {
            budgetText = budgetEl.options[budgetEl.selectedIndex].text;
        }

        let styleText = 'No especificado';
        if (styleEl && styleEl.selectedIndex > 0) {
            styleText = styleEl.options[styleEl.selectedIndex].text;
        }

        const availArray = Array.from(form.querySelectorAll('[name="availability"]:checked'));
        let availabilityText = availArray.map(cb => cb.parentNode.textContent.trim()).join(', ');
        if (!availabilityText) availabilityText = 'Flexible / No especificada';

        let refImageParam = referenceImageUrl || 'No adjuntada';

        const templateParams = {
            full_name: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: 'Santiago (Estudio)', // Default locale
            body_zone: bodyZoneText,
            size_cm: document.getElementById('size').value || 'No especificado',
            tattoo_style: styleText,
            budget_range: budgetText,
            idea_description: document.getElementById('description').value,
            availability_date: availabilityText,
            reference_image: refImageParam,
            additional_notes: document.getElementById('extra-inquiry').value || 'Ninguna'
        };

        // Send via EmailJS
        emailjs.send('service_bjjep9g', 'template_htxzute', templateParams)
            .then(() => {
                // Show success screen
                const progressEl = document.querySelector('.msf-progress');
                if (progressEl) progressEl.style.display = 'none';

                form.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">✓</div>
                        <h3>¡Solicitud enviada!</h3>
                        <p>Gracias por tu interés, ${templateParams.full_name.split(' ')[0]}. Me pondré en contacto contigo en menos de 24 horas para coordinar los detalles.</p>
                    </div>
                `;
            })
            .catch((error) => {
                console.error('Error EmailJS completo:', JSON.stringify(error));
                const errMsg = error?.text || error?.message || JSON.stringify(error);
                alert('Error al enviar: ' + errMsg + '\n\nSi persiste, contáctame por Instagram.');
                btnSubmit.textContent = originalBtnText;
                btnSubmit.disabled = false;
            });
    });

    // ─── Drag & Drop Upload + imgbb cloud upload ─────────────────
    const uploadZone = document.getElementById('upload-zone');
    const fileInput  = document.getElementById('ref-images');
    const previewBox = document.getElementById('upload-preview');

    // → Paste your imgbb API key here (free at https://api.imgbb.com)
    const IMGBB_API_KEY = '79b896b8c2e17eea5166140bd9e44507';

    // Stores the public URL returned by imgbb after upload
    let referenceImageUrl = null;

    function compressToBase64(file, maxWidth = 800, quality = 0.75) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(1, maxWidth / img.width);
                    canvas.width  = img.width  * scale;
                    canvas.height = img.height * scale;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    // Return as raw base64 (no data: prefix) for imgbb API
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve({ dataUrl, base64: dataUrl.split(',')[1] });
                };
                img.onerror = reject;
                img.src = evt.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function uploadToImgbb(base64) {
        const body = new FormData();
        body.append('key', IMGBB_API_KEY);
        body.append('image', base64);
        const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body });
        const json = await res.json();
        if (json.success) return json.data.url;
        throw new Error('imgbb: ' + (json.error?.message || JSON.stringify(json)));
    }

    function handleFiles(files) {
        if (!previewBox) return;
        previewBox.innerHTML = '';
        referenceImageUrl = null;

        const imageFiles = [...files].filter(f => f.type.startsWith('image/'));

        imageFiles.forEach((file, index) => {
            if (file.size > 15 * 1024 * 1024) {
                const warn = document.createElement('div');
                warn.className = 'upload-preview-item';
                warn.innerHTML = `<span style="color:#ff6b6b;">Archivo muy grande (máx 15MB): ${file.name}</span>`;
                previewBox.appendChild(warn);
                return;
            }

            const thumb = document.createElement('div');
            thumb.className = 'upload-preview-item';
            thumb.innerHTML = `
                <span style="color:var(--text-dim); font-size:0.8rem;">Procesando ${file.name}…</span>
            `;
            previewBox.appendChild(thumb);

            compressToBase64(file).then(async ({ dataUrl, base64 }) => {
                // Show thumbnail
                thumb.innerHTML = `
                    <img src="${dataUrl}" alt="Ref" style="width:48px; height:48px; object-fit:cover; border-radius:4px; flex-shrink:0;">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${file.name}</span>
                    <span class="upload-status" style="margin-left:4px; font-size:0.75rem; color:var(--text-dim);">Subiendo…</span>
                    <button type="button" class="remove-thumb" aria-label="Eliminar" style="margin-left:auto; background:none; border:none; color:var(--text); cursor:pointer; font-size:1.2rem;">×</button>
                `;
                thumb.querySelector('.remove-thumb').addEventListener('click', (e) => {
                    e.stopPropagation();
                    thumb.remove();
                    if (index === 0) referenceImageUrl = null;
                });

                // Upload to imgbb (only first image)
                if (index === 0) {
                    try {
                        const url = await uploadToImgbb(base64);
                        referenceImageUrl = url;
                        const statusEl = thumb.querySelector('.upload-status');
                        if (statusEl) statusEl.innerHTML = `<span style="color:#b8ff00;">&#10003; Lista</span>`;
                    } catch (err) {
                        console.warn('imgbb upload failed:', err);
                        const statusEl = thumb.querySelector('.upload-status');
                        if (statusEl) statusEl.textContent = '(se adjuntará el nombre)';
                        // Fallback: store filename so email mentions it
                        referenceImageUrl = null;
                    }
                }
            });
        });
    }

    if (uploadZone && fileInput && previewBox) {
        ['dragenter', 'dragover'].forEach(ev => {
            uploadZone.addEventListener(ev, (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(ev => {
            uploadZone.addEventListener(ev, (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
            });
        });

        uploadZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
        });
    }

    // ─── Global Media Modal / Lightbox ──────────────────────────
    const modal = document.getElementById('media-modal');
    const modalClose = modal?.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalGallery = document.getElementById('modal-gallery');
    const viewAllBtns = document.querySelectorAll('.btn-view-all');

    // Mocks de galerias, idealmente esto podria venir de un JSON o generarse dinamicamente
    const galleries = {
        videos: {
            title: "Trabajos en Video",
            items: [
                { type: 'video', src: 'videos/optimized/IMG_0182.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_1102.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_1107.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_1446.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_2248.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_2760.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_3341.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_4861.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_5215.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_5229.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_6153.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_7133.m4v' },
                { type: 'video', src: 'videos/optimized/IMG_8061.m4v' }
            ]
        },
        fotos: {
            title: "Portafolio Completo",
            items: [
                { type: 'img', src: 'Fotos/optimized/IMG_4607.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_5214.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_6367.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_7090.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_7099.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_7716.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_7974.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_9020.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_9081.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_9233.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_9509.jpg' },
                { type: 'img', src: 'Fotos/optimized/IMG_9759.jpg' }
            ]
        },
        disenos: {
            title: "Todos los Diseños",
            items: [
                { type: 'img', src: 'diseños/optimized/IMG_1904.jpg', price: '$300.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1922.jpg', price: '$160.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1930.jpg', price: '$200.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1931.jpg', price: '$250.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1932.jpg', price: '$300.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1933.jpg', price: '$200.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1934.jpg', price: '$400.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1936.jpg', price: '$600.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1937.jpg', price: '$200.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1940.jpg', price: '$400.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1941.jpg', price: '$900.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1942.jpg', price: '$70.000' },
                { type: 'img', src: 'diseños/optimized/IMG_1943.jpg', price: '$200.000' }
            ]
        }
    };

    function openModal(galleryId) {
        if (!modal || !galleries[galleryId]) return;
        
        const gallery = galleries[galleryId];
        modalTitle.textContent = gallery.title;
        modalGallery.innerHTML = '';
        
        gallery.items.forEach(item => {
            let el;
            if (item.type === 'video') {
                el = document.createElement('video');
                el.src = item.src;
                el.controls = false; // Disable controls in grid for cleaner look
                el.muted = true;
                el.playsInline = true;
                el.loop = true;
                el.autoplay = true;
            } else {
                el = document.createElement('img');
                el.src = item.src;
                el.alt = 'Media';
                el.loading = 'lazy';
            }
            
            // Clicking an item INSIDE the gallery opens the lightbox
            el.style.cursor = 'zoom-in';
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(item.src, item.type, item.price);
            });

            modalGallery.appendChild(el);
        });

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        
        // Stop any playing videos
        const videos = modalGallery.querySelectorAll('video');
        videos.forEach(v => v.pause());
        
        setTimeout(() => {
            modalGallery.innerHTML = '';
        }, 300);
    }

    // ─── Individual Lightbox Logic ──────────────────────────────
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxContainer = document.getElementById('lightbox-media-container');

    function openLightbox(src, type = 'img', price = null) {
        if (!lightbox || !lightboxContainer) return;

        lightboxContainer.innerHTML = '';
        let el;

        if (type === 'video') {
            el = document.createElement('video');
            el.src = src;
            el.controls = true;
            el.autoplay = true;
            el.muted = false;
        } else {
            el = document.createElement('img');
            el.src = src;
            el.alt = 'Enlarged View';
        }

        lightboxContainer.appendChild(el);

        // Add price if available
        if (price) {
            const priceTag = document.createElement('div');
            priceTag.className = 'lightbox-price-tag';
            priceTag.textContent = price;
            lightboxContainer.appendChild(priceTag);
        }

        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll only if the main gallery modal is NOT open
        if (!modal.classList.contains('is-open')) {
            document.body.style.overflow = '';
        }

        // Stop video
        const video = lightboxContainer.querySelector('video');
        if (video) video.pause();

        setTimeout(() => {
            lightboxContainer.innerHTML = '';
        }, 400);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-content') === null) {
                // If we click outside the media
                if (e.target !== lightboxClose) closeLightbox();
            }
        });
    }

    // Close on ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('is-active')) closeLightbox();
            else if (modal.classList.contains('is-open')) closeModal();
        }
    });

    viewAllBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tgt = btn.dataset.gallery;
            openModal(tgt);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ─── Cursor Glow Effect ─────────────────────────────────────
    const glow = document.getElementById('cursor-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Centramos el glow sumando el offset manual o usando composición de transforms
            glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            
            // Mostrar solo cuando el mouse se mueve
            if (glow.style.opacity === '0') {
                glow.style.opacity = '1';
            }
        });

        window.addEventListener('mouseout', () => {
            glow.style.opacity = '0';
        });

        window.addEventListener('mouseenter', () => {
             glow.style.opacity = '1';
        });
    }

    // Single items click - Now open Lightbox instead of Full Gallery
    document.querySelectorAll('.video-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const video = item.querySelector('video');
            if (video) openLightbox(video.src, 'video');
        });
    });

    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const img = item.querySelector('img');
            if (img) openLightbox(img.src, 'img');
        });
    });

    // Landing page design items with price
    document.querySelectorAll('.design-card').forEach(item => {
        item.addEventListener('click', (e) => {
            const img = item.querySelector('img');
            const price = item.dataset.price;
            if (img) openLightbox(img.src, 'img', price);
        });
    });

});
