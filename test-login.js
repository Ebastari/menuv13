// Temporary script to test login functionality
console.log('=== Montana AI Login Tester ===');
console.log('Current isAuthenticated:', window.localStorage.getItem('montana_user_data'));
console.log('Current role:', window.localStorage.getItem('montana_user_role'));
console.log('Current OAuth status:', window.localStorage.getItem('montana_oauth_status'));

// Clear any existing auth data
window.localStorage.removeItem('montana_user_data');
window.localStorage.removeItem('montana_user_role');
window.localStorage.removeItem('montana_oauth_status');
console.log('\nAuth data cleared');
