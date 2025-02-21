import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  companyName: yup.string().required('Company Name is required'),
  age: yup.number().positive().integer().required('Age is required'),
  dateOfBirth: yup.date().required('Date of Birth is required'),
  profileImage: yup.mixed().required('Profile Image is required')
});