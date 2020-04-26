var picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'DD.MM.YYYY',
    toString(date, format) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        const year = date.getFullYear();

        if(month <10){
            month = '0'+ month
          }
          if(day <10){
            day = '0'+ day
          }
        return `${day}.${month}.${year}`;
    },
})

var picker = new Pikaday({
    field: document.getElementById('datepicker2'),
    format: 'DD/MM/YYYY',
    toString(date, format) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        const year = date.getFullYear();

        if(month <10){
            month = '0'+ month
          }
          if(day <10){
            day = '0'+ day
          }
        return `${day}.${month}.${year}`;
    },
});