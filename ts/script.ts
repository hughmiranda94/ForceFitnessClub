let config: any = {
  apiKey: "AIzaSyA61oMoOE3AxZcTSOc7rnCNmCExD8S0heA",
  authDomain: "forcefitnessclub-128df.firebaseapp.com",
  databaseURL: "https://forcefitnessclub-128df.firebaseio.com",
  projectId: "forcefitnessclub-128df",
  storageBucket: "forcefitnessclub-128df.appspot.com",
  messagingSenderId: "275800715940"
};
firebase.initializeApp(config);

//Firebase database references
let dbRefTestimonials: any = firebase.database().ref().child('testimonials');
let dbRefClasses: any = firebase.database().ref().child('classes');
let dbRefSchedule: any = firebase.database().ref().child('schedule');
let dbRefTrainers: any = firebase.database().ref().child('trainers');

//Database collectors
let trainers: any[];
let testimonials: any[];
let classes: any[];
let sortedClasses: any[];

//DOM Elements by ID
let feedbackForm : HTMLFormElement = <HTMLFormElement>document.getElementById('feedback-form');
let formName : HTMLInputElement = <HTMLInputElement>document.getElementById('form-name');
let formFeedback : HTMLInputElement = <HTMLInputElement>document.getElementById('form-feedback');
let testimonialImg: HTMLImageElement = <HTMLImageElement>document.getElementById('testimonial-img');
let testimonialTxt: HTMLElement = document.getElementById('testimonial-txt');
let testimonialName: HTMLElement = document.getElementById('testimonial-name');
let testimonialImgContainer: HTMLElement = document.getElementById('testimonials-img-container');
let testimonialInfoContainer: HTMLElement = document.getElementById('testimonials-info-container');
let classCardsGrid: HTMLElement = document.getElementById('class-cards-grid');
let trainerCardsGrid: HTMLElement = document.getElementById('trainer-cards-grid');
let scheduleGrid: HTMLElement = document.getElementById('schedule-grid');
let scheduleWeek: HTMLInputElement = <HTMLInputElement>document.getElementById('schedule-week');
let classFilter: HTMLInputElement = <HTMLInputElement>document.getElementById('class-filter');
let bar: HTMLElement = document.getElementById("bar");
let hiddenCards: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('hidden-card');
let viewBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('view-more-btn');

//Variables
const imgSrcPath: string = 'assets/';
let viewClassCardsToggle: boolean = false;
let cycleCount: number = 0;
let testimonialsQty: number = 0;
let day: string;
let tableRows: string;
let daysPerRow: string;
let activitiesPerDay: string;
let week: string;
let testimonialImgPick: number;
let htmlStars: string;
let numberOfStars: number;
let hiddenCard: string;
let numDate: string;
let month: string;

//Array constants for default values
const testimonialImgPool: string[] = [
  'testimonial-0.jpg',
  'testimonial-1.jpg',
  'testimonial-2.jpg',
  'testimonial-3.jpg',
  'testimonial-4.jpg'
];
const hoursDefinition: string[] = [
  '6AM - 8AM',
  '8AM - 10AM',
  '10AM - 12PM',
  '12PM - 2PM',
  '2PM - 4PM',
  '4PM - 6PM',
  '8PM - 10PM'
]
const weekDays: string[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]


//Firebase database synchronization

