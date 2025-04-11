import moment from "moment"

export default {
    ifequal(a,b,options){
        if(a == b){
            return options.fn(this)
        }
        return options.inverse(this)
    },
    getFullNameFirstCharacter(firstName,lastName){
        return lastName.charAt(0)+firstName.charAt(0)
    },
    formatDate(date){
       return moment(date).format("DDMMM  YYYY")
    }
}