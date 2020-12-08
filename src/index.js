import { getNumberOfDays, toHijri } from './hijri.js'
import { intervalToDuration, format, formatDuration } from 'date-fns'
import tr from 'date-fns/locale/tr'

let lang = 'en'


// Elements
const date = document.querySelector('input')
const givenBday = document.querySelector('#given-bday')
const actualBday = document.querySelector('#actual-bday')
const givenAge = document.querySelector('#given-age')
const actualAge = document.querySelector('#actual-age')
// const section1 = document.querySelector('#section-1')
const section2 = document.querySelector('#section-2')
let select = document.querySelector('#lang')

// Reset language selector to default
select.value = 'en'

// Check for an Turkish Region
const getLanguage = () => navigator.userLanguage || (navigator.languages && navigator.languages.length && navigator.languages[0]) || navigator.language || navigator.browserLanguage || navigator.systemLanguage || 'en';
if (getLanguage().match(/tr/i)){
    lang = 'tr';
    select.value = 'tr';
    document.querySelectorAll('.tr').forEach((a) => a.classList.add('visible'))
    document
      .querySelectorAll('.tr')
      .forEach((a) => a.classList.remove('hidden'))
    document.querySelectorAll('.en').forEach((a) => a.classList.add('hidden'))
  }
  
// Language Listener
select.addEventListener('click', (e)=> setLanguage(e))

    function setLanguage(e) {
  
      if (e.originalTarget.value === 'tr') {
        lang = 'tr'
        document.querySelectorAll('.tr').forEach((a) => a.classList.add('visible'))
        document
          .querySelectorAll('.tr')
          .forEach((a) => a.classList.remove('hidden'))
        document.querySelectorAll('.en').forEach((a) => a.classList.add('hidden'))
        date.value && populate()
        console.log(lang)
      } else {
        lang = 'en'
        document.querySelectorAll('.en').forEach((a) => a.classList.add('visible'))
        document
          .querySelectorAll('.en')
          .forEach((a) => a.classList.remove('hidden'))
        document.querySelectorAll('.tr').forEach((a) => a.classList.add('hidden'))
        date.value && populate()
        console.log(lang)
      }
    }

// Event Listener
date.addEventListener('change', () => populate())

function populate() {
  if (new Date() > new Date(date.value)) {
    section2.classList.remove('hide')
    let givenDate = new Date(date.value)
    let dayOfTheWeek
    lang === 'en'
      ? (dayOfTheWeek = format(givenDate, 'iiii'))
      : (dayOfTheWeek = format(givenDate, 'iiii', { locale: tr }))

    // Given Birth Day
    lang === 'en'
      ? (givenBday.textContent = format(givenDate, 'MMMM d y, iiii'))
      : (givenBday.textContent = format(givenDate, 'd MMMM y, iiii', {
          locale: tr,
        }))

    // Actual Birth Day
    const ad = toHijri(date.value)
    let hMonthName = lang === 'en' ? hMonths[ad.hm] : hMonthsTr[ad.hm]
    actualBday.textContent = lang==='en' ? 
    `${hMonthName} ${ad.hd} ${ad.hy}, ${dayOfTheWeek}`
    :`${ad.hd} ${hMonthName} ${ad.hy}, ${dayOfTheWeek}`

    // Expected Age
    let duration = intervalToDuration({
      start: givenDate,
      end: new Date(),
    })
    givenAge.textContent =
      lang === 'en'
        ? formatDuration(duration, {
            format: ['years', 'months', 'days'],
          }).replace(/\s(\d+\s\w+$)/, ' and $1')
        : formatDuration(duration, {
            format: ['years', 'months', 'days'],
            locale: tr,
          })

    // Actual Age
    let todayHijri = toHijri(new Date().toISOString().split('T')[0]) //?
    todayHijri = Object.values(todayHijri).join('-')
    let z = Object.values(ad).join('-')
    let [yy, mm, dd] = hijriDateDiff(todayHijri, z)
    let formattedDuration = lang === 'en' ? 
    formatDuration(
      { years: yy, months: mm, days: dd },
      { format: ['years', 'months', 'days'] },
    )
    :formatDuration(
      { years: yy, months: mm, days: dd },
      { format: ['years', 'months', 'days'], locale:tr },
    )

    actualAge.textContent = formattedDuration.replace(
      /\s(\d+\s\w+$)/,
      ' and $1',
    ) 
  } else {
    alert('Pick a date valid date.')
  }
}

let todayHijri = toHijri(new Date().toISOString().split('T')[0]) //?

hijriDateDiff('1442-4-20', '1429-2-21') //?

function hijriDateDiff(today, given) {
  let daysInTheMonth = getNumberOfDays(given) //?
  today = today.split('-').map((a) => +a)
  given = given.split('-').map((a) => +a)

  let day, mon, year
  // Make sure the date is older than today.
  if (today[0] < given[0]) return console.log('given date must be older today')

  // Borrow a month if needed
  if (today[2] < given[2]) {
    ;('bigger')
    today[1]--
    today[2] += daysInTheMonth
  }

  // Borrow a year if needed
  if (today[1] < given[1]) {
    today[0]--
    today[1] += 12
  }

  day = today[2] - given[2] //?
  mon = today[1] - given[1] //?
  year = today[0] - given[0] //?

  return [year, mon, day]
}

const hMonths = {
  1: 'Muharram',
  2: 'Safar',
  3: 'Rabiʿ al-Awwal',
  4: 'Rabiʿ al-Akhir',
  5: 'Jumada al-Ula',
  6: 'Jumada al-Akhirah',
  7: 'Rajab',
  8: 'Shaʿban',
  9: 'Ramadan',
  10: 'Shawwal',
  11: 'Dhu al-Qaʿdah',
  12: 'Dhu al-Hijjah',
}

const hMonthsTr = {
  1: 'Muharram',
  2: 'Sefer',
  3: 'Rabiul-Evvel',
  4: 'Rabiul-Ahir',
  5: 'Cumedel-Ule',
  6: 'Cumedel-Ahirah',
  7: 'Raceb',
  8: 'Şaban',
  9: 'Ramadan',
  10: 'Şevval',
  11: 'Dhul-Kade',
  12: 'Dhul-Hicceh',
}
