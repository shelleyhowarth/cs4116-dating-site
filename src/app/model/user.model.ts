export class User {
    FirstName: string; 
    LastName: string; 
    email: string;
    Age: number;
    Gender: string; 
    Description: string; 
    county: string;
    occupation: string; 
    martialStatus: string; 
    smoker: boolean;
    drinker: boolean; 
    FavoriteSong: string; 
    FavoriteMovie: string

    constructor(firstName, lastName, email, age, gender,
        description,county,occupation,martialStatus,smoker,drinker,favouriteSong,favouriteMovie){

            this.FirstName = firstName;
            this.LastName = lastName;
            this.email = email;
            this.Age = age;
            this.Gender = gender;
            this.Description = description;
            this.county= county;
            this.occupation = occupation;
            this.martialStatus =martialStatus;
            this.smoker = smoker;
            this.drinker = drinker;
            this.FavoriteSong = favouriteSong;
            this.FavoriteMovie = favouriteMovie;
        }
        toString() {
            return this.FirstName + ', ' + this.LastName + ', ' + this.email;
        }
}

