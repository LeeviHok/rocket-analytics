import LoadingButton from "../LoadingButton";

function SubmitButton({children, isSubmitting, ...props}) {
  return (
    <LoadingButton
      isLoading={isSubmitting}
      disabled={isSubmitting}
      type="submit"
      form="flight-creation-form"
      {...props}
    >
      {children}
    </LoadingButton>
  );
}

export default SubmitButton;
