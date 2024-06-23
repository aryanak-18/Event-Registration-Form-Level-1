import React, { useState, useEffect } from 'react';

// Custom hook for form validation
const useFormValidation = (initialState, validate, submit) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        submit();
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting, submit]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setValues({
      ...values,
      [name]: val,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

const validateForm = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }

  if (!values.age) {
    errors.age = 'Age is required';
  } else if (isNaN(values.age) || values.age <= 0) {
    errors.age = 'Age must be a number greater than 0';
  }

  if (values.attendingWithGuest && !values.guestName) {
    errors.guestName = 'Guest name is required if attending with a guest';
  }

  return errors;
};

const Summary = ({ data }) => (
  <div className="summary">
    <h2>Registration Summary</h2>
    <p><strong>Name:</strong> {data.name}</p>
    <p><strong>Email:</strong> {data.email}</p>
    <p><strong>Age:</strong> {data.age}</p>
    <p><strong>Attending with Guest:</strong> {data.attendingWithGuest ? 'Yes' : 'No'}</p>
    {data.attendingWithGuest && <p><strong>Guest Name:</strong> {data.guestName}</p>}
  </div>
);

const EventRegistrationForm = () => {
  const initialState = {
    name: '',
    email: '',
    age: '',
    attendingWithGuest: false,
    guestName: '',
  };

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  const submitForm = () => {
    setFormData(values);
    setSubmitted(true);
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = useFormValidation(initialState, validateForm, submitForm);

  if (submitted && formData) {
    return <Summary data={formData} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name" className='form-label'>Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className='form-label'>Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="age" className='form-label'>Age:</label>
        <input
          type="number"
          name="age"
          id="age"
          value={values.age}
          onChange={handleChange}
        />
        {errors.age && <p className="error">{errors.age}</p>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="attendingWithGuest"
            checked={values.attendingWithGuest}
            onChange={handleChange}
          />
          Are you attending with a guest?
        </label>
      </div>

      {values.attendingWithGuest && (
        <div>
          <label htmlFor="guestName" className='form-label'>Guest Name:</label>
          <input
            type="text"
            name="guestName"
            id="guestName"
            value={values.guestName}
            onChange={handleChange}
          />
          {errors.guestName && <p className="error">{errors.guestName}</p>}
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default EventRegistrationForm;
