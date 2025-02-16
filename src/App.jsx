import { Toaster } from 'react-hot-toast';

import './App.css';
import RoutesApp from './routes/Routes';

function App() {
    return (
      <>
      <Toaster />
      <main className='bg-zinc-900 h-screen'>
        <RoutesApp />
      </main>
      </>
    )
}

export default App;