function checkTime(time2dark=17) {
  let hours = Number(new Date().toLocaleTimeString().split(":")[0]);
  if (hours > time2dark) {
    document.body.classList.add('darked')
    return;
  }

  document.body.classList.remove('darked')

}

checkTime();

setInterval(checkTime, 60_000);
