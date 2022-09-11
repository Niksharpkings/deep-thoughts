import decode from 'jwt-decode';

// AuthService class to handle authentication with jwt-decode.
class AuthService {
  //GET profile data that is saved in token and decode it.
  getProfile() {
    return decode(this.getToken());
  }

  // call for logged in user of they are still logged in to check token expiration.
  loggedIn() {
    // If token is expired, it will throw an error. If not, it will return false. decoded.exp is the expiration time of the token. Date.now() / 1000 is the current time divided by 1000 seconds.
    const token = this.getToken();
    // Using type coercion to check if token is NOT undefined and the token is NOT expired.
    return !!token && !this.isTokenExpired(token);
  }

  // check if the token has expired.
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      // If token is expired, it will throw an error. If not, it will return false. decoded.exp is the expiration time of the token. Date.now() / 1000 is the current time divided by 1000 seconds.
      return decoded.exp < Date.now() / 1000 ? true : false;
    } catch (err) {
      return false;
    }
  }

 // Retrieve token from local storage.
  getToken() {
    // Retrieves the user token from localStorage.
    return localStorage.getItem('id_token');
  }

  // While right after logging in, set token to localStorage and redirect the page to index.html(homepage).
  login(idToken) {
    // Saves user token to localStorage.
    localStorage.setItem('id_token', idToken);

    window.location.assign('/');
  }

  // While right after logging in, set token to localStorage and redirect the page to index.html(homepage).
  logout() {
    // Clear user token and profile data from localStorage.
    localStorage.removeItem('id_token');
    // This will reload the page and reset the state of the application.
    window.location.assign('/');
  }
}

export default new AuthService();