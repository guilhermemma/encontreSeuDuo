export function convertHour(hourString: String){
    const [hours, minutes] = hourString.split(':').map(Number) 

    const minutesAmount = hours + minutes;

    return minutesAmount
}