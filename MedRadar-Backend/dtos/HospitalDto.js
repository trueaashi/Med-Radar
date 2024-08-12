class HospitalDto{
    id;
    name;
    img;
    approved;
    contacts;
    address;
    doctors;
    facilities;
    specialties;
    treatments;

    constructor(hospital){
        this.id = hospital._id;
        this.name = hospital.name;
        this.profilePic = hospital.profilePic;
        this.address = hospital.address;
        this.approved = hospital.approved;
        this.contacts = hospital.contact;
        this.facilities = hospital.facilities;
        this.specialties = hospital.specialties;
        this.treatments = hospital.treatments;
        this.doctors = hospital.doctors;
    }
}

module.exports = HospitalDto;