import './App.css'
import Form1 from './components/Forms/Form1'
import NewPatientForm from './components/Forms/NewPatientForm'
import PrivacyPracticesForm from './components/Forms/PrivacyPracticesForm'
import PaymentAndCollectionPolicy from './components/Forms/PaymentAndCollectionPolicy'
import PatientPaymentAgreement from './components/Forms/PatientPaymentAgreement'
import YourInsuranceCompany from './components/Forms/YourInsuranceCompany'
import HPVScreening from './components/Forms/HPVScreening'
import HIPAANotice from './components/Forms/HIPPANotice'

function App() {

  return (
    <>
    <Form1/>
    <NewPatientForm/>
    <HIPAANotice/>
    <HPVScreening/>
    <YourInsuranceCompany/>
    <PatientPaymentAgreement/>
    <PaymentAndCollectionPolicy/>
    <PrivacyPracticesForm/>
    </>
  )
}

export default App
