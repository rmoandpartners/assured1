import React from 'react'
import ReactDOM from 'react-dom/client'
import { OnboardingWizard } from './components/onboarding'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OnboardingWizard />
  </React.StrictMode>,
)
