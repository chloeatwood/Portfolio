// JavaScript for smooth scrolling navigation and project description updates

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Hero slide functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-text');

function changeSlide(direction) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Random background colors for project cards
const colors = ["#5C5C99", "#669988", "#BC8CA6"];
const cards = document.querySelectorAll(".project-card, .attribute-card, .contact-card");

cards.forEach((card) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    card.style.backgroundColor = randomColor;
});

