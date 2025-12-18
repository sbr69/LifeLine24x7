export interface LoginCredentials {
  email: string;
  password: string;
}

export interface HospitalRegistrationData {
  hospitalName: string;
  email: string;
  contactNumber: string;
  address: string;
  icuBeds: string;
  hduBeds: string;
  generalBeds: string;
  password: string;
  confirmPassword: string;
}