function syncSchedule() {
  dbRefSchedule.on('value', (snap: any) => {

    week = (<HTMLInputElement>scheduleWeek).value;


    //Regular sized Schedule
    if (window.outerWidth > 500) {
      tableRows = ''
      if (snap.val()[week] != undefined) {
        for (let i = 0; i < 7; i++) {
          daysPerRow = '';
          for (let j = 0; j < 7; j++) {
            if (snap.val()[week][weekDays[j]]['H' + (i + 1)] != undefined) {
              daysPerRow += `<td class="hour"><p>${snap.val()[week][weekDays[j]]['H' + (i + 1)]}</p><p><strong>` +
                hoursDefinition[i] + '</strong></p></td>';
            } else {
              daysPerRow += '<td class="hour"></td>'
            }
          }
          tableRows += `<tr>${daysPerRow}</tr>`;

        }
        scheduleGrid.innerHTML = '';
        scheduleGrid.innerHTML += `<thead><tr><th class="day-name">MONDAY</th>
        <th class="day-name">TUESDAY</th>
        <th class="day-name">WEDNESDAY</th>
        <th class="day-name">THURSDAY</th>
        <th class="day-name">FRIDAY</th>
        <th class="day-name">SATURDAY</th>
        <th class="day-name">SUNDAY</th></tr></thead><tbody>${tableRows}</tbody>`;
      } else {
        for (let i = 0; i < 7; i++) {
          daysPerRow = '';
          for (let j = 0; j < 7; j++) {
            daysPerRow += '<td class="hour"></td>'
          }
          tableRows += `<tr>${daysPerRow}</tr>`;

        }
        scheduleGrid.innerHTML = '';
        scheduleGrid.innerHTML += `<thead><tr><th class="day-name">MONDAY</th>
        <th class="day-name">TUESDAY</th>
        <th class="day-name">WEDNESDAY</th>
        <th class="day-name">THURSDAY</th>
        <th class="day-name">FRIDAY</th>
        <th class="day-name">SATURDAY</th>
        <th class="day-name">SUNDAY</th></tr></thead><tbody>${tableRows}</tbody>`;
        setTimeout(() => {
          alert('Sorry, there are no activities this week');
        }, 250);
      }

    }
    //Mobile sized Schedule
    else {
      activitiesPerDay = '';
      if (snap.val()[week] != undefined) {
        for (let j = 0; j < 7; j++) {
          activitiesPerDay += `<tr><th class="day-name"><p>${weekDays[j].toUpperCase()}</p></th></tr>`
          for (let i = 0; i < 7; i++) {
            if (snap.val()[week][weekDays[j]]['H' + (i + 1)] != undefined) {
              activitiesPerDay += `<tr><td class="hour"><p>${snap.val()[week][weekDays[j]]['H' + (i + 1)]}</p><p><strong>` +
                hoursDefinition[i] + '</strong></p></td></tr>';
            }
          }
        }
        scheduleGrid.innerHTML = '';
        scheduleGrid.innerHTML += activitiesPerDay;
      } else {

        scheduleGrid.innerHTML = '';
        scheduleGrid.innerHTML += '<tr><td class="hour"><p>NO ACTIVITIES THIS WEEK</p></td></tr>';
      }

    }
  });
}
syncSchedule();

function syncTestimonials() {
  dbRefTestimonials.on('value', (snap: any) => {
    testimonials = [];
    for (let i = 0; i < snap.numChildren(); i++) {
      try {
        testimonials.push({
          img: snap.val()[i].img,
          txt: snap.val()[i].txt,
          name: snap.val()[i].name
        });
      } catch (e) {
        console.log(`Can not push testimonial from firebase. ${e}`);
      }
    }
    testimonialsQty = snap.numChildren();
  });
}
syncTestimonials();

function syncClasses() {
  dbRefClasses.on('value', (snap: any) => {
    classes = [];
    for (let i = 0; i < snap.numChildren(); i++) {
      classes.push({
        img: snap.val()[i].img,
        title: snap.val()[i].title,
        price: snap.val()[i].price,
        instructor: {
          img: snap.val()[i]['instructor'].img,
          name: snap.val()[i]['instructor'].name,
        },
        rating: {
          stars: snap.val()[i]['rating'].stars,
          reviews: snap.val()[i]['rating'].reviews,
        },
        day: snap.val()[i].day,
        frequency: snap.val()[i].frequency,
        sessions: snap.val()[i].sessions
      });
    }
    loadClassCards();
  });

}
syncClasses();

function syncTrainers() {
  dbRefTrainers.on('value', (snap: any) => {
    trainers = [];
    for (let i = 0; i < 4; i++) {
      trainers.push({
        icon: snap.val()[i].icon,
        title: snap.val()[i].title,
        desc: snap.val()[i].desc
      });
    }
    loadTrainerCards();
  });
}
syncTrainers();


