interface VenueItem{
    _id: string, name: string, address: string, district: string,
    province: string, postalcode: string, tel: string, picture: string, dailyrate: number
}

interface VenueJson{
    all_venues: VenueItem[]
}

export interface PetItem{
    _id:string,
    name:string,
    sex:string,
    type:string,
    breed:string,
    weight:number,
    picture:string,
    condition:string[],
    vaccinationHistory: Date[] | undefined
}

interface PetJson{
    all_pet: PetItem[]
}
interface HealthRecords{
    lastVacination: Date
}
export interface Schedule{
    _id:string,
    pet:PetItem,
    location:string,
    scheduleDate:Date
}