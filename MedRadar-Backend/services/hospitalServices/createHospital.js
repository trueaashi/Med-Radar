const Hospital = require("../../models/Hospital");

class createHospitalServices {
  async createHospital(data, hashedPassword) {
    const { name, pincode, phone, state, city, location, email } = data;

    return await Hospital.create({
      name,
      email,
      password: hashedPassword,
      contact: {
        phone: phone,
        email: email,
      },
      address: {
        state: state,
        city: city,
        location: location,
        pincode: pincode,
      },
    });
  }
}

module.exports = new createHospitalServices();
