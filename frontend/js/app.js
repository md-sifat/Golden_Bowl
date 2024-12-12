const track = document.getElementById('slider-track');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let currentSlide = 0;
const cardWidth = track.querySelector('.card').offsetWidth + 16;
const totalCards = track.querySelectorAll('.card').length;

const updateSlider = () => {
    const offset = -currentSlide * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
};

prev.addEventListener('click', () => {
    currentSlide = Math.max(0, currentSlide - 1);
    updateSlider();
});

next.addEventListener('click', () => {
    currentSlide = Math.min(totalCards - 3, currentSlide + 1);
    updateSlider();
});

updateSlider();