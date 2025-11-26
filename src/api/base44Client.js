export const base44 = {
  auth: {
    me: async () => {
      // Simulamos que eres TÚ para que funcione el login
      return { email: 'busonlautaro@gmail.com' }; 
    },
    redirectToLogin: () => {
      console.log("Redirigiendo...");
      window.location.reload();
    }
  }
};