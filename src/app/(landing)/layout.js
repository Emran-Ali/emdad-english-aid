import {ApiProvider} from '@emran/Context/APIContext';
import '.././globals.css';

export const metadata = {
  title: 'Emdad English Aid',
  description: 'English Private program for HSC, Academic  and Admission',
};

export default function RootLayout({children}) {
  return (
    <main>
      <ApiProvider>{children}</ApiProvider>
    </main>
  );
}
