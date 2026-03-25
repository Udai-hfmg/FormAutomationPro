import Form1 from "../components/Forms/Form1";
import HIPAANotice from "../components/Forms/HIPPANotice";
import HPVScreening from "../components/Forms/HPVScreening";
import NewPatientForm from "../components/Forms/NewPatientForm";
import PatientPaymentAgreement from "../components/Forms/PatientPaymentAgreement";
import PaymentAndCollectionPolicy from "../components/Forms/PaymentAndCollectionPolicy";
import PrivacyPracticesForm from "../components/Forms/PrivacyPracticesForm";
import YourInsuranceCompany from "../components/Forms/YourInsuranceCompany";

export const formRegistry: Record<string, React.ComponentType<any>> = {
  "patient-intake": NewPatientForm,
  "hipaa-checklist": HIPAANotice    ,
  "payment-agreement": PatientPaymentAgreement,
  "email-capture-form": Form1,
  "hpv-screening-consent": HPVScreening,
  "insurance-information": YourInsuranceCompany,
  "patient-collection-policy": PaymentAndCollectionPolicy,
  "privacy-practices": PrivacyPracticesForm
};