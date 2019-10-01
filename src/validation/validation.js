const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  
const numberRegex = RegExp(/^0[0-9].*$/);

//Tests the ssn number is 10 digits long and coheres to Luhn algorithm
const testSSN = (ssn) => {
    ssn = ssn
        .replace(/\D/g, "")     // strip out all but digits
        .split("")              // convert string to array
        .reverse()              // reverse order for Luhn
        .slice(0, 10);          // keep only 10 digits (i.e. 1977 becomes 77)
  
    // verify we got 10 digits, otherwise it is invalid
    if (ssn.length !== 10) {
        return false;
    }
  
    var sum = ssn
        // convert to number
        .map(function(n) {
            return Number(n);
        })
        // perform arithmetic and return sum
        .reduce(function(previous, current, index) {
            // multiply every other number with two
            if (index % 2) current *= 2;
            // if larger than 10 get sum of individual digits (also n-9)
            if (current > 9) current -= 9;
            // sum it up
            return previous + current;
        });
  
    // sum must be divisible by 10
    return 0 === sum % 10;
  };

//Checks that the form has been filled out and if there are errors before submitting
const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
    //validate form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
  
    // validate the form was filled out
    Object.values(rest).forEach(val => {
      (val === null || val === 'null' || val=== '') && (valid = false);
    });
  
    return valid;
};

export {formValid as FormValid, testSSN as TestSSN, emailRegex as EmailRegex, numberRegex as NumberRegex};