//Schedule Week Input eventListener that synchronizes the Schedule when a change is made.
scheduleWeek.addEventListener('input', () => syncSchedule());
//Schedule Week Input eventListener that synchronizes the Schedule when a change is made.
classFilter.addEventListener('input', () => loadClassCards());
//Feedback Form eventListener that synchronizes the Testimonials when feedback is submitted with button.
feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  feedbackForm.checkValidity() ? submitForm() : alert('Form is not valid.');
});
//Feedback Form eventListener that synchronizes the Testimonials when feedback is submitted with keyup.
feedbackForm.addEventListener('keyup', (e: KeyboardEvent) => {
  if (e.key == 'Enter') {
    e.preventDefault();
    feedbackForm.checkValidity() ? submitForm() : alert('Form is not valid.');
  }
});
//Window eventListener that loads the correct type of schedule and class cards depending the screen's width
window.addEventListener('resize', () => {
  syncSchedule();
  loadClassCards();
})

//Override for default submit, gives an img to the new testimonial and sends it to the DB
function submitForm() {
  testimonialImgPick = Math.floor(Math.random() * (testimonialImgPool.length - 1));
  dbRefTestimonials.child(testimonialsQty).set({
    img: testimonialImgPool[testimonialImgPick],
    name: formName.value,
    // name: feedbackForm.elements['form-name'].value,
    txt: formFeedback.value
    // txt: feedbackForm.elements['form-feedback'].value
  });
  alert('Thank you for your feedback!');
  // feedbackForm.elements['form-name'].value = '';
  // feedbackForm.elements['form-feedback'].value = '';
  formName.value = '';
  formFeedback.value = '';
  syncTestimonials();
}

//Called by body, changes Testimonial every 10 seconds.
function changeTestimonial() {
  cycleCount < testimonialsQty - 1 ? cycleCount++ : cycleCount = 0;
  //Fading containers out
  testimonialImgContainer.style.opacity = '0';
  testimonialInfoContainer.style.opacity = '0';

  //Promise to change the Testimonial at 500ms
  let changeTestimonialInfo: Promise<any> = new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(`CHANGING TO ${testimonials[cycleCount].name}'s testimonial`);
      reject('Testimonial change failed.');
    }, 500);
  });
  changeTestimonialInfo.then((successMessage) => {
    testimonialImg.src = imgSrcPath + testimonials[cycleCount].img;
    testimonialTxt.innerText = testimonials[cycleCount].txt;
    testimonialName.innerText = testimonials[cycleCount].name;
    console.log(successMessage);
  });
  changeTestimonialInfo.catch((rejectMessage) => console.log(rejectMessage))

  //Prmoise to fade the testimonial info back in
  let fadeInfoBackIn: Promise<any> = new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('Fading testimonial back in.');
      reject('Fading information back in failed.');
    }, 750);
  });
  fadeInfoBackIn.then((successMessage) => {
    testimonialImgContainer.style.opacity = '100';
    testimonialInfoContainer.style.opacity = '100';
    console.log(successMessage);
  });
  fadeInfoBackIn.catch((rejectMessage) => console.log(rejectMessage));

  moveProgressBar();
}

//Function that animates the testimonials progress bar
function moveProgressBar() {
  let width = 1;
  let id = setInterval(frame, 10);

  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width += 0.1;
      bar.style.width = width + '%';
    }
  }
}

