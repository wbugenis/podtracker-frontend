const prettyTime = (timeStr) => {
    if (timeStr){
        timeStr = timeStr.toString();
        if (timeStr.includes(':')){
            return timeStr
        } else {
            let seconds = parseInt(timeStr);
            
            let hour = Math.floor(seconds/3600)+":"
            if (hour === 0) {
                hour = "";
            }

            let minute = Math.floor(seconds%3600/60);
            if(minute < 10){
                minute = "0" + minute;
            }

            let second = Math.floor(seconds%60);
            if (second < 10){
                second = "0" + second;
            }
            
            return `${hour}${minute}:${second}`;
        }
    } else return "Not provided";
}

export default prettyTime;