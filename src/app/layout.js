// app/layout.js
import JWTAuthAuthProvider from '@auth/AuthProvider'; // update path if needed

export const metadata = {
  title: 'Emdad English Aid',
  description: 'English Private program for HSC, Academic  and Admission',
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
    <body>
    <JWTAuthAuthProvider>{children}</JWTAuthAuthProvider>
    </body>
    </html>
  );
}
