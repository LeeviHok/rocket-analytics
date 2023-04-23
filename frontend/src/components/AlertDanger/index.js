import Alert from 'react-bootstrap/Alert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function AlertDanger({children, ...props}) {
  return (
    <Alert variant="danger" {...props}>
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        size="xl"
        className="me-3"
      />
      {children}
    </Alert>
  );
}

export default AlertDanger;
