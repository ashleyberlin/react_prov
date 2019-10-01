import React, { Component } from "react";
import { TestSSN, FormValid, NumberRegex, EmailRegex } from './validation/validation';
import './App.css';

class App extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      personalNumber:'',
      phoneNumber: '',
      email: '',
      country: '',
      formErrors: {
        personalNumber: "",
        phoneNumber: "",
        email: "",
        country: ""
      },
      countries:[]
    };
  }

  handleSubmit = e => {   
    if (FormValid(this.state)) {
      console.log(`
        --SUCCESS--
        Personal number: ${this.state.personalNumber}
        Phone number: ${this.state.phoneNumber}
        Email: ${this.state.email}
        Country: ${this.state.country}
      `);
      localStorage.clear();
    } else {
      e.preventDefault(); 
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  }

  //Validating the values on the inputs on change and setting state
  handleChange = e => {
    e.preventDefault();
 
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "personalNumber":
        formErrors.personalNumber =
          !TestSSN(value) ? "Invalid Personal Number" : "";
        break;
      case "phoneNumber":
        formErrors.phoneNumber =
        !NumberRegex.test(value) || value.length < 5 || value.length > 10  ? "Invalid Phone Number" : "";
        break;
      case "email":
        formErrors.email = 
        EmailRegex.test(value) ? "" : "Invalid email address";
      break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => this.setLocalStorage());
  }

  //Setting local storage
  setLocalStorage(){  
    const { personalNumber, phoneNumber, email, country, formErrors} = this.state;
    localStorage.setItem('personalNumber', personalNumber);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('email', JSON.stringify(email));
    localStorage.setItem('country', country);
    localStorage.setItem('formErrors', JSON.stringify(formErrors));
  }
 
  //Getting the local storage and displaying it in the input field   
  getLocalStorage(){
    if(localStorage.getItem('formErrors')){
      const formErrors =JSON.parse(localStorage.getItem('formErrors'));
      const personalNumber = localStorage.getItem('personalNumber');
      const phoneNumber = localStorage.getItem('phoneNumber');
      const email = JSON.parse(localStorage.getItem('email'));
      const country = localStorage.getItem('country');
      this.setState({ personalNumber, phoneNumber, country, email,formErrors})}
  }

  componentDidMount() {
    //Fetching the countries from the API and displaying them as options 
    fetch('https://restcountries.eu/rest/v2/all')
    .then(res => res.json())
    .then((data) => {
      let countries = data.map((country, index) => {
        return <option key={index} > {country.name} </option>})
        this.setState({countries:countries}, () => console.log(this.state) )
    })
    .catch(console.log);

    //populate the imputs on reload
    this.getLocalStorage();
  }

  render() {
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className='form-wrapper'>
          <h1>Create Account</h1>
            <form onSubmit={this.handleSubmit} noValidate>
                <div className='formfield'>
                  <label htmlFor='personalNumber'>Personal Number</label>
                  <input 
                  value= {this.state.personalNumber || ''}
                  pattern="[0-9]{10}" required
                  type='number' 
                  name='personalNumber'
                  className='{formErrors.personalNumber.length > 0 ? "error" : null}' 
                  placeholder='YYMMDDXXXX' 
                  onChange={this.handleChange}
                  noValidate
                  />
                  {formErrors.personalNumber.length > 0 && (
                  <span className="errorMessage">{formErrors.personalNumber}</span>
                  )}
                </div>
                <div className='formfield'>
                  <label htmlFor='phoneNumber'>Phone Number</label>
                  <input 
                  value= {this.state.phoneNumber || ''}
                  type='number'
                  name='phoneNumber' 
                  className='{formErrors.phoneNumber.length > 0 ? "error" : null}' 
                  placeholder='0XXXXXXXX' 
                  onChange={this.handleChange}
                  noValidate
                  />
                  {formErrors.phoneNumber.length > 0 && (
                  <span className="errorMessage">{formErrors.phoneNumber}</span>
                  )}
                </div>
                <div className='formfield'>
                  <label htmlFor='emailAddress'>Email Address</label>
                  <input 
                  value= {this.state.email || ''}
                  type='email' 
                  name= 'email'
                  className='{formErrors.email.length > 0 ? "error" : null}' 
                  placeholder='email@address.com' 
                  onChange={this.handleChange}
                  noValidate
                  />
                  {formErrors.email.length > 0 && (
                  <span className="errorMessage">{formErrors.email}</span>
                  )}
                </div>
                <div className='formfield'>
                  <label htmlFor='country'>Country</label>
                  <select 
                  id='country' 
                  name='country'
                  value= {this.state.country || ''}
                  onChange={this.handleChange}>
                  <option default>Select a country</option>
                  {this.state.countries}
                  </select>
                </div>
                <div className ='createAccount'>
                  <button type='submit'>Create Account</button>
                </div>
              </form>
        </div>
      </div>
    );
  }
}

export default App;
