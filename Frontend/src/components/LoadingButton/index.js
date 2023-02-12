import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function LoadingButton({children, isLoading, ...props}) {
  return (
    <Button {...props} >
      {isLoading
        ? <Spinner as="span" size="sm" animation="border" className="me-2" />
        : null
      }
      {children}
    </Button>
  );
}

export default LoadingButton;