//Called by SyncClass just after updating the classes array
function loadClassCards() {

  classCardsGrid.innerHTML = '';

  //Checks the class filter value and sorts the list by it.
  switch (classFilter.value) {
    case 'by-price':
      sortedClasses = classes.sort((a, b) => {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }
        return 0;
      });
      break;
    case 'by-rating':
      sortedClasses = classes.sort((a, b) => {
        if (a.rating.stars < b.rating.stars) {
          return 1;
        }
        if (a.rating.stars > b.rating.stars) {
          return -1;
        }
        return 0;
      });
      break;
    case 'by-date':

      sortedClasses = classes.sort((a, b) => {
        if (numericDate(a.day) > numericDate(b.day)) {
          return 1;
        }
        if (numericDate(a.day) < numericDate(b.day)) {
          return -1;
        }
        return 0;
      });
      break;
    default:
      sortedClasses = classes;
      break;
  }

  //Number of cards shown depending the window's width
  let maxCardIndex = 2;
  if (window.outerWidth <= 900) maxCardIndex = 1;

  //Goes through the classes sorted deping on the filter's value
  sortedClasses.forEach((card, index) => {
    htmlStars = '';
    numberOfStars = 0;
    (card.rating.stars > 5) ? numberOfStars = 5 : numberOfStars = card.rating.stars;
    for (let j = 0; j < numberOfStars; j++) {
      htmlStars += '<img src="assets/star.png">';
    }
    (index > maxCardIndex) ? hiddenCard = 'hidden-card' : hiddenCard = '';

    classCardsGrid.innerHTML +=
      `<div class="class-card ${hiddenCard}">
      <div class="card-img-container">
      <img src="${imgSrcPath + card.img}" class="card-img"></div>
      <div class="card-info-container">
      <h3 id="class1-title">${card.title}</h3>
      <div class="main-info">
      <p class="class-price">$${card.price}</p>
      <div class="class-instructor">
      <div class="instructor-img"><img src="${imgSrcPath + card.instructor.img}"></div>
      <p class="instructor-name">${card.instructor.name}</p></div>
      <div class="class-rating"><div class="stars">${htmlStars}</div>
      <p class="reviews-number" id="class1-rating-reviews">(${card.rating.reviews} reviews)</p></div></div>
      <button class="full-class-btn">FULL CLASS</button>
      <div class="class-schedule">
      <p class="class-date" id="class1-day"><img src="assets/calendar.png">${card.day}</p>
      <p class="class-frequency" id="class1-frequency"><img src="assets/clock.png">${card.frequency}</p>
      <p class="class-sessions" id="class1-sessions"><img src="assets/book.png">${card.sessions} SESSIONS</p></div><hr></div><div>`

  });

  //Mantains the current view (hidden or shown)
  viewClassCardsToggle = !viewClassCardsToggle;
  viewClassCards(false);
}

//Internal function to convert a date string to number for easier comparison
function numericDate(date: string): number {
  numDate = date.charAt(8) + date.charAt(9) + date.charAt(10) + date.charAt(11);
  month = date.charAt(0) + date.charAt(1) + date.charAt(2);
  switch (month) {
    case 'JAN':
      numDate += '01';
      break;
    case 'FEB':
      numDate += '02';
      break;
    case 'MAR':
      numDate += '03';
      break;
    case 'APR':
      numDate += '04';
      break;
    case 'MAY':
      numDate += '05';
      break;
    case 'JUN':
      numDate += '06';
      break;
    case 'JUL':
      numDate += '07';
      break;
    case 'AUG':
      numDate += '08';
      break;
    case 'SEP':
      numDate += '09';
      break;
    case 'OCT':
      numDate += '10';
      break;
    case 'NOV':
      numDate += '11';
      break;
    case 'DEC':
      numDate += '12';
      break;
    default:
      numDate += '00';
      break;
  }

  numDate += date.charAt(4) + date.charAt(5);

  return parseInt(numDate);
}

//Loads Traiener Card Information (to be replaced)
function loadTrainerCards() {
  trainerCardsGrid.innerHTML = '';

  trainers.forEach(trainer => {
    trainerCardsGrid.innerHTML +=
      `<div class="trainer-card">
      <img src="${imgSrcPath + trainer.icon}" class="trainer-icon">
      <h3>${trainer.title}</h3>
      <p>${trainer.desc}</p></div>`
  });

}

//View More/Less Button function that shows or hides extra class cards
function viewClassCards(fromBtn: boolean) {

  for (let i = 0; i < hiddenCards.length; i++) {
    (!viewClassCardsToggle) ? hiddenCards[i].style.display = 'flex' : hiddenCards[i].style.display = 'none';
  }
  viewClassCardsToggle = !viewClassCardsToggle;
  (!viewClassCardsToggle) ? viewBtn.innerText = 'VIEW MORE' : viewBtn.innerText = 'VIEW LESS';

  if (fromBtn) {
    window.scrollBy({
      top: viewBtn.getBoundingClientRect().top - (screen.height * 0.75),
      behavior: 'smooth'
    });
  }
}