import { useParams, useSearchParams } from "react-router";
import { formRegistry } from "../../Registry/formRegistry";

const RenderForm = () => {

  const { formIds } = useParams();
  const [searchParams] = useSearchParams();

  const patientId = searchParams.get("patientId");

  const forms = formIds?.split(",") || [];

  console.log("Rendering forms:", forms, "for patientId:", patientId);

  return (
    <div className="space-y-10">

      {forms.map((formId) => {
        const FormComponent = formRegistry[formId];

        if (!FormComponent) return null;

        return (
          <FormComponent
            key={formId}
            patientId={patientId}
          />
        );
      })}

    </div>
  );
};

export default RenderForm;