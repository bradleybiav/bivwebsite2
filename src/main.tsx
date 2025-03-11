
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import BrainScene from './components/BrainScene.tsx'

createRoot(document.getElementById("root")!).render(<BrainScene />);
