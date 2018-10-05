let homeTitle = document.getElementById('home-title');
let classesTitle = document.getElementById('classes-title');
let scheduleTitle = document.getElementById('schedule-title');
let feedbackTitle = document.getElementById('feedback-title');
let scrollUp = document.getElementById('scroll-up');
//Scrolling functions from nav bar
function scrollHome() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}
function scrollClasses() {
    window.scroll({
        top: classesTitle.getBoundingClientRect().top,
        left: classesTitle.getBoundingClientRect().left,
        behavior: 'smooth'
    });
}
function scrollSchedule() {
    window.scroll({
        top: scheduleTitle.getBoundingClientRect().top,
        left: scheduleTitle.getBoundingClientRect().left,
        behavior: 'smooth'
    });
}
function scrollFeedback() {
    window.scroll({
        top: feedbackTitle.getBoundingClientRect().top,
        left: feedbackTitle.getBoundingClientRect().left,
        behavior: 'smooth'
    });
}
function checkBodyScroll() {
    if (window.pageYOffset > 90) {
        scrollUp.style.transform = 'translateX(5%)';
    }
    else {
        scrollUp.style.transform = 'translateX(-100%)';
    }
}
scrollUp.addEventListener('click', () => {
    scrollHome();
});
