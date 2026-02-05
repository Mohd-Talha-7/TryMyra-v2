import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { GenerationsProvider } from './context/GenerationsContext';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import Wallet from './pages/Wallet';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen selection:bg-primary selection:text-white transition-colors duration-300">
        <WalletProvider>
          <GenerationsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wallet" element={<Wallet />} />
              </Routes>
            </Router>
          </GenerationsProvider>
        </WalletProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;