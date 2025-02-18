const locations = [
    {
        id: 1,
        title: "أهرامات الجيزة",
        images: [
            "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?fit=crop&w=1000&h=600",
            "https://images.unsplash.com/photo-1590708697466-c69f2871959b?fit=crop&w=1000&h=600"
        ],
        history: "أحد عجائب الدنيا السبع، بنيت خلال القرن 26 ق.م كمقابر للفراعنة، وتعتبر أعظم إنجاز معماري في التاريخ.",
        architecture: "يتكون المجمع من 3 أهرامات رئيسية وأبو الهول، بُنيت من الحجر الجيري بزوايا هندسية دقيقة.",
        discovery: "اكتشفت بالكامل في القرن 19 بواسطة بعثات أوروبية، وأجريت أول دراسة علمية عام 1880.",
        additionalImages: ["https://images.unsplash.com/photo-1590708767762-68127b2b5902?fit=crop&w=600&h=400"]
    },
    {
        id: 2,
        title: "وادي الملوك",
        images: [
            "https://images.unsplash.com/photo-1590708767756-f3ffdc79eb5a?fit=crop&w=1000&h=600"
        ],
        history: "مقبرة الفراعنة الجديدة في الأقصر، تحتوي على 63 مقبرة ملكية تعود للأسرة 18 إلى 20.",
        architecture: "ممرات منحوتة في الصخر تؤدي إلى غرف الدفن المزينة بالنقوش والرسومات الملونة.",
        discovery: "اكتشفها العالم البريطاني هوارد كارتر عام 1922 مع مقبرة توت عنخ آمون الشهيرة.",
        additionalImages: ["https://images.unsplash.com/photo-1590708767760-a6c5e4295195?fit=crop&w=600&h=400"]
    }
];

// Modal Functions
function showAboutUs() {
    const modal = document.getElementById('aboutUsModal');
    if (modal) modal.style.display = 'block';
}

function showDevInfo() {
    const modal = document.getElementById('devInfoModal');
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Image Gallery Navigation
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function slide(direction) {
    const slider = document.getElementById("gallerySlider");
    if (!slider) return;

    const items = slider.children;
    const totalItems = items.length;

    if (totalItems === 0) return;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    updateGallery();
}

function updateGallery() {
    const slider = document.getElementById("gallerySlider");
    if (!slider) return;

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Touch Events for Gallery
function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            slide(-1); // Swipe right
        } else {
            slide(1); // Swipe left
        }
    }
}

// Location Functions
function renderLocations(locs) {
    const grid = document.getElementById('locationsGrid');
    if (!grid) return;

    grid.innerHTML = locs.map(loc => `
        <div class="location-card" onclick="showDetail(${loc.id})">
            <img src="${loc.images[0]}" alt="${loc.title}">
            <div class="location-info">
                <h3>${loc.title}</h3>
                <p>${loc.history.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

function showDetail(id) {
    const location = locations.find(l => l.id === id);
    if (!location) return;
    
    localStorage.setItem('currentLocation', JSON.stringify(location));
    window.location.href = 'detail.html';
}

function initDetailPage() {
    const loc = JSON.parse(localStorage.getItem('currentLocation'));
    if (!loc) return;

    const elements = {
        title: document.getElementById('detailTitle'),
        history: document.getElementById('historyContent'),
        architecture: document.getElementById('architectureContent'),
        discovery: document.getElementById('discoveryContent'),
        slider: document.getElementById('gallerySlider'),
        additional: document.getElementById('additionalImages')
    };

    if (elements.title) elements.title.textContent = loc.title;
    if (elements.history) elements.history.textContent = loc.history;
    if (elements.architecture) elements.architecture.textContent = loc.architecture;
    if (elements.discovery) elements.discovery.textContent = loc.discovery;

    if (elements.slider) {
        elements.slider.innerHTML = loc.images.map(img => `
            <img src="${img}" alt="${loc.title}">
        `).join('');
    }

    if (elements.additional) {
        elements.additional.innerHTML = loc.additionalImages.map(img => `
            <img src="${img}" alt="صورة إضافية لـ${loc.title}">
        `).join('');
    }
}

// Search and Filter Functions
function filterLocations(category) {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    let filtered = locations;

    if (category && category !== 'all') {
        filtered = filtered.filter(loc => {
            switch(category) {
                case 'pyramids':
                    return loc.title.includes('هرم') || loc.title.includes('أهرامات');
                case 'temples':
                    return loc.title.includes('معبد');
                case 'museums':
                    return loc.title.includes('متحف');
                default:
                    return true;
            }
        });
    }

    if (searchTerm) {
        filtered = filtered.filter(loc => 
            loc.title.toLowerCase().includes(searchTerm) ||
            loc.history.toLowerCase().includes(searchTerm) ||
            loc.architecture.toLowerCase().includes(searchTerm)
        );
    }

    renderLocations(filtered);
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeFilter = document.querySelector('.filter-btn.active');
            filterLocations(activeFilter?.dataset.filter);
         });
    }
}

// Initialize Pages
document.addEventListener('DOMContentLoaded', function() {
    // Setup touch events for gallery
    const slider = document.getElementById("gallerySlider");
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }

    // Initialize filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterLocations(btn.dataset.filter);
        });
    });

    // Initialize appropriate page
    if (document.body.classList.contains('locations-page')) {
        renderLocations(locations);
        initSearch();
    } else if (document.body.classList.contains('detail-page')) {
        initDetailPage();
    }
});