// Available variables for different contexts in agent creation

export const COMMON_VARIABLES = [
  { name: 'name', description: 'Patient name' },
  // { name: 'business_name', description: 'Business/clinic name' },
  { name: 'doctor_name', description: 'Doctor name' },
  { name: 'doctor_specialty', description: 'Doctor specialty' },
  { name: 'doctor_bio', description: 'Doctor biography' },
  { name: 'consultation_price', description: 'Consultation price' },
  { name: 'consultation_duration', description: 'Consultation duration' },
  { name: 'payment_methods', description: 'Available payment methods' },
  { name: 'preferred_channel', description: 'Preferred communication channel' },
  { name: 'initial_appointment_date', description: 'Initial appointment date' },
  // { name: 'initial_appointment_time', description: 'Initial appointment time' },
  { name: 'social_proof_text', description: 'Social proof text' },
  { name: 'return_policy_days', description: 'Return policy days' },
  { name: 'confirmation_channel', description: 'Confirmation channel' }
];

export const GREETING_VARIABLES = [
  { name: 'name', description: 'Patient name' },
  // { name: 'business_name', description: 'Business/clinic name' },
  // { name: 'doctor_name', description: 'Doctor name' },
  // { name: 'assistant_name', description: 'Assistant name' }
];

export const SERVICE_DESCRIPTION_VARIABLES = [
  { name: 'doctor_name', description: 'Doctor name' },
  // { name: 'doctor_specialty', description: 'Doctor specialty' },
  { name: 'consultation_price', description: 'Consultation price' },
  { name: 'consultation_duration', description: 'Consultation duration' },
  // { name: 'payment_methods', description: 'Available payment methods' },
  { name: 'return_policy_days', description: 'Return policy days' }
];

export const AVAILABILITY_VARIABLES = [
  { name: 'doctor_name', description: 'Doctor name' },
  { name: 'initial_appointment_date', description: 'Initial appointment date' },
  // { name: 'initial_appointment_time', description: 'Initial appointment time' },
  // { name: 'preferred_channel', description: 'Preferred communication channel' },
  // { name: 'confirmation_channel', description: 'Confirmation channel' }
];

export const PAYMENT_VARIABLES = [
  { name: 'consultation_price', description: 'Consultation price' },
  // { name: 'payment_methods', description: 'Available payment methods' },
  // { name: 'preferred_channel', description: 'Preferred communication channel' },
  { name: 'confirmation_channel', description: 'Confirmation channel' }
];
