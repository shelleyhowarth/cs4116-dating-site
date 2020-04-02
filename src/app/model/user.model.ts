export class User {
    firstName: string; 
    lastName: string; 
    email: string;
    age: number;
    gender: string; 
    description: string; 
    county: string;
    occupation: string; 
    maritalStatus: string; 
    smoker: boolean;
    drinker: boolean; 
    favoriteSong: string; 
    favoriteMovie: string;
    interests: [];
    uid: string;

    constructor(){};

    // constructor(firstName, lastName, email, age, gender,
    //     description,county,occupation,martialStatus,smoker,drinker,favouriteSong,favouriteMovie,interests,uid){

    //         this.firstName = firstName;
    //         this.lastName = lastName;
    //         this.email = email;
    //         this.age = age;
    //         this.gender = gender;
    //         this.description = description;
    //         this.county= county;
    //         this.occupation = occupation;
    //         this.maritalStatus = martialStatus;
    //         this.smoker = smoker;
    //         this.drinker = drinker;
    //         this.favoriteSong = favouriteSong;
    //         this.favoriteMovie = favouriteMovie;
    //         this.interests = interests;
    //         this.uid = uid;
    //     }
        toString() {
            return this.firstName + ', ' + this.lastName + ', ' + this.email;
        }

        getFirstName(){
            return this.firstName;
        }
}